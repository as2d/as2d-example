import { instantiateStreaming, instantiateBuffer } from "as2d";
const fs = require("fs");
const buffer = fs.readFileSync("./build/optimized.wasm");

async function streaming(): Promise<void> {
  const blob = new Blob([buffer], { type: "application/wasm" });
  const url = URL.createObjectURL(blob);
  // @ts-ignore
  window.wasm = await instantiateStreaming<AS2DExample>(fetch(url), {});
}

interface AS2DExample {
  init(): void;
  mouseMove(x: number, y: number): void;
}

// @ts-ignore
if (typeof WebAssembly.instantiateStreaming === "function") {
  streaming().then(postInstantiate);
} else {
  // @ts-ignore
  window.wasm = instantiateBuffer<AS2DExample>(buffer, {});
  postInstantiate();
}

function postInstantiate() {
  // @ts-ignore
  const wasm = window.wasm;
  const canvas = document.querySelector("canvas");
  if (canvas) {
    canvas.parentElement!.removeChild(canvas);
  }

  const ctx = document.createElement("canvas")!.getContext("2d")!;
  ctx.canvas.width = 800;
  ctx.canvas.height = 600;
  ctx.canvas.style.border = "solid 1px black";
  ctx.canvas.addEventListener("mousemove", (e) => {
    var rect: ClientRect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    wasm.mouseMove(e.clientX - rect.left, e.clientY - rect.top);
  });

  document.body.appendChild(ctx.canvas);
  wasm.useContext("main", ctx);
  wasm.init();
}

