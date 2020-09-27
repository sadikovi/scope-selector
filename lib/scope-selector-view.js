'use babel';

export default class ScopeSelectorView {
  width() {
    return 200;
  }

  height() {
    return 100;
  }

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('scope-selector');
    this.element.style.width = this.width() + "px";
    this.element.style.height = this.height() + "px";
    // Create message element
    this.message = document.createElement('div');
    this.message.classList.add('message');
    this.element.appendChild(this.message);
    document.body.appendChild(this.element);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  setCoordinates(x, y, width, height) {
    const offset = 5;

    if (width != null && x + offset + this.width() >= width) {
      x = x - this.width();
    }
    if (height != null && y + offset + this.height() >= height) {
      y = y - this.height();
    }
    this.element.style.left = (x + offset) + "px";
    this.element.style.top = (y + offset) + "px";
  }

  unsetScope() {
    this.message.textContent = null;
  }

  setScope(text, scopes) {
    this.message.textContent = text + ' ' +
      scopes.map((o) => 'grammar: ' + o.grammar + ' # ' + o.scope).join(' ');
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
}
