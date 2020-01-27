import {
  CanvasRenderingContext2D,
  getContextById,
} from "../node_modules/as2d/assembly/index";

let ctx: CanvasRenderingContext2D;
let x: f64 = 0;
let y: f64 = 0;
const starCount: i32 = 5000;
let stars: Float64Array = new Float64Array(starCount * 2);
export function init(): void {
  // let seed1 = <i32>(JSMath.random() * <f64>i32.MAX_VALUE);
  // let seed2 = <i32>(JSMath.random() * <f64>i32.MAX_VALUE);
  // NativeMath.seedRandom((<i64>seed1 << 32) | <i64>seed2);
  NativeMath.seedRandom(reinterpret<i64>(JSMath.random()));
  ctx = getContextById("main");
  for (let i = 0; i < starCount; i += 2) {
    stars[i] = Math.random() * 800;
    stars[i + 1] = Math.random() * 600;
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

  for (let i = 0; i < starCount; i++) {
    index = i << 1;
    sx = unchecked(stars[index]);
    sy = unchecked(stars[index + 1]) + 1.0;
    if (sy > 600.0) sy -= 600.0;
    ctx.fillRect(sx, sy, 2, 2);
    unchecked(stars[index + 1] = sy);
    if (i % 1000 === 999) ctx.commit();
  }

  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.commit();
}
