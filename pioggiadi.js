const canva = document.querySelector("canvas");
const context = canva.getContext("2d");

canva.width = innerWidth;
canva.height = innerHeight;


context.beginPath();
context.strokeStyle='bleck';
context.moveTo(-100, 0);
context.quadraticCurveTo(canva.width / 2 - 100 , canva.height - 100, canva.width + 100, 0);

// context.lineTo(canva.width, canva.height / 2);
context.stroke();



