const canva = document.querySelector("canvas");
const context = canva.getContext("2d");

canva.width = window.innerWidth - 50;
canva.height = window.innerHeight - 20;

function randomIntFromRanger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Polygon {
  constructor(cx, cy, radius, sides, rotation, color) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.sides = sides;
    this.rotation = rotation;
    this.color = color;
  }

  draw() {
    context.beginPath();
    context.fillStyle = this.color;

    for (let i = 0; i < this.sides; i++) {
      const angle = (i * 2 * Math.PI) / this.sides + this.rotation;
      const x = this.cx + this.radius * Math.cos(angle);
      const y = this.cy + this.radius * Math.sin(angle);

      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.closePath();
    context.fill();

    context.stroke();
  }
}

// let poly = new Polygon(canva.width / 2 ,canva.height / 2,300,5,Math.PI /1.42, "red");

// poly.draw();

let polygons = [];

function init() {
  

  for (let i = 0; i < 1000; i++) {
    let x = randomIntFromRanger(150, canva.width - 150);
  let y = randomIntFromRanger(150, canva.height - 150);
  let sides = randomIntFromRanger(3,10);
  let radius = randomIntFromRanger(20,90);
  rotation = Math.random() * Math.PI * 2;
  let color = `rgb(${randomIntFromRanger(0,255)},${randomIntFromRanger(0,255)},${randomIntFromRanger(0,255)})`;
    polygons.push(new Polygon(x,y,radius,sides,rotation,color));
  }
}

function animate(){
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canva.width, canva.height);

    polygons.forEach(polygon => {
        polygon.draw();
        polygon.rotation += 0.01;

    })
}

init();
animate();
