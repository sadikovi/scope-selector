'use babel';

export default class ScopeSelectorView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement("div");
    this.element.classList.add("scope-selector");

    // Create text element
    const textDiv = document.createElement("div");
    textDiv.classList.add("block");
    this.text = document.createElement("code");
    this.text.classList.add("inline-block", "highlight-warning");
    textDiv.appendChild(this.text);
    this.element.appendChild(textDiv);

    // Create scope element
    this.scope = document.createElement("div");
    this.scope.classList.add("block");
    this.element.appendChild(this.scope);

    document.body.appendChild(this.element);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  setCoordinates(x, y, width, height) {
    const offset = 5;
    const currWidth = this.element.offsetWidth;
    const currHeight = this.element.offsetHeight;

    if (width != null && x + offset + currWidth >= width) {
      x = x - currWidth;
    }

    if (height != null && y + offset + currHeight >= height) {
      y = y - currHeight;
    }
    this.element.style.left = (x + offset) + "px";
    this.element.style.top = (y + offset) + "px";
  }

  unsetScope() {
    this.element.style.display = "none";
  }

  setScope(text, scopes) {
    this.element.style.display = "block";
    this.text.innerHTML = null;
    this.scope.innerHTML = null;

    if (text != null && scopes != null) {
      this.text.textContent = text;
      const ul = this.createListElement(scopes, 0);
      if (ul != null) {
        this.scope.appendChild(ul);
      }
    }
  }

  // Tear down any state and detach
  destroy() {
    this.text.remove();
    this.scope.remove();
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  createListElement(scopes, i) {
    if (i >= scopes.length) return null;

    const ul = document.createElement("list-tree");
    ul.classList.add("list-tree");

    const li = document.createElement("li");
    li.classList.add("list-nested-item");

    li.appendChild(this.createListItem(scopes[i].scope, scopes[i].grammar));
    const child = this.createListElement(scopes, i + 1);
    if (child != null) {
      li.append(child);
    }

    ul.appendChild(li);
    return ul;
  }

  createListItem(scope, grammar) {
    const div = document.createElement("div");
    div.classList.add("list-item");

    // scope element
    const span = document.createElement("span");
    span.classList.add("inline-block", "icon", "icon-code");
    span.textContent = scope;
    div.appendChild(span);

    // grammar element
    if (!grammar) {
      const span = document.createElement("span");
      span.classList.add("inline-block", "badge", "badge-info");
      span.textContent = "not grammar";
      div.appendChild(span);
    }

    return div;
  }
}
