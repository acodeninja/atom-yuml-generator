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
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  getUmlDocument() {
  },

  sendUmlDocument(umlDocument) {
  },

  renderUmlDiagram(umlUrl) {

  },

};
