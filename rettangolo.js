let canva = document.querySelector("canvas");
let context = canva.getContext("2d");

canva.width = window.innerWidth -50;
canva.height = window.innerHeight -20;


class Rettangolo {
  constructor(x, y, dy, width, height, rotation, rotationSpeed, maxRotation, translationX, maxTranslationX) {
    this.x = x;
    this.y = y;

    this.dy = dy;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.rotationSpeed = rotationSpeed;
    this.maxRotation = maxRotation;
    this.translationX = translationX;
    this.maxTranslationX = maxTranslationX;
    this.cellSize = 10;
    this.thread = 6;
    this.hole = 6;

  }

  draw() {

    context.save();
    
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    context.translate(cx,cy);
    context.rotate(this.rotation);
    

    context.fillStyle = "#c5babaff";

    context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    const startX = -this.width / 2;
    const startY = -this.height / 2;

    context.fillStyle = "#ffffff";
    for (let x = startX; x < this.width / 2; x += this.cellSize) {
      context.fillRect(
        x + (this.cellSize - this.thread) / 2,
        startY,
        this.thread,
        this.height
      );
    }

    for (let y = startY; y < this.height / 2; y += this.cellSize){
      context.fillRect(
        startX,
        y + (this.cellSize - this.thread) / 2,
        this.width,
        this.thread
      );
      
    }

    context.clearRect(0, 0, 0, 0);
    for (let y = startY; y < this.height / 2; y += this.cellSize){
      for (let x = startX; x < this.width / 2; x += this.cellSize) {
        context.clearRect(
          x + (this.cellSize - this.hole) / 2,
          y + (this.cellSize - this.hole) / 2,
          this.hole,
          this.hole
        );
        
      }
    }
    context.strokeStyle='black';
    context.strokeRect(startX, startY, this.width, this.height);
    
    
    
    context.restore();
  }
  update() {
    let targetY = canva.height / 2;

    if(!this.isStopped){
       if (this.y + this.height >= targetY){
        this.y = targetY -this.height;
        this.isStopped = true;
     } else{
       this.y += this.dy;
     }

    } else {
      if(Math.abs(this.rotation) < Math.abs(this.maxRotation)){
        this.x += this.translationX;
        this.rotation += this.rotationSpeed;
      }
      
    }
   

    this.draw();
  }
}

let rett;
let rett2;
function init() {
  let x = canva.width / 2 - 500;
  let x2 = canva.width / 2 ;
  var dy = 5;
  let y = 0;
  rett = new Rettangolo(x, y, dy, 500, 100, 0,0.02, Math.PI / 12,20);
  rett2 = new Rettangolo(x2, y, dy, 500, 100, 0,-0.02,-Math.PI / 12,-20);
}

function animate(){
    requestAnimationFrame(animate);
    context.clearRect(0,0,canva.width,canva.height);
    rett.update();
    rett2.update();
}

init();
animate();