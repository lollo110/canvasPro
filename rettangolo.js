let canva = document.querySelector("canvas");
let context = canva.getContext("2d");

canva.width = window.innerWidth -50;
canva.height = window.innerHeight -20;


class Rettangolo {
  constructor(x, y, dy, width, height, color, rotationj) {
    this.x = x;
    this.y = y;

    this.dy = dy;
    this.width = width;
    this.height = height;
    this.color = color;
    this.rotation = this.rotation;

  }

  draw() {
    context.beginPath();
    context.fillStyle = this.color;
    context.stroke();
    context.strokeStyle = "black";

    context.fillRect(this.x, this.y, this.width, this.height);
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.closePath();
  }
  update() {
    let targetY = canva.height / 2;

    if (this.y + this.height >= targetY){
        this.y = targetY -this.height;
     } 


    this.y += this.dy;


    this.draw();
  }
}

let rett;
let rett2;
function init() {
  let x = canva.width / 2 - 250;
  let x2 = canva.width / 2 ;
  var dy = 5;
  let y = 0;
  rett = new Rettangolo(x, y, dy, 500, 100, "green");
  rett2 = new Rettangolo(x2, y, dy, 500, 100, "red");
}

function animate(){
    requestAnimationFrame(animate);
    context.clearRect(0,0,canva.width,canva.height);
    rett.update();
    rett2.update();
}

init();
animate();