'use babel';

import YumlGeneratorView from './yuml-generator-view';
import { CompositeDisposable } from 'atom';

export default {

  yumlGeneratorView: null,
  renderPanel: null,
  subscriptions: null,

  config: {
    diagramStyle: {
      type: 'string',
      enum: ['boring', 'plain', 'scruffy'],
      default: 'plain',
    },
    diagramType: {
      type: 'string',
      enum: ['activity', 'class', 'usecase'],
      default: 'class',
    },
    diagramSize: {
      type: 'string',
      enum: ['huge', 'big', 'normal', 'small', 'tiny'],
      default: 'normal',
    },
    diagramDirection: {
      type: 'string',
      enum: ['left', 'right', 'down'],
      default: 'down',
    },
    instanceUri: {
      title: 'yUML Instance URL',
      type: 'string',
      default: 'https://yuml.me',
    },
  },

  activate(state) {
    this.yumlGeneratorView = new YumlGeneratorView(state.yumlGeneratorViewState);
    this.renderPanel = atom.workspace.addRightPanel({
      item: this.yumlGeneratorView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'yuml-generator:generate': () => this.generate()
    }));
  },

  deactivate() {
    this.renderPanel.destroy();
    this.subscriptions.dispose();
    this.yumlGeneratorView.destroy();
  },

  serialize() {
    return {
      yumlGeneratorViewState: this.yumlGeneratorView.serialize()
    };
  },

  generate() {
    return (
      this.renderPanel.isVisible() ?
        this.renderPanel.hide() :
        this.getUmlDocument()
          .then(umlDocument => this.sendUmlDocument(umlDocument))
          .then(umlUrl => this.renderUmlDiagram(umlUrl))
    );
  },

  getUmlDocument() {
    return new Promise((resolve, reject) => {
      let activeEditor = atom.workspace.getActiveTextEditor();
      let selectedText = activeEditor.getSelectedText();

      if (selectedText !== '') {
        return resolve({
          content: selectedText.replace(/\n/g, ', '),
        });
      }

      let cursorRow = activeEditor.getCursorBufferPosition().row;
      let editorText = atom.workspace.getActiveTextEditor().getText();
      let editorTextArray = editorText.split(/\r\n|\r|\n/);

      let startRow = cursorRow;
      let endRow = cursorRow;

      let foundStartRow = false;
      let foundEndRow = false;

      while (false === foundStartRow && startRow !== 0) {
        startRow--;

        if (
          editorTextArray[startRow].indexOf('```yuml') === 0 ||
          editorTextArray[startRow] === undefined
        ) {
          foundStartRow = true;
        }
      }

      while (false === foundEndRow) {
        endRow++;

        if (
          editorTextArray[endRow] === '```' ||
          editorTextArray[endRow] === undefined
        ) {
          foundEndRow = true;
        }
      }

      let diagramSettings = editorTextArray.slice(startRow, startRow+1);
      let rangeText = editorTextArray.slice(startRow, endRow);

      let hasHeader = diagramSettings[0].indexOf('```yuml') !== -1;

      let diagramType = (hasHeader && diagramSettings[0].split(':')[1] !== undefined) ?
        diagramSettings[0].split(':')[1] :
        atom.config.get('yuml-generator.diagramType');

      let diagramStyle = (hasHeader && diagramSettings[0].split(':')[2] !== undefined) ?
        diagramSettings[0].split(':')[2] :
        atom.config.get('yuml-generator.diagramStyle');

      resolve({
        content: (hasHeader) ? rangeText.slice(1) : rangeText,
        type: diagramType,
        style: diagramStyle,
      });
    });
  },

  sendUmlDocument(umlDocument) {
    return new Promise((resolve, reject) => {
      let yumlApiUrl = atom.config.get('yuml-generator.instanceUri');
      let diagramDirection = this.getDiagramDirection(umlDocument);
      let diagramSize = this.getDiagramSize();

      let diagramType = (umlDocument.type !== undefined) ?
        umlDocument.type : atom.config.get('yuml-generator.diagramType');

      let diagramStyle = (umlDocument.style !== undefined) ?
        umlDocument.style : atom.config.get('yuml-generator.diagramStyle');

      let callUri = yumlApiUrl + '/diagram/' +
        diagramStyle + ';' +
        'scale:' + diagramSize + ';' +
        'dir:' + diagramDirection + '/' +
        diagramType + '/';

      fetch(callUri, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }),
        body: 'name=&dsl_text=' + encodeURIComponent(umlDocument.content)
      }).then(response => {
        return response.text();
      }).then(response => {
        umlDocument.url = yumlApiUrl + '/' + response.replace('.png', '.svg');
        resolve(umlDocument);
      }).catch(err => {

      });
    });
  },

  renderUmlDiagram(umlDocument) {
    let image = document.createElement('img');

    image.setAttribute('src', umlDocument.url);

    if (this.image) {
      this.renderPanel.getElement().firstChild.replaceChild(image, this.image);
    } else {
      this.renderPanel.getElement().firstChild.appendChild(image);
    }

    this.image = image;

    this.renderPanel.show();
  },

  getDiagramSize() {
    let scales = {
      'huge': '180',
      'big': '120',
      'normal': '100',
      'small': '80',
      'tiny': '60',
    };

    return scales[atom.config.get('yuml-generator.diagramSize')];
  },

  getDiagramDirection(umlDocument) {
    let directions = {
      'left': 'LR',
      'right': 'RL',
      'down': 'TB',
    };

    return (umlDocument.type === 'activity') ?
      'LR' : directions[atom.config.get('yuml-generator.diagramDirection')];
  },

};
