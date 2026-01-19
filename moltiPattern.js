const canva = document.querySelector("canvas");
const context = canva.getContext("2d");

canva.width = innerWidth;
canva.height = innerHeight;

const SIZE = 12; // più grande per pattern visibili
const SPEED = 0.8;

// Palette generiche
const palettes = [
    {1:"#FF0000", 2:"#B03B34", 3:"#F4C945", 4:"#FFF"},
    {1:"#FFD700", 2:"#FFA500", 3:"#FFF", 4:"#000"},
    {1:"#32CD32", 2:"#228B22", 3:"#000", 4:"#FFF"}
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
        const midX = x1 + (x2-x1)*p + Math.sin(p*Math.PI)*1.2;
        const midY = y1 + (y2-y1)*p + Math.cos(p*Math.PI)*1.2;
        const width = 2.5 + Math.sin(p*Math.PI)*1.2;

        // filo ombra
        context.strokeStyle = "rgba(0,0,0,0.25)";
        context.lineWidth = width+2;
        context.beginPath();
        context.moveTo(x1+1.5, y1+1.5);
        context.lineTo(midX+1.5, midY+1.5);
        context.stroke();

        // filo principale
        context.strokeStyle = this.color;
        context.lineCap = 'round';
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(midX, midY);
        context.stroke();

        return {x:midX, y:midY};
    }

    draw() {
        let needlePos = null;
        if(this.state===1) needlePos=this.drawSegment(this.x,this.y,this.x+this.size,this.y+this.size,this.progress);
        if(this.state>=2) this.drawSegment(this.x,this.y,this.x+this.size,this.y+this.size,1);
        if(this.state===3) needlePos=this.drawSegment(this.x+this.size,this.y,this.x,this.y+this.size,this.progress);
        if(this.state>=4) this.drawSegment(this.x+this.size,this.y,this.x,this.y+this.size,1);
        return needlePos;
    }

    update() {
        if(this.state===1||this.state===3){
            this.progress+=SPEED;
            if(this.progress>=1){
                this.progress=0;
                this.state++;
            }
        }
    }
}

// Classe per pattern generici
class PatternStitches {
    constructor(pattern, palette, offsetX, offsetY) {
        this.stitches = [];
        pattern.forEach((row, y)=>{
            row.forEach((cell, x)=>{
                if(cell!==0){
                    this.stitches.push(new Cucito(
                        offsetX + x*SIZE,
                        offsetY + y*SIZE,
                        SIZE,
                        palette[cell] || "#000"
                    ));
                }
            });
        });

        this.colorGroups = {};
        this.stitches.forEach(s=>{
            if(!this.colorGroups[s.color]) this.colorGroups[s.color] = [];
            this.colorGroups[s.color].push(s);
        });
        this.colors = Object.keys(this.colorGroups);

        this.colorIndex = 0;
        this.stitchIndex = 0;
    }

    draw(){ this.stitches.forEach(s=>s.draw()); }

    update(){
        const currentColor = this.colors[this.colorIndex];
        const group = this.colorGroups[currentColor];
        const stitch = group?.[this.stitchIndex];
        if(!stitch) return;

        if(stitch.state===0) stitch.state=1;
        stitch.update();
        if(stitch.state===2) stitch.state=3;
        if(stitch.state===4) this.stitchIndex++;
        if(this.stitchIndex >= group.length){
            this.stitchIndex=0;
            this.colorIndex++;
            if(this.colorIndex>=this.colors.length) this.colorIndex=0;
        }
    }
}

// --- PATTERN PIXEL ART ---

// 1️⃣ CUORE
const heartPattern = [
  [0,1,0,1,0],
  [1,2,1,2,1],
  [1,2,2,2,1],
  [0,1,2,1,0],
  [0,0,1,0,0]
];

// 2️⃣ STELLA
const starPattern = [
  [0,0,1,0,0],
  [0,1,1,1,0],
  [1,1,1,1,1],
  [0,1,1,1,0],
  [0,0,1,0,0]
];

// 3️⃣ SLIMEY / SMILEY
const slimePattern = [
  [0,1,1,1,0],
  [1,2,2,2,1],
  [1,2,3,2,1],
  [1,2,2,2,1],
  [0,1,1,1,0]
];

// --- CREAZIONE ISTANZE ---
const patterns = [
    new PatternStitches(heartPattern, palettes[0], 150, 100),
    new PatternStitches(starPattern, palettes[1], 350, 100),
    new PatternStitches(slimePattern, palettes[2], 550, 100)
];

// --- ANIMAZIONE ---
function animate(){
    requestAnimationFrame(animate);
    context.clearRect(0,0,canva.width,canva.height);
    patterns.forEach(p=>{
        p.draw();
        p.update();
    });
}

animate();
