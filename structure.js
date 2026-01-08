let canva = document.querySelector("canvas");
let context = canva.getContext("2d");

canva.width = window.innerWidth - 50;
canva.height = window.innerHeight - 20;

var gravity = 1;
var friction = 0.9;


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
    const endX = this.length;
    const baseH = this.eyeWidth * 0.5;
    const steps = 25; // plus = plus lisse

    // Ellipse (base)
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

    /// ---- CORPO AGO: rettangolo + punta ----
const bodyLength = this.length * 0.75;
const tipLength = this.length * 0.15;
const halfWidth = this.eyeWidth * 0.10;

context.beginPath();
context.fillStyle = this.color;

// angolo in alto a sinistra
context.moveTo(startX, -halfWidth);

// lato superiore rettangolo
context.lineTo(startX + bodyLength, -halfWidth);

// lato superiore punta
context.lineTo(startX + bodyLength + tipLength, 0);

// lato inferiore punta
context.lineTo(startX + bodyLength, halfWidth);

// lato inferiore rettangolo
context.lineTo(startX, halfWidth);

// chiusura
context.closePath();
context.fill();

    context.restore();
  }

  drawThread() {
    if (this.thread.length < 2) return;

    context.beginPath();
    context.strokeStyle = "red";
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
  }
}

const ago = new Ago(-100, canva.height / 2, 200, 20, 30, 2);

function animateAgo() {
  requestAnimationFrame(animateAgo);
  context.clearRect(0, 0, canva.width, canva.height);
  ago.update();
}

const div = document.getElementById("test");

div.addEventListener("click", () => {
  canva.style.zIndex = "10";
  animateAgo();
});
