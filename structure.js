let canva = document.querySelector("canvas");
let context = canva.getContext("2d");
let image = document.querySelector("img");

canva.width = window.innerWidth -20;
canva.height = window.innerHeight;

var gravity = 1;
var friction = 0.9;
let splitTriggered = false;

class Ago {
  constructor(x, y, length, eyeWidth, eyeHeight, dx, color = "#A8A9AD") {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.length = length;
    this.dx = dx;
    this.eyeWidth = eyeWidth;
    this.eyeHeight = eyeHeight;
    this.color = color;
    this.t = 0;
    this.thread = [];
    this.maxThreadLength = 100;
  }
  draw() {
    context.save();
    context.translate(this.x, this.y);
    const angle = Math.cos(this.t) * 0.5 + Math.cos(this.t * 3) * 0.15;
    context.rotate(angle);
    const startX = this.eyeHeight / 2;
    const tipX = this.x + Math.cos(angle) * (this.length * 0.9);
    const tipY = this.y + Math.sin(angle) * (this.length * 0.9);

    // Ellipse
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 4;
    context.ellipse(
      0,
      0,
      this.eyeHeight / 1.8,
      this.eyeWidth / 3.5,
      0,
      0,
      Math.PI * 2
    );
    context.stroke();

    /// Rettangolo + punta
    const bodyLength = this.length * 0.75;
    const tipLength = this.length * 0.15;
    const halfWidth = this.eyeWidth * 0.1;

    context.beginPath();
    context.fillStyle = this.color;
    context.moveTo(startX, -halfWidth);
    context.lineTo(startX + bodyLength, -halfWidth);
    context.lineTo(startX + bodyLength + tipLength, 0);
    context.lineTo(startX + bodyLength, halfWidth);
    context.lineTo(startX, halfWidth);
    context.closePath();
    context.fill();

    context.restore();
  }

  drawThread() {
    if (this.thread.length < 2) return;

    context.beginPath();
    context.strokeStyle = "#e79ebd";
    context.lineWidth = 2;
    context.lineCap = "round";

    context.moveTo(this.thread[0].x, this.thread[0].y);

    for (let i = 0; i < this.thread.length - 1; i++) {
      const midX = (this.thread[i].x + this.thread[i + 1].x) / 2;
      const midY = (this.thread[i].y + this.thread[i + 1].y) / 2;
      context.quadraticCurveTo(this.thread[i].x, this.thread[i].y, midX, midY);
    }
    context.stroke();
  }
  update() {
    this.thread.unshift({
      x: this.x,
      y: this.y,
    });

    if (this.thread.length > this.maxThreadLength) {
      this.thread.pop();
    }
    this.dx += 0.02;
    this.x += this.dx;
    this.t += 0.02;

    const large = Math.sin(this.t) * (canva.height / 4);
    const micro = Math.sin(this.t * 3) * 20;

    this.y = this.baseY + large + micro;

    this.drawThread();
    this.draw();

    const angle = Math.cos(this.t) * 0.5 + Math.cos(this.t * 3) * 0.15;
    const tipX = this.x + Math.cos(angle) * (this.length * 0.9);
    const tipY = this.x + Math.sin(angle) * (this.length * 0.9);

    const leftEdgeX = rett.cx - rett.width / 2;
    const topY = rett.cy - rett.height / 2;
    const bottomY = rett2.cy + rett2.height / 2;

    if (!splitTriggered && tipX >= leftEdgeX) {
      splitTriggered = true;
      rett.active = true;
      rett2.active = true;

      rett.dy = -3;
      rett2.dy = 3;
      
      image.style.zIndex = "2";
      image.style.transform = "translate(-50%,-50%)scale(2)";
    }
  }
}

class Rettangolo {
  constructor(cx, cy, dx, dy, width, height) {
    this.cx = cx;
    this.cy = cy;
    this.dx = dx;
    this.dy = dy;
    this.width = width;
    this.height = height;
    this.active = false;
  }

  update() {
    if (this.active) {
      this.cy += this.dy;
    }
    this.draw();
  }

  draw() {
    context.beginPath();
    context.fillStyle = "#e79ebd";

    context.fillRect(
      this.cx - this.width / 2,
      this.cy - this.height / 2,
      this.width,
      this.height
    );
  }
}

const ago = new Ago(-100, canva.height - 250, 150, 20, 30, 2);

function animateAgo() {
  requestAnimationFrame(animateAgo);
  context.clearRect(0, 0, canva.width, canva.height);
  ago.update();
  rett.update();
  rett2.update();


}

const div = document.getElementById("test");

div.addEventListener("click", () => {
  canva.style.zIndex = "10";

  animateAgo();
});

let rett = new Rettangolo(
  canva.width / 2,
  canva.height / 2 - 50,
  1,
  1,
  500,
  100
);
let rett2 = new Rettangolo(
  canva.width / 2,
  canva.height / 2 + 50,
  1,
  1,
  500,
  100
);

rett.draw();
rett2.draw();
