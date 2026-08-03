// Tracks currently pressed keys and exposes helpers for "just pressed"
// edge-detection, which is what we want for grid-based movement and
// dialog advancement (one action per key press, not per frame).
export class Input {
  constructor() {
    this.keysDown = new Set();
    this.justPressed = new Set();

    window.addEventListener("keydown", (e) => {
      if (!this.keysDown.has(e.code)) {
        this.justPressed.add(e.code);
      }
      this.keysDown.add(e.code);
    });

    window.addEventListener("keyup", (e) => {
      this.keysDown.delete(e.code);
    });
  }

  isDown(code) {
    return this.keysDown.has(code);
  }

  wasPressed(code) {
    return this.justPressed.has(code);
  }

  // Call once per frame after input has been consumed for that frame.
  endFrame() {
    this.justPressed.clear();
  }
}

export const KEYS = {
  UP: ["ArrowUp", "KeyW"],
  DOWN: ["ArrowDown", "KeyS"],
  LEFT: ["ArrowLeft", "KeyA"],
  RIGHT: ["ArrowRight", "KeyD"],
  ACTION: ["KeyZ", "Enter", "Space"],
};

export function anyPressed(input, codes) {
  return codes.some((c) => input.wasPressed(c));
}

export function anyDown(input, codes) {
  return codes.some((c) => input.isDown(c));
}
