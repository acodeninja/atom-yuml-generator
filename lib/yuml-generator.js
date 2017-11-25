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
      resolve(
        atom.workspace.getActiveTextEditor().getSelectedText().length > 0 ?
        atom.workspace.getActiveTextEditor().getSelectedText() :
        atom.workspace.getActiveTextEditor().getText()
      );
    });
  },

  sendUmlDocument(umlDocument) {
    return new Promise((resolve, reject) => {
      let yumlApiUrl = atom.config.get('yuml-generator.instanceUri');
      let diagramStyle = atom.config.get('yuml-generator.diagramStyle');
      let diagramDirection = this.getDiagramDirection();
      let diagramSize = this.getDiagramSize();
      let diagramType = atom.config.get('yuml-generator.diagramType');

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
        body: 'name=&dsl_text=' + encodeURIComponent(umlDocument.replace(/\n/g, ', '))
      }).then(response => {
        return response.text();
      }).then(response => {
        resolve(yumlApiUrl + '/' + response.replace('.png', '.svg'));
      }).catch(err => {

      });
    });
  },

  renderUmlDiagram(umlUrl) {
    let image = document.createElement('img');
    image.setAttribute('src', umlUrl);

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

  getDiagramDirection() {
    let directions = {
      'left': 'LR',
      'right': 'RL',
      'down': 'TB',
    };

    return directions[atom.config.get('yuml-generator.diagramDirection')];
  },

};
