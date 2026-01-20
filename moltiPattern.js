const canva = document.querySelector("canvas");
const context = canva.getContext("2d");

canva.width = innerWidth;
canva.height = innerHeight;

function resizeCanvas() {
  canva.width = window.innerWidth;
  canva.height = window.innerHeight;
}

const SIZE = 6; // più grande per pattern visibili
const SPEED = 0.8;

// Palette generiche
const palettes = [
  { 1: "#27397A", 2: "#4D72B3", 3: "#F2D24F", 4: "#936B30" },
  { 1: "#FFD700", 2: "#FFA500", 3: "#FFF", 4: "#000" },
  { 1: "#32CD32", 2: "#228B22", 3: "#000", 4: "#FFF" },
];

// --- CLASSI ---
class Cucito {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.state = 0;
    this.progress = 0;
  }

  drawSegment(x1, y1, x2, y2, p) {
    const midX = x1 + (x2 - x1) * p + Math.sin(p * Math.PI) * 1.2;
    const midY = y1 + (y2 - y1) * p + Math.cos(p * Math.PI) * 1.2;
    const width = 2.5 + Math.sin(p * Math.PI) * 1.2;

    // filo ombra
    context.strokeStyle = "rgba(0,0,0,0.25)";
    context.lineWidth = width + 2;
    context.beginPath();
    context.moveTo(x1 + 1.5, y1 + 1.5);
    context.lineTo(midX + 1.5, midY + 1.5);
    context.stroke();

    // filo principale
    context.strokeStyle = this.color;
    context.lineCap = "round";
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(midX, midY);
    context.stroke();

    return { x: midX, y: midY };
  }

  draw(offsetX = 0, offsetY = 0) {
  let needlePos = null;

  const x = this.x + offsetX;
  const y = this.y + offsetY;

  if (this.state === 1)
    needlePos = this.drawSegment(
      x, y,
      x + this.size, y + this.size,
      this.progress
    );

  if (this.state >= 2)
    this.drawSegment(
      x, y,
      x + this.size, y + this.size,
      1
    );

  if (this.state === 3)
    needlePos = this.drawSegment(
      x + this.size, y,
      x, y + this.size,
      this.progress
    );

  if (this.state >= 4)
    this.drawSegment(
      x + this.size, y,
      x, y + this.size,
      1
    );

  return needlePos;
}

  update() {
    if (this.state === 1 || this.state === 3) {
      this.progress += SPEED;
      if (this.progress >= 1) {
        this.progress = 0;
        this.state++;
      }
    }
  }
}

// Classe per pattern generici
class PatternStitches {
  constructor(pattern, palette, offsetX, offsetY) {
    this.stitches = [];
    this.baseX = offsetX;
    this.baseY = offsetY;

    this.time = Math.random() * 1000;

    pattern.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          this.stitches.push(
            new Cucito(
              offsetX + x * SIZE,
              offsetY + y * SIZE,
              SIZE,
              palette[cell] || "#000",
            ),
          );
        }
      });
    });

    // centro verticale (corpo)
    const ys = this.stitches.map(s => s.y);
    this.centerY = (Math.min(...ys) + Math.max(...ys)) / 2;

    this.colorGroups = {};
    this.stitches.forEach((s) => {
      if (!this.colorGroups[s.color]) this.colorGroups[s.color] = [];
      this.colorGroups[s.color].push(s);
    });

    this.colors = Object.keys(this.colorGroups);
    this.colorIndex = 0;
    this.stitchIndex = 0;
  }

  draw() {
    const flap = Math.sin(this.time) * 10;

    this.stitches.forEach((s) => {
      const dist = s.y - this.centerY;

      // ali sopra e sotto
      const wingFactor = Math.abs(dist) / 40;
      const deformY = flap * wingFactor * Math.sign(dist);

      s.draw(0, deformY);
    });
  }

  update() {
    this.time += 0.08;

    const currentColor = this.colors[this.colorIndex];
    const group = this.colorGroups[currentColor];
    const stitch = group?.[this.stitchIndex];
    if (!stitch) return;

    if (stitch.state === 0) stitch.state = 1;
    stitch.update();
    if (stitch.state === 2) stitch.state = 3;
    if (stitch.state === 4) this.stitchIndex++;

    if (this.stitchIndex >= group.length) {
      this.stitchIndex = 0;
      this.colorIndex++;
      if (this.colorIndex >= this.colors.length) this.colorIndex = 0;
    }
  }
}

// --- PATTERN PIXEL ART ---


const butterflyPattern = [
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 2, 2, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 3, 1, 2, 1, 0, 4],
  [1, 2, 2, 3, 3, 3, 2, 2, 2, 1, 2, 2, 3, 1, 4, 4, 0],
  [1, 2, 2, 2, 3, 2, 2, 2, 1, 2, 2, 2, 2, 4, 4, 4, 0],
  [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 4, 4, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 0, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 4, 4, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
];


const butterflyPattern2 = [
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 2, 2, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 3, 1, 2, 1, 0, 4],
  [1, 2, 2, 3, 3, 3, 2, 2, 2, 1, 2, 2, 3, 1, 4, 4, 0],
  [1, 2, 2, 2, 3, 2, 2, 2, 1, 2, 2, 2, 2, 4, 4, 4, 0],
  [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 4, 4, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 0, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 4, 4, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
];


const butterflyPattern3 = [
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 2, 2, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 3, 1, 2, 1, 0, 4],
  [1, 2, 2, 3, 3, 3, 2, 2, 2, 1, 2, 2, 3, 1, 4, 4, 0],
  [1, 2, 2, 2, 3, 2, 2, 2, 1, 2, 2, 2, 2, 4, 4, 4, 0],
  [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 4, 4, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 0, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 4, 4, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
];

// --- CREAZIONE ISTANZE ---
const patterns = [
  new PatternStitches(butterflyPattern, palettes[0], 150, 100),
  new PatternStitches(butterflyPattern2, palettes[1], 150, canva.height / 2),
  new PatternStitches(butterflyPattern3, palettes[2], 550, 100),
];

// --- ANIMAZIONE ---
function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canva.width, canva.height);
  patterns.forEach((p) => {
    p.draw();
    p.update();
  });
}

animate();

window.addEventListener('resize', function(){
    resizeCanvas();
    animate();
})
