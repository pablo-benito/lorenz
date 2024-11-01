let zoom = 500; 
let lastMouseX = 0;
let lastMouseY = 0;
let camX = 1;
let camY = 0;
let canvas_height = 500;
MAX_POINTS = 2000;


class Trajectory {
  a = 10;
  b = 30;
  c = 8.0 / 3.0;
  dt = 0.01;

  constructor(x, y, z, hue) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.hue = hue;
    this.points = [];
  }

  draw() {
    for (let i = 0; i < 3; i++) {
      let dx = (this.a * (this.y - this.x)) * this.dt;
      let dy = (this.x * (this.b - this.z) - this.y) * this.dt;
      let dz = (this.x * this.y - this.c * this.z) * this.dt;
      this.x += dx;
      this.y += dy;
      this.z += dz;

      this.points.push({
        pos: createVector(this.x, this.y, this.z),
        hue: this.hue
      });
    }

    push()

      let hu = this.hue;      
      stroke(hu, 255, 255, 100); 
      setAttributes('antialias', true);

      beginShape();

        for (let i = 1; i < this.points.length; i++) {
          let v1 = this.points[i - 1].pos;  
          let v2 = this.points[i].pos;  
          vertex(v1.x * 10, v1.y * 10, v1.z * 10); 
          vertex(v2.x * 10, v2.y * 10, v2.z * 10);
        }

      endShape()
      let pp = this.points[this.points.length - 1].pos;
      translate(pp.x * 10, pp.y * 10, pp.z * 10); 

      sphere(5);

    pop();

    if (this.points.length > MAX_POINTS) {
      this.points = this.points.slice(this.points.length - MAX_POINTS, this.points.length)
    }

  }
}


function setup() {
  var canvas = createCanvas(windowWidth, canvas_height, WEBGL);
  canvas.parent("p5jsContainer");

  colorMode(HSB, 360, 100, 100, 100);
  strokeWeight(1.85);
  frameRate(60)

  t1_color = random(0, 360)
  t2_color = (t1_color + 120) % 360
  t1 = new Trajectory(0.01, 0, 0, t1_color)
  t2 = new Trajectory(0.01 + 0.2*random(-1, 1), 0, 0, t2_color)
  noFill();

  // KUDOS: https://www.geeksforgeeks.org/how-to-detect-whether-the-website-is-being-opened-in-a-mobile-device-or-a-desktop-in-javascript/
  let regexp = /android|iphone|kindle|ipad/i;
  let isMobileDevice = regexp.test(navigator.userAgent);

  if (isMobileDevice) {
    MAX_POINTS = 1000;
  }
}

function draw() {

  background(230, 50, 15);

  translate(camX, camY, -zoom);

  let angle = frameCount * 0.01;
  rotateX(angle);
  rotateY(angle);
  rotateZ(angle);
  
  t1.draw()
  t2.draw()

  orbitControl();

}

function windowResized() {
  let fs = fullscreen();
  if (fs) {
    document.getElementById('head').style.display = 'none';
    document.getElementById('bottom').style.display = 'none';
    document.body.style.overflow = 'hidden';
    resizeCanvas(windowWidth, windowHeight);

  } else {
    document.getElementById('head').style.display = 'block';
    document.getElementById('bottom').style.display = 'block';
    document.body.style.overflow = 'auto';
    resizeCanvas(windowWidth, canvas_height);

  }
  
}

function doubleClicked() {
  let fs = fullscreen();
  fullscreen(!fs);
}