// script.js
// Lógica p5 para animaciones y la interacción del botón central

let flores = [];
let petalos = [];
let confettis = [];
let frases = [
  "Eres mi sol en los días nublados 🌞",
  "Tu sonrisa ilumina mi vida 💛",
  "Si pudiera darte una flor por cada vez que pienso en ti, tendría un jardín infinito 🌸",
  "Eres mi lugar favorito en el mundo 🌍",
  "Cada día contigo es primavera 🌼",
        "Eres la razón de mi felicidad 😊",
];

let mostrar = false;
let fraseActual = "";

function setup() {
  // crear canvas con densidad de píxeles para pantallas HD
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-wrap');
  pixelDensity(min(2, window.devicePixelRatio || 1));
  noStroke();

  // ajustar cantidad de partículas según tamaño de pantalla para rendimiento
  const area = windowWidth * windowHeight;
  let flowerCount = 30;
  let confettiCount = 12;
  if (windowWidth < 480) { flowerCount = 14; confettiCount = 6; frameRate(40); }
  else if (windowWidth < 900) { flowerCount = 22; confettiCount = 10; frameRate(50); }
  else { flowerCount = 40; confettiCount = 18; frameRate(60); }

  for (let i = 0; i < flowerCount; i++) flores.push(new Flor());
  for (let i = 0; i < confettiCount; i++) confettis.push(new Confetti());

  const btn = document.getElementById('btnSorpresa');
  const card = document.getElementById('centerCard');
  btn.addEventListener('click', () => {
    mostrar = true;
    fraseActual = random(frases);
    document.getElementById('fraseBig').textContent = fraseActual;
    card.classList.add('show');
    // generar más confetti al mostrar (cantidad adaptativa)
    const extra = windowWidth < 480 ? 30 : 60;
    for (let i = 0; i < extra; i++) confettis.push(new Confetti(true));
  });
}

function draw() {
  clear();
  // fondo suave con luz radial
  drawBackground();

  // pétalos flotando
  for (let p of petalos) { p.update(); p.show(); }

  // flores
  for (let f of flores) { f.update(); f.show(); }

  // confetti
  for (let c of confettis) { c.update(); c.show(); }

  if (mostrar) {
    // dibujar una flor grande y centros con brillo
    push();
    translate(width/2, height/2 - 20);
    // escalar flor grande según pantalla
    const base = windowWidth < 480 ? 110 : (windowWidth < 900 ? 140 : 160);
    drawLargeFlower(0, 0, base);
    pop();
  }
}

function drawBackground(){
  // brillo suave en la esquina superior izquierda
  push();
  noStroke();
  for (let i=0;i<6;i++){
    fill(255, 250, 220, 18 - i*2);
    ellipse(width*0.12, height*0.12, 400 + i*120, 300 + i*80);
  }
  pop();
}

class Flor{
  constructor(){
    this.x = random(width);
    this.y = random(-200, height);
    this.size = random(18, 36);
    this.speed = random(0.5, 2.2);
    this.ang = random(TWO_PI);
  }
  update(){
    this.y += this.speed;
    this.ang += 0.01;
    if (this.y > height + 50){ this.y = random(-120, -10); this.x = random(width); }
  }
  show(){
    push();
    translate(this.x, this.y);
    rotate(sin(this.ang)*0.2);
    fill(255,235,59, 230);
    for (let i=0;i<7;i++){
      let a = TWO_PI/7*i;
      ellipse(cos(a)*this.size, sin(a)*this.size, this.size, this.size*1.2);
    }
    fill(255,193,7);
    ellipse(0,0,this.size*1.1);
    pop();
  }
}

class Confetti{
  constructor(spark=false){
    this.x = random(width);
    this.y = spark? random(-50, height): random(-400, -10);
    this.size = random(6, 12);
    this.col = color(random(200,255), random(150,230), random(90,200));
    this.speed = random(1,4);
    this.rot = random(TWO_PI);
    this.spin = random(-0.08,0.08);
  }
  update(){
    this.y += this.speed;
    this.x += sin(this.y*0.01)*0.6;
    this.rot += this.spin;
    if (this.y > height+20) { this.y = random(-200, -10); this.x = random(width); }
  }
  show(){
    push();
    translate(this.x, this.y);
    rotate(this.rot);
    fill(this.col);
    rectMode(CENTER);
    rect(0,0,this.size,this.size*0.6,2);
    pop();
  }
}

function drawLargeFlower(x,y,size){
  push();
  translate(x,y);
  let petalos = 10;
  for (let i=0;i<petalos;i++){
    let a = TWO_PI/petalos*i + frameCount*0.002*i;
    fill(255,243,122, 240);
    ellipse(cos(a)*size*0.6, sin(a)*size*0.6, size*0.9, size*0.9);
  }
  fill(255,193,7);
  ellipse(0,0,size*1.1);
  // brillo central
  noFill();
  stroke(255, 255, 255, 90);
  strokeWeight(2);
  ellipse(0,0,size*1.6);
  noStroke();
  pop();
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  // limpiar y regenerar menos partículas si es un dispositivo pequeño
  flores = [];
  confettis = [];
  const flowerCount = windowWidth < 480 ? 14 : (windowWidth < 900 ? 22 : 40);
  const confettiCount = windowWidth < 480 ? 6 : (windowWidth < 900 ? 10 : 18);
  for (let i = 0; i < flowerCount; i++) flores.push(new Flor());
  for (let i = 0; i < confettiCount; i++) confettis.push(new Confetti());
}
