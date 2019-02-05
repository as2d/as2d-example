import "allocator/tlsf";

import {
  CanvasRenderingContext2D,
  getContextById,
  TextBaseline,
  TextAlign,
} from "../node_modules/as2d/assembly/index";

let ctx: CanvasRenderingContext2D;
let x: f64 = 0;
let y: f64 = 0;

export function init(): void {
  ctx = getContextById("main");
}

export function mouseMove(mouseX: f64, mouseY: f64): void {
  x = mouseX;
  y = mouseY;
}
export function update(): void {
  if (!ctx) return;
  ctx.clearRect(0, 0, 800, 600);
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();
}
