if (!window.frame) {
  window.frame = function frame() {
    requestAnimationFrame(frame);
    if (window.wasm) {
      window.wasm.update();
    }
  }
  requestAnimationFrame(window.frame);
}

require("./index.ts");
