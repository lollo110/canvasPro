const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("upload");

canvas.width = innerWidth;
canvas.height = innerHeight;

// =====================
// PARAMETRI
// =====================
const STITCH_SIZE = 10;
const MAX_COLORS = 6;
const PATTERN_W = 30;
const PATTERN_H = 30;
const DRAW_SPEED = 5;

// =====================
// STATO
// =====================
let pattern = [];
let palette = {};
let stitches = [];
let colorGroups = {};
let colors = [];
let colorIndex = 0;
let stitchIndex = 0;

// =====================
// UPLOAD IMMAGINE
// =====================
input.addEventListener("change", e => {
    const img = new Image();
    img.onload = () => createPatternFromImage(img);
    img.src = URL.createObjectURL(e.target.files[0]);
});

// =====================
// IMMAGINE → PATTERN
// =====================
function createPatternFromImage(img) {
    const temp = document.createElement("canvas");
    const tctx = temp.getContext("2d");

    temp.width = PATTERN_W;
    temp.height = PATTERN_H;

    tctx.drawImage(img, 0, 0, PATTERN_W, PATTERN_H);
    const data = tctx.getImageData(0, 0, PATTERN_W, PATTERN_H).data;

    pattern = [];
    let colorList = [];

    for (let y = 0; y < PATTERN_H; y++) {
        let row = [];
        for (let x = 0; x < PATTERN_W; x++) {
            const i = (y * PATTERN_W + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a < 60) {
                row.push(0);
                continue;
            }

            const index = nearestColor([r, g, b], colorList);
            row.push(index + 1);
        }
        pattern.push(row);
    }

    palette = {};
    colorList.forEach((c, i) => {
        palette[i + 1] = `rgb(${c[0]},${c[1]},${c[2]})`;
    });

    buildStitches();
}

// =====================
// RIDUZIONE COLORI
// =====================
function nearestColor(color, palette) {
    if (palette.length === 0) {
        palette.push(color);
        return 0;
    }

    let bestIndex = 0;
    let bestDist = Infinity;

    for (let i = 0; i < palette.length; i++) {
        const p = palette[i];
        const d =
            (p[0] - color[0]) ** 2 +
            (p[1] - color[1]) ** 2 +
            (p[2] - color[2]) ** 2;

        if (d < bestDist) {
            bestDist = d;
            bestIndex = i;
        }
    }

    // se palette non piena e colore distante → aggiungilo
    if (palette.length < MAX_COLORS && bestDist > 900) {
        palette.push(color);
        return palette.length - 1;
    }

    return bestIndex;
}

// =====================
// CLASSE PUNTO
// =====================
class Stitch {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.state = 0;
        this.progress = 0;
    }

    drawLine(x1, y1, x2, y2, p) {
        const cx = x1 + (x2 - x1) * p;
        const cy = y1 + (y2 - y1) * p;
        const w = 2.5 + Math.sin(p * Math.PI) * 1.2;

        // ombra
        ctx.strokeStyle = "rgba(0,0,0,0.25)";
        ctx.lineWidth = w + 2;
        ctx.beginPath();
        ctx.moveTo(x1 + 1.5, y1 + 1.5);
        ctx.lineTo(cx + 1.5, cy + 1.5);
        ctx.stroke();

        // filo
        ctx.strokeStyle = this.color;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        return { x: cx, y: cy };
    }

    draw() {
        if (this.state === 1)
            return this.drawLine(this.x, this.y, this.x+this.size, this.y+this.size, this.progress);
        if (this.state >= 2)
            this.drawLine(this.x, this.y, this.x+this.size, this.y+this.size, 1);
        if (this.state === 3)
            return this.drawLine(this.x+this.size, this.y, this.x, this.y+this.size, this.progress);
        if (this.state >= 4)
            this.drawLine(this.x+this.size, this.y, this.x, this.y+this.size, 1);
    }

    update() {
        if (this.state === 1 || this.state === 3) {
            this.progress += DRAW_SPEED;
            if (this.progress >= 1) {
                this.progress = 0;
                this.state++;
            }
        }
    }
}

// =====================
// COSTRUZIONE RICAMO
// =====================
function buildStitches() {
    stitches = [];
    colorGroups = {};

    const offX = canvas.width / 2 - (pattern[0].length * STITCH_SIZE) / 2;
    const offY = canvas.height / 2 - (pattern.length * STITCH_SIZE) / 2;

    pattern.forEach((row, y) => {
        row.forEach((v, x) => {
            if (v !== 0) {
                const s = new Stitch(
                    offX + x * STITCH_SIZE,
                    offY + y * STITCH_SIZE,
                    STITCH_SIZE,
                    palette[v]
                );
                stitches.push(s);
                if (!colorGroups[s.color]) colorGroups[s.color] = [];
                colorGroups[s.color].push(s);
            }
        });
    });

    colors = Object.keys(colorGroups);
    colorIndex = 0;
    stitchIndex = 0;
}

// =====================
// ANIMAZIONE
// =====================
let needle = { x: 0, y: 0, a: 1, d: 1 };

function debugDrawPattern() {
    const offX = canvas.width / 2 - (pattern[0].length * STITCH_SIZE) / 2;
    const offY = canvas.height / 2 - (pattern.length * STITCH_SIZE) / 2;

    pattern.forEach((row, y) => {
        row.forEach((v, x) => {
            if (v !== 0) {
                ctx.fillStyle = palette[v];
                ctx.fillRect(
                    offX + x * STITCH_SIZE,
                    offY + y * STITCH_SIZE,
                    STITCH_SIZE,
                    STITCH_SIZE
                );
            }
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let needlePos = null;

    stitches.forEach(s => {
        const p = s.draw();
        if (p) needlePos = p;
    });

    if (needlePos) {
        needle.x = needlePos.x;
        needle.y = needlePos.y;
        needle.a += 0.08 * needle.d;
        if (needle.a >= 1) needle.d = -1;
        if (needle.a <= 0.2) needle.d = 1;

        ctx.strokeStyle = `rgba(0,0,0,${needle.a})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(needle.x - 6, needle.y - 2);
        ctx.lineTo(needle.x + 6, needle.y + 2);
        ctx.stroke();
    }

    const group = colorGroups[colors[colorIndex]];
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

    // debugDrawPattern()
}

animate();
