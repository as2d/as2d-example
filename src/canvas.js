let ctx = document.querySelector("canvas").getContext("2d");
let index;
const starCount = 3000;
let stars = new Float64Array(starCount * 2);
for (let i = 0; i < starCount; i++) {
  index = i << 1;
  stars[index] = Math.random() * 800;
  stars[index + 1] = Math.random() * 600;
}

let x = 0, y = 0;
function update() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 800, 600);
  let sx;
  let sy;
  let index;
  ctx.fillStyle = "white";

  for (let i = 0; i < starCount; i++) {
    index = i << 1;
    sx = stars[index];
    sy = stars[index + 1] + 1.0;
    if (sy > 600.0) sy -= 600.0;
    ctx.fillRect(sx, sy, 2, 2);
    stars[index + 1] = sy;
  }

  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();
}

requestAnimationFrame(function frame() {
  requestAnimationFrame(frame);
  update();
});

ctx.canvas.addEventListener("mousemove", function (evt) {
  x = evt.clientX;
  y = evt.clientY;
});