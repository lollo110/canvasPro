let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
let wind = 0;
let lightningAlpha = 0;
let nextLighting = 0;

canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 10;

let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

let colors = ["#e74c3c", "#ecf0f1", "#3498d8", "#2980b9"];

window.addEventListener("mousemove", function (e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

class Splash {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = randomInt(1, 3);
    this.dx = randomInt(-2, 2);
    this.dy = randomInt(-3, -1);
    this.life = 20;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(0,0,255,0.6)";
    context.fill();
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.dy += 0.2;
    this.life--;
    this.draw();
  }
}

class Gocce {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = randomInt(20, canvas.width - 20);
    this.y = randomInt(-50, -20);
    this.radius = randomInt(1, 3);
    this.dy = randomInt(2, 5);
    this.color = "blue";
    this.velocity = 0.06;
  }

  update() {
    this.dy += this.velocity;
    this.y += this.dy;
    this.x += wind;

    if (this.y + this.radius >= canvas.height - 50) {
      splash.push(new Splash(this.x, canvas.height - 100));
      pozzanghere.forEach((p) => {
        if (Math.abs(p.x - this.x) < p.radius) {
          p.radius = Math.min(p.radius + 0.5, p.maxRadius);
        }
      });
      this.reset();
    }
    this.draw();
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }
}

class Pozzanghera {
  constructor(x) {
    this.x = x;
    this.y = canvas.height - 50;
    this.radius = randomInt(40, 60);
    this.maxRadius = randomInt(80, 140);
  }
  update() {
    if (this.radius < this.maxRadius) {
      this.radius += 0.02;
    }
    this.draw();
  }
  draw() {
    context.beginPath();
    context.ellipse(
      this.x,
      this.y,
      this.radius,
      this.radius / 3,
      0,
      0,
      Math.PI * 2
    );
    context.fillStyle = "rgba(0,0,255,0.25)";
    context.fill();
  }
}

class LightningBolt {
  constructor(x,y,angle = 0,depth = 0) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.depth = depth;
    this.segments = [];
    this.currentSegment = 0;
    this.life = 10;

    this.generate();
  }

  generate(){
    let x = this.x;
    let y = this.y;
    let angle = this.angle;

    while ( y < canvas.height - 50) {
        angle += randomFloat(-0.3, 0.3);

        const stepX = Math.sin(angle) * randomFloat(8,16);
        const stepY = Math.cos(angle) * randomFloat(18,30);

        x += stepX;
        y += Math.abs(stepY);

        this.segments.push({x,y});

        if(Math.random() < 0.25 && this.depth < 2 && fulmini.length < 50) {
            fulmini.push(new LightningBolt(x,y,angle + randomFloat(-0.8, 0.8), this.depth + 1));
        }
    }
  }

  update() {
    this.drawProgressive();
    this.life--;

    const lastSegment = this.segments[this.segments.length - 1];
    if(this.segments.length > 0 && lastSegment.y >= canvas.height - 50 && this.depth === 0) {
        pozzanghere.forEach(p => {
            p.radius = Math.min(p.radius + 10, p.maxRadius);

        })
    }
  }

  drawProgressive() {
    context.beginPath();
    context.moveTo(this.x, this.y);
    
    for(let i = 0; i < Math.floor(this.currentSegment); i++){
        const p = this.segments[i];
        context.lineTo(p.x, p.y);
    }
    context.strokeStyle='rgba(255,255,200,0.9)';
    context.lineWidth= 10;
    context.shadowColor='rgba(255,255,200,0.8)';
    context.shadowBlur=15;
    context.stroke();
    
    if (this.currentSegment < this.segments.length) {
        this.currentSegment += 0.5;
    }
    
    
    
  }
}

let fulmini = [];
let gocce = [];
let splash = [];
let pozzanghere = [];
function init() {
  gocce = [];
  splash = [];
  pozzanghere = [];
  for (let i = 0; i < 20; i++) {
    pozzanghere.push(new Pozzanghera(randomInt(100, canvas.width - 100)));
  }
  for (let i = 0; i < 100; i++) {
    gocce.push(new Gocce());
  }
}

function lightning() {
  if (Date.now() > nextLighting) {
    lightningAlpha = Math.random() * 0.6 + 0.3;
    nextLighting = Date.now() + randomInt(3000, 7000);

    fulmini.push(new LightningBolt(randomInt(100, canvas.width - 100), 0));
    // playThunder();
  }
  if (lightningAlpha > 0) {
    context.fillStyle = `rgba(252,238,53,${lightningAlpha})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    lightningAlpha -= 0.02;
  }

  fulmini.forEach((f) => f.update());
  fulmini = fulmini.filter((f) => f.life > 0);
}

function animate() {
  requestAnimationFrame(animate);
  context.fillStyle = "rgba(255,255,255,0.3)";

  context.fillRect(0, 0, canvas.width, canvas.height);
  wind = Math.sin(Date.now() * 0.001) * 2;

  pozzanghere.forEach((p) => p.update());
  gocce.forEach((goccia) => goccia.update());
  splash.forEach((s) => s.update());

  splash = splash.filter((s) => s.life > 0);
  lightning();
}

init();
animate();
