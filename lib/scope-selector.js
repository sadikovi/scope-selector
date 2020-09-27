'use babel';

import ScopeSelectorView from './scope-selector-view';
import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,
  visible: false,
  view: null,

  activate(state) {
    this.visible = false;
    // this.view = new ScopeView();
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'scope-selector:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    document.removeEventListener('mouseover', this.handler);
    // this.view.destroy();
  },

  serialize() {
    return {};
  },

  toggle() {
    if (this.visible) {
      document.removeEventListener('mouseover', this.handler);
      // this.view.hide();
    } else {
      document.addEventListener('mouseover', this.handler);
      // this.view.show();
    }
    this.visible = !this.visible;
  },

  handler(event) {
    if (event.path != null && event.path.length > 0) {
      const path = event.path;

      // Find div.line element,
      // this indicates that we are on a particular line of the text editor.
      var stop = -1;
      for (var i = 0; i < path.length; i++) {
        if (path[i].tagName == 'DIV' && path[i].className == 'line') {
          stop = i;
          break;
        }
      }

      // Found "div.line" element, collect the scopes
      if (stop > 0) {
        // Find the text that we are hovering
        var text = null;
        if (path[0].children.length == 0) {
          // If a leaf node does not contain any child nodes, that means it has an assigned scope,
          // so just get the element's text content.
          text = path[0].textContent;
        } else {
          // Otherwise, the selected text does not have an assigned scope, so we need to figure out
          // the cursor position to find the chunk of text the cursor is pointing to.
          var prev = 0; // previous distance
          var next = 0; // next distance
          var idx = 0; // current node index
          const nodes = path[0].childNodes;
          while (idx < nodes.length) {
            if (nodes[idx].nodeType == 3) {
              next = idx + 1 < nodes.length ? nodes[idx + 1].offsetLeft : event.offsetX;
            } else {
              next = nodes[idx].offsetLeft;
            }
            // Text node is within the prev and next, select the text content.
            if (nodes[idx].nodeType == 3 && prev <= event.offsetX && event.offsetX <= next) {
              text = nodes[idx].textContent;
              break;
            }
            idx++;
            prev = next;
          }
        }

        // Collect the scopes for the stack of elements.
        const scopes = [];
        for (var i = 0; i < stop; i++) {
          if (path[i].className) {
            var grammar = false; // indicates if this scope comes from a language grammar
            // Clean up the scope, remove unnecessary prefixes and join with "."
            const scope = path[i].className.split(" ").map(function (s) {
              const prefix = "syntax--";
              if (s.startsWith(prefix)) {
                grammar = true;
                return s.substring(prefix.length);
              }
              return s;
            }).join(".");
            scopes.push({grammar: grammar, scope: scope});
          }
        }

        console.log("Text", text, "Scopes", scopes);
      }
    }
  }
};
