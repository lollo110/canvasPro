const canva = document.querySelector("canvas");
const context = canva.getContext("2d");

canva.width = window.innerWidth - 30;
canva.height = window.innerHeight - 20;

class Flash {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.alpha = 1;
    }

    update() {
        this.radius += 6;
        this.alpha -= 0.05;

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255,255,255,${this.alpha})`;
        context.fill();
    }

    isDone() {
        return this.alpha <= 0;
    }
}

class Stella {
    constructor(cx, cy, outRadius, innerRadius, points, rotation, color, dx, dy, level) {
        this.cx = cx;
        this.cy = cy;
        this.outRadius = outRadius;
        this.innerRadius = innerRadius;
        this.points = points;
        this.rotation = rotation;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
        this.level = level;      // 0=grande, 1=piccola, 2=finale
        this.startX = cx;
        this.startY = cy;
        this.hasExploded = false;
    }

    draw() {
        context.beginPath();
        context.fillStyle = this.color;

        const step = Math.PI / this.points;
        for (let i = 0; i < this.points * 2; i++) {
            const radius = i % 2 === 0 ? this.outRadius : this.innerRadius;
            const angle = i * step + this.rotation;
            const x = this.cx + radius * Math.cos(angle);
            const y = this.cy + radius * Math.sin(angle);

            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
        }

        context.closePath();
        context.fill();
        context.stroke();
    }

    update() {
        this.rotation += 0.1;
        this.cx += this.dx;
        this.cy += this.dy;
        this.draw();
    }

    isAtCenter() {
        const dx = this.cx - canva.width / 2;
        const dy = this.cy - canva.height / 2;
        return Math.hypot(dx, dy) < 5;
    }

    distanceFromStart() {
        return Math.hypot(this.cx - this.startX, this.cy - this.startY);
    }

    explode() {
        const children = [];
        const count = 6;
        const speed = 3;
        const scale = 0.45;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
            children.push(new Stella(
                this.cx,
                this.cy,
                this.outRadius * scale,
                this.innerRadius * scale,
                this.points,
                this.rotation,
                color,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                this.level + 1
            ));
        }
        return children;
    }
}

let stars = [];
let flashes = [];

// crea stelle grandi dall’alto a destra
function spawnBigStar() {
    const bigCount = stars.filter(s => s.level === 0).length;
    if (bigCount >= 2) return;

    const startX = canva.width + 50;
    const startY = -50;
    const targetX = canva.width / 2;
    const targetY = canva.height / 2;
    const angle = Math.atan2(targetY - startY, targetX - startX);
    const speed = 2;

    stars.push(new Stella(
        startX,
        startY,
        80,
        40,
        5,
        -Math.PI / 2,
        "gold",
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        0
    ));
}

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canva.width, canva.height);

    // Aggiorna le stelle
    for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        star.update();

        // Esplosione al centro per stelle grandi
        if (star.level === 0 && star.isAtCenter() && !star.hasExploded) {
            flashes.push(new Flash(star.cx, star.cy));
            stars.push(...star.explode());
            star.hasExploded = true;
            stars.splice(i, 1);
            continue;
        }

        // Esplosione a metà percorso per stelle piccole
        if (star.level === 1 && !star.hasExploded && star.distanceFromStart() > Math.min(canva.width, canva.height) / 4) {
            flashes.push(new Flash(star.cx, star.cy));
            stars.push(...star.explode());
            star.hasExploded = true; // evita che esplodano di nuovo
        }

        // Rimozione stelle fuori dallo schermo
        if (star.cx < -100 || star.cx > canva.width + 100 ||
            star.cy < -100 || star.cy > canva.height + 100) {
            stars.splice(i, 1);
        }
    }

    // Aggiorna flash
    for (let i = flashes.length - 1; i >= 0; i--) {
        flashes[i].update();
        if (flashes[i].isDone()) flashes.splice(i, 1);
    }

    // Spawn nuovo ciclo se non ci sono stelle in scena
    if (stars.length === 0) {
        spawnBigStar();
    }
}

// inizializza
function init() {
    spawnBigStar();
    spawnBigStar(); // due stelle iniziali
    animate();
}

init();
