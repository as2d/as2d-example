import "allocator/tlsf";

import {
  CanvasRenderingContext2D,
  getContextById,
} from "../node_modules/as2d/assembly/index";

let ctx: CanvasRenderingContext2D;
let x: f64 = 0;
let y: f64 = 0;
let stars: Float64Array = new Float64Array(2000);

export function init(): void {
  ctx = getContextById("main");
  let index: i32;
  for (let i = 0; i < 1000; i++) {
    index = i << 1;
    stars[index] = Math.random() * 800;
    stars[index + 1] = Math.random() * 600;
  }
}

export function mouseMove(mouseX: f64, mouseY: f64): void {
  x = mouseX;
  y = mouseY;
}

export function update(): void {
  assert(ctx);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 600);
  let sx: f64;
  let sy: f64;
  let index: i32;
  ctx.fillStyle = "white";
  for (let i = 0; i < 1000; i++) {
    index = i << 1;
    sx = unchecked(stars[index]);
    sy = unchecked(stars[index + 1]) + 1.0;
    if (sy > 600.0) sy -= 600.0;
    ctx.fillRect(sx, sy, 2, 2);
    unchecked(stars[index + 1] = sy);
  }

  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.commit();
}
