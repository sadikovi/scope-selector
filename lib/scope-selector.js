'use babel';

import ScopeSelectorView from './scope-selector-view';
import { CompositeDisposable } from 'atom';

export default {

  scopeSelectorView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.scopeSelectorView = new ScopeSelectorView(state.scopeSelectorViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.scopeSelectorView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'scope-selector:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.scopeSelectorView.destroy();
  },

  serialize() {
    return {
      scopeSelectorViewState: this.scopeSelectorView.serialize()
    };
  },

  toggle() {
    console.log('ScopeSelector was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
