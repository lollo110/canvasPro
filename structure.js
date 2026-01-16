let canva = document.querySelector("canvas");
let context = canva.getContext("2d");
let image = document.querySelector("img");

canva.width = window.innerWidth - 20;
canva.height = window.innerHeight;

const path = {
  p0: { x: -100, y: 150 },
  p1: { x: canva.width / 2 - 100, y: canva.height - 240 },
  p2: { x: canva.width + 100, y: 180 },
};

var gravity = 1;
var friction = 0.9;
let splitTriggered = false;

const rectImages = [new Image(), new Image(), new Image(), new Image()];

rectImages[0].src = "pend1.png";
rectImages[1].src = "pend2.png";
rectImages[2].src = "pend3.png";
rectImages[3].src = "pend4.png";

// --------------- AGO --------------------

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
    this.tPath = 0;
    this.speed = 0.01; // aumenta se vuoi più veloce
    this.angle = 0;
    this.angleSmooth = 0;
  }
  draw() {
    context.save();
    context.translate(this.x, this.y);

    context.rotate(this.angle);
    const startX = this.eyeHeight / 2;

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
    this.tPath += this.speed;
    if (this.tPath > 1) this.tPath = 1;

    const pos = quadraticBezier(path.p0, path.p1, path.p2, this.tPath);

    // posizione
    this.x = pos.x;
    this.y = pos.y;

    // 🔁 rotazione naturale (tangente)
    const next = quadraticBezier(
      path.p0,
      path.p1,
      path.p2,
      Math.min(this.tPath + 0.01, 1)
    );

    const targetAngle = Math.atan2(next.y - this.y, next.x - this.x);

    this.angleSmooth += (targetAngle - this.angleSmooth) * 0.15;
    this.angle = this.angleSmooth;

    // filo
    this.thread.unshift({ x: this.x, y: this.y });
    if (this.thread.length > this.maxThreadLength) {
      this.thread.pop();
    }

    this.drawThread();
    this.draw();

    const eyeX = this.x;
    const lastR = retts[3];
    const right = lastR.cx + lastR.width / 2;

    if (!splitTriggered && eyeX > right) {
      splitTriggered = true;
      retts.forEach((r) => (r.following = true));

      image.style.opacity = "1";
      image.style.transform = "translate(-50%,-50%)scale(2)";
    }
  }
}

// --------------------- Rettangolo --------------------

class Rettangolo {
  constructor(cx, cy, width, height, followIndex, img) {
    this.cx = cx;
    this.cy = cy;
    this.width = width;
    this.height = height;
    this.followIndex = followIndex;
    this.following = false;
    this.angle = 0;
    this.img = img;
  }

  follow(thread) {
    if (thread[this.followIndex]) {
      const targetX = thread[this.followIndex].x + 100;
      const targetY = thread[this.followIndex].y + 50;
      this.cx += (targetX - this.cx) * 0.1;
      this.cy += (targetY - this.cy) * 0.1;
      this.angle = Math.sin(Date.now() * 0.002 + this.followIndex) * 0.3;
    }
  }

  update(thread) {
    if (this.following) {
      this.follow(thread);
    }
    this.draw();
  }

  draw() {
    context.beginPath();

    context.shadowColor = "rgba(0, 0, 0, 0.25)";
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 10;

    if (this.img && this.img.complete) {
      context.drawImage(
        this.img,
        this.cx - this.width / 2,
        this.cy - this.height / 2,
        this.width,
        this.height
      );
    }
  }
}

// --------------------- Fili -------------------------

class Filo {
  constructor() {
    this.reset();
    this.phase = Math.random() * Math.PI * 2;
  }

  reset() {
    this.x = Math.random() * canva.width;
    this.y = -50;
    this.length = 60 + Math.random() * 80;
    this.speed = 0.3 + Math.random() * 0.6;
    this.amplitude = 6 + Math.random() * 8;
    this.color = ["#f1b7cf", "#e79ebd", "#d6c1e0", "#e8dcc6"][
      Math.floor(Math.random() * 4)
    ];
  }

  update() {
    this.phase += 0.02;
    this.y += this.speed;
    if (this.y - this.length > canva.height + 100) {
      this.reset();
    }
    this.draw();
  }

  draw() {
    const grad = context.createLinearGradient(
      this.x,
      this.y,
      this.x,
      this.y + this.length
    );

    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.3, this.color);
    grad.addColorStop(0.5, "rgba(255,255,255,0.6)");
    grad.addColorStop(0.7, this.color);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    context.strokeStyle = grad;
    context.lineWidth = 3;
    context.lineCap = "round";

    context.beginPath();

    for (let i = 0; i <= this.length; i += 10) {
      const offsetX = Math.sin(this.phase + i * 0.05) * this.amplitude;
      const px = this.x + offsetX;
      const py = this.y + i;

      if (i === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.stroke();
  }
}

// ---------------- MicroX --------------------

class MicroX {
  constructor() {
    this.x = Math.random() * canva.width;
    this.y = Math.random() * canva.height;
    this.size = 3 + Math.random() * 3;
    this.speed = 0.3 + Math.random() * 0.5;
    this.rotation = Math.random() * Math.PI;
    this.opacity = 0.7 + Math.random() * 0.3;
  }

  update() {
    this.y += this.speed;
    this.rotation += 0.01;

    if (this.y > canva.height) {
      this.y = -10;
      this.x = Math.random() * canva.width;
    }
    this.draw();
  }

  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.strokeStyle = `rgba(231,158,189,${this.opacity})`;
    context.lineWidth = 0.8;

    context.beginPath();
    context.moveTo(-this.size, -this.size);
    context.lineTo(this.size, this.size);
    context.moveTo(this.size, -this.size);
    context.lineTo(-this.size, this.size);
    context.stroke();
    context.restore();
  }
}

const ago = new Ago(-100, 200, 150, 20, 30, 2);
const size = 200;
const centerX = canva.width / 2;
const centerY = canva.height / 2;

let fili = [];
let microXs = [];

let retts = [
  new Rettangolo(centerX - 1.5 * size, centerY, size, size, 40, rectImages[0]),
  new Rettangolo(centerX - 0.5 * size, centerY, size, size, 30, rectImages[1]),
  new Rettangolo(centerX + 0.5 * size, centerY, size, size, 20, rectImages[2]),
  new Rettangolo(centerX + 1.5 * size, centerY, size, size, 10, rectImages[3]),
];

function quadraticBezier(p0, p1, p2, t) {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}
let agoAttivo = false;

for (let i = 0; i < 50; i++) {
  const f = new Filo();
  f.y = Math.random() * canva.height; // distribuiti verticalmente
  fili.push(f);
}
for (let i = 0; i < 100; i++) {
  microXs.push(new MicroX());
}

function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canva.width, canva.height);

  microXs.forEach((x) => x.update());
  fili.forEach((f) => f.update());
  retts.forEach((r) => r.update(ago.thread));
  if (agoAttivo) {
    ago.update();
  }
}
const div = document.getElementById("test");

div.addEventListener("click", () => {
  canva.style.zIndex = "10";

  agoAttivo = true;
});

animate();
