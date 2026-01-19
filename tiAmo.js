const canva = document.querySelector("canvas");
const context = canva.getContext("2d");

canva.width = innerWidth;
canva.height = innerHeight;

const SIZE = 10;
const SPEED = 2;

// PALETTE
const palette = {
    1: "#000",
    2: "#B03B34",
    3: "#F4C945",
    4: "white"
};

// PATTERN
const pattern = [
  [0,2,2,0,2,2,0,0,0,2,2,0,2,2,0,0,0,2,2,0,2,2,0,0,0,2,2,0,2,2,0,0,0,2,2,0,2,2,0,0,0,2,2,0,2,2,0,0,0,2,2,0,2,2,0,0,0,2,2,0,2,2,0,0,0,0,0,0],  
  [2,0,0,2,0,0,2,0,2,0,0,2,0,0,2,0,2,0,0,2,0,0,2,0,2,0,0,2,0,0,2,0,2,0,0,2,0,0,2,0,2,0,0,2,0,0,2,0,2,0,0,2,0,0,2,0,2,0,0,2,0,0,2,0,0,0,0,0],  
  [2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,0,0,0,0],  
  [0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0],  
  [0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,0,0],  
  [0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],  
  [1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,0,1,0,1,0,1,0,0,1,1,0,0,0,1,1,1,0,0,1,1,1,0,1,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,1,0],
  [0,1,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,1,1,1,1,1,0,0,1,1,0,1,1,0,1,0,1,0,0,1],
  [0,1,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,1,1,1,0,0,0,0,0,0,0,1,0,0,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0,0,1],
  [0,1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0,0,1],
  [1,1,1,0,0,0,1,1,1,0,1,1,0,1,0,1,1,1,0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1,1,1,0,0,1,1,1,0,1,0,0,1,0,0,1,0,0,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,3,3,0,3,3,0,0,0,3,3,0,3,3,0,0,0,3,3,0,3,3,0,0,0,3,3,0,3,3,0,0,0,3,3,0,3,3,0,0,0,3,3,0,3,3,0,0,0,3,3,0,3,3,0,0,0,3,3,0,3,3,0,0,0,0,0,0],  
  [3,0,0,3,0,0,3,0,3,0,0,3,0,0,3,0,3,0,0,3,0,0,3,0,3,0,0,3,0,0,3,0,3,0,0,3,0,0,3,0,3,0,0,3,0,0,3,0,3,0,0,3,0,0,3,0,3,0,0,3,0,0,3,0,0,0,0,0],  
  [3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,0,0,0,0],  
  [0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,0,0,0,0,0],  
  [0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,3,0,3,0,0,0,0,0,0,0],  
  [0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],
];




// CLASSE CUCITO
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
        // Micro-curvatura: sposta leggermente il punto centrale
        const midX = x1 + (x2 - x1) * p + Math.sin(p * Math.PI) * 1.2;
        const midY = y1 + (y2 - y1) * p + Math.cos(p * Math.PI) * 1.2;

        // spessore variabile
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
        context.lineCap='round';
        
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(midX, midY);
        context.stroke();

        return { x: midX, y: midY };
    }

    draw() {
        let needlePos = null;

        if (this.state === 1) {
            needlePos = this.drawSegment(
                this.x, this.y,
                this.x + this.size, this.y + this.size,
                this.progress
            );
        }

        if (this.state >= 2) {
            this.drawSegment(
                this.x, this.y,
                this.x + this.size, this.y + this.size,
                1
            );
        }

        if (this.state === 3) {
            needlePos = this.drawSegment(
                this.x + this.size, this.y,
                this.x, this.y + this.size,
                this.progress
            );
        }

        if (this.state >= 4) {
            this.drawSegment(
                this.x + this.size, this.y,
                this.x, this.y + this.size,
                1
            );
        }

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

// COSTRUZIONE PUNTI
let stitches = [];
const offsetX = canva.width / 2 - (pattern[0].length * SIZE) / 2;
const offsetY = canva.height / 2 - (pattern.length * SIZE) / 2;

pattern.forEach((row, y) => {
    row.forEach((cell, x) => {
        if (cell !== 0) {
            stitches.push(
                new Cucito(
                    offsetX + x * SIZE,
                    offsetY + y * SIZE,
                    SIZE,
                    palette[cell]
                )
            );
        }
    });
});

// RAGGRUPPA PER COLORE
const colorGroups = {};
stitches.forEach(s => {
    if (!colorGroups[s.color]) colorGroups[s.color] = [];
    colorGroups[s.color].push(s);
});
const colors = Object.keys(colorGroups);

// CONTROLLER
let colorIndex = 0;
let stitchIndex = 0;
let pauseCounter = 0;

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canva.width, canva.height);

    let needlePos = null;

    // disegna tutti i punti
    stitches.forEach(s => {
        const p = s.draw();
        if (p) needlePos = p;
    });

    // aggiorna punto attivo
    const currentColor = colors[colorIndex];
    const group = colorGroups[currentColor];
    const stitch = group?.[stitchIndex];

    if (!stitch) return;

    if (stitch.state === 0) stitch.state = 1;
    stitch.update();

    if (stitch.state === 2) stitch.state = 3;
    if (stitch.state === 4) stitchIndex++;

    if (stitchIndex >= group.length) {
        stitchIndex = 0;
        colorIndex++;
    }
}

animate();