function Particle(b, c, a) {
  this.init(b, c, a);
}
Particle.prototype = {
  init: function (b, c, a) {
    this.alive = true;
    this.radius = a || 10;
    this.wander = 0.15;
    this.theta = random(TWO_PI);
    this.drag = 0.92;
    this.color = "#fff";
    this.x = b || 0;
    this.y = c || 0;
    this.vx = 0;
    this.vy = 0;
  },
  move: function () {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.theta += random(-0.5, 0.5) * this.wander;
    this.vx += sin(this.theta) * 0.1;
    this.vy += cos(this.theta) * 0.1;
    this.radius *= 0.96;
    this.alive = this.radius > 0.5;
  },
  draw: function (a) {
    a.beginPath();
    a.arc(this.x, this.y, this.radius, 0, TWO_PI);
    a.fillStyle = this.color;
    a.fill();
  },
};
var MAX_PARTICLES = 280;
var COLOURS = [
  "#69D2E7",
  "#A7DBD8",
  "#E0E4CC",
  "#F38630",
  "#FA6900",
  "#FF4E50",
  "#F9D423",
];
var particles = [];
var pool = [];
var demo = Sketch.create({ container: document.getElementById("container") });
demo.setup = function () {
  var a, b, c;
  for (a = 0; a < 20; a++) {
    b = demo.width * 0.5 + random(-100, 100);
    c = demo.height * 0.5 + random(-100, 100);
    demo.spawn(b, c);
  }
};
demo.spawn = function (a, b) {
  if (particles.length >= MAX_PARTICLES) {
    pool.push(particles.shift());
  }
  particle = pool.length ? pool.pop() : new Particle();
  particle.init(a, b, random(5, 40));
  particle.wander = random(0.5, 2);
  particle.color = random(COLOURS);
  particle.drag = random(0.9, 0.99);
  theta = random(TWO_PI);
  force = random(2, 8);
  particle.vx = sin(theta) * force;
  particle.vy = cos(theta) * force;
  particles.push(particle);
};
demo.update = function () {
  var a, b;
  for (a = particles.length - 1; a >= 0; a--) {
    b = particles[a];
    if (b.alive) {
      b.move();
    } else {
      pool.push(particles.splice(a, 1)[0]);
    }
  }
};
demo.draw = function () {
  demo.globalCompositeOperation = "lighter";
  for (var a = particles.length - 1; a >= 0; a--) {
    particles[a].draw(demo);
  }
};
demo.mousemove = function () {
  var f, g, a, h, d, b, c, e;
  for (b = 0, e = demo.touches.length; b < e; b++) {
    (h = demo.touches[b]), (d = random(1, 4));
    for (c = 0; c < d; c++) {
      demo.spawn(h.x, h.y);
    }
  }
};
