'use babel';

export default class ScopeSelectorView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('scope-selector');

    // Create message element
    this.message = document.createElement('div');
    this.message.classList.add('message');
    this.element.appendChild(this.message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  hide() {
    this.element.style.display = 'none';
  }

  show() {
    this.element.style.display = 'block';
  }

  reset() {
    this.message.textContent = null;
  }

  update(screenX, screenY, text, scopes) {
    this.message.textContent = text + '\n' +
      scopes.map((o) => 'grammar: ' + o.grammar + ' # ' + o.scope).join('\n');
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
}
