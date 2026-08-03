// Manages a queue of text pages shown in a dialog box, used both for the
// intro story sequence and for NPC conversations. Advancing is driven by
// the caller (on ACTION key press) so it works identically for both cases.
export class Dialog {
  constructor() {
    this.pages = [];
    this.index = 0;
    this.active = false;
    this.onComplete = null;
  }

  start(pages, onComplete = null) {
    this.pages = pages;
    this.index = 0;
    this.active = pages.length > 0;
    this.onComplete = onComplete;
  }

  get currentText() {
    return this.pages[this.index] ?? "";
  }

  get isLastPage() {
    return this.index >= this.pages.length - 1;
  }

  // Advances to the next page, or closes the dialog if it was the last one.
  advance() {
    if (!this.active) return;

    if (this.isLastPage) {
      this.active = false;
      const callback = this.onComplete;
      this.onComplete = null;
      if (callback) callback();
      return;
    }

    this.index += 1;
  }
}
