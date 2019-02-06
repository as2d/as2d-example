if (!window.frame) {
  window.frame = function frame() {
    requestAnimationFrame(frame);
    if (window.wasm) {
      window.wasm.update();
    }
  }
  requestAnimationFrame(window.frame);
}

if (!window.Buffer) window.Buffer = require("buffer").Buffer;

require("./index.ts");
