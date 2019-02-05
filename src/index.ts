import { instantiateStreaming } from "as2d";
const fs = require("fs");

const buffer = fs.readFileSync("./build/optimized.wasm");
const blob = new Blob([buffer], { type: "application/wasm" });
const url = URL.createObjectURL(blob);

interface AS2DExample {
  init(): void;
  mouseMove(x: number, y: number): void;
}

async function main() {
  const wasm = await instantiateStreaming<AS2DExample>(fetch(url), {});
  // @ts-ignore
  window.wasm = wasm;

  const canvas = document.querySelector("canvas");
  if (canvas) {
    canvas.parentElement!.removeChild(canvas);
  }

  const ctx = document.createElement("canvas")!.getContext("2d")!;
  ctx.canvas.width = 800;
  ctx.canvas.height = 600;
  document.body.appendChild(ctx.canvas);
  wasm.init();
  wasm.useContext("main", ctx);
}

main();
