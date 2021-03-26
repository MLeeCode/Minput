
class Mtransform {

  positionX(value){
    value = parseFloat(value);
    this.group.position.x = value;
  }

  positionY(value){
    value = parseFloat(value);
    this.group.position.y = value;
  }

  positionZ(value){
    value = parseFloat(value);
    this.group.position.z = value;
  }

  position(vector){
    this.positionX(vector.x);
    this.positionY(vector.y);
    this.positionZ(vector.z);
  }

  scaleX(value){
    value = parseFloat(value);
    this.group.scale.x = value;
  }

  scaleY(value){
    value = parseFloat(value);
    this.group.scale.y = value;
  }

  scaleZ(value){
    value = parseFloat(value);
    this.group.scale.z = value;
  }

  scale(vector){
    this.scaleX(vector.x);
    this.scaleY(vector.y);
    this.scaleZ(vector.z);
  }

  rotateX(value){
    value = parseFloat(value);
    this.group.rotation.x = value;
  }

  rotateY(value){
    value = parseFloat(value);
    this.group.rotation.y = value;
  }

  rotateZ(value){
    value = parseFloat(value);
    this.group.rotation.z = value;
  }

  rotate(vector){
    this.rotateX(vector.x);
    this.rotateY(vector.y);
    this.rotateZ(vector.z);
  }
}

class Mobject extends Mtransform {
  mesh;
  shape;
  geometry;
  border;
  group;
  material;
  vertices;
  color;
  strokeColor;
  strokeWidth;

  constructor(vertices, {color=0x000, strokeColor=0x000, strokeWidth=0.01} = {}){
    super();
    this.vertices = vertices;
    this.color = color;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;

    this.create();
  }

  createGeometry(shape){
    return new THREE.ShapeGeometry(shape);
  }

  createBorder(){
    var borderVerts = this.vertices;
    borderVerts.push(borderVerts[0])
    var line = new MeshLine();
    line.setPoints(borderVerts, p => this.strokeWidth);
    var material = new MeshLineMaterial({color: this.strokeColor, sizeAttenuation: 1});
    this.border = new THREE.Mesh(line, material);
    return this.border;
  }

  create(addToScene=true, border=true, meshMaterial=THREE.MeshBasicMaterial){
    this.shape = new THREE.Shape(this.vertices);
    this.geometry = this.createGeometry(this.shape);
    this.material = new meshMaterial({color: this.color});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.group = new THREE.Group();
    this.group.add(this.mesh);
    if(border){
      this.border = this.createBorder();
      this.group.add(this.border);
    }
    if(addToScene){
      scene.add(this.group);
    }
    return this.group;
  }

  update(){
    var shape = new THREE.Shape(this.vertices);
    this.geometry = this.createGeometry(shape);

    var newBorder = this.createBorder();
    this.border.geometry = newBorder.geometry;

    this.geometry.attributes.position.needsUpdate = true;
    this.border.geometry.attributes.position.needsUpdate = true;
  }
}

class Polygon extends Mobject {

}

class Rectangle extends Polygon {
  constructor(width=2, height=1, {color=0x000, strokeColor=0x000, strokeWidth=0.1} = {}){
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var vertices = [
      new THREE.Vector3(-1 * halfWidth, 1 * halfHeight, 0),
      new THREE.Vector3(1 * halfWidth, 1 * halfHeight, 0),
      new THREE.Vector3(1 * halfWidth, -1 * halfHeight, 0),
      new THREE.Vector3(-1 * halfWidth, -1 * halfHeight, 0)
    ]
    super(vertices, {color: color, strokeColor: strokeColor, strokeWidth: strokeWidth});
  }
}

class Square extends Rectangle {
  constructor(size=1, {color=0x000, strokeColor=0x000, strokeWidth=0.1} = {}){
    super(size, size, {color: color, strokeColor:strokeColor, strokeWidth:strokeWidth});
  }
}

class Circle extends Polygon {
  constructor(diameter=1, steps=50, {color=0x000, strokeColor=0x000, strokeWidth=0.1} = {}){
    var radius = diameter / 2
    var stepDist = Math.PI * 2 / steps;
    var vertices = [];
    for(var i=0; i < Math.PI * 2; i += stepDist){
      var v = new THREE.Vector3(Math.cos(i) * radius, Math.sin(i) * radius, 0);
      vertices.push(v);
    }
    super(vertices, {color: color, strokeColor: strokeColor, strokeWidth: strokeWidth});
  }
}

class Triangle extends Polygon {
  constructor(size=1, {color=0x000, strokeColor=0x000, strokeWidth=0.1} = {}){
    var halfSize = size / 2;
    var vertices = [
      new THREE.Vector3(-1 * halfSize, 0, 0),
      new THREE.Vector3(0, size, 0),
      new THREE.Vector3(1 * halfSize, 0, 0),
    ]
    super(vertices, {color: color, strokeColor: strokeColor, strokeWidth: strokeWidth});
  }
}

class Line extends Mobject {
  constructor(startVertex=new THREE.Vector3(-0.5, 0, 0), endVertex=new THREE.Vector3(0.5, 0, 0), {color=0x000, strokeColor=0x000, strokeWidth=0.1} = {}){
    var vertices = [startVertex, endVertex];
    super(vertices, {color: strokeColor, strokeColor: strokeColor, strokeWidth: strokeWidth});
    this.startVertex = startVertex;
    this.endVertex = endVertex;
  }

  create(addToScene=true){
    this.shape = new MeshLine();
    this.shape.setPoints(this.vertices, p => this.strokeWidth);
    this.material = new MeshLineMaterial({color: this.strokeColor});
    this.mesh = new THREE.Mesh(this.shape, this.material);
    this.geometry = this.mesh.geometry;
    this.group = new THREE.Group();
    this.group.add(this.mesh);
    if(addToScene){
      scene.add(this.group);
    }
  }
}

// Complex Structures

class NumberLine extends Line {
  constructor(minVal=0, maxVal=1, width=1, {color=0x000, strokeColor=0x000, strokeWidth=0.1} = {}){
    super(new THREE.Vector3(-0.5 * width, 0, 0), new THREE.Vector3(0.5 * width, 0, 0),
    {color: strokeColor, strokeColor: strokeColor, strokeWidth: strokeWidth});
    this.minVal = minVal;
    this.maxVal = maxVal;
  }

  pointToLine(x){
    var alpha = getInterpolateAlpha(this.minVal, this.maxVal, x);
    //console.log(alpha);
    var vec = linearInterpolateVectors(this.startVertex, this.endVertex, alpha);
    vec.applyAxisAngle(new THREE.Vector3(0, 0, 1), this.group.rotation.z);
    vec.add(this.group.position);
    return vec;
  }

  p2l(x){
    return this.pointToLine(x);
  }
}

// Interpolation Functions

function linearInterpolateVectors(a, b, alpha, interpolation=EasingFunction.linear){
  a = a.clone();
  b = b.clone();
  alpha = interpolation(alpha);
  return b.multiplyScalar(alpha).add(a.multiplyScalar(1 - alpha));
}

function linearInterpolate(a, b, alpha, interpolation=EasingFunction.linear){
  alpha = interpolation(alpha);
  return (b - a) * alpha + a;
}

function getInterpolateAlpha(num1, num2, num3){
  return num3 / (num2 - num1);
}

var EasingFunction = {
  // no easing, no acceleration
  linear: t => t,
  // accelerating from zero velocity
  easeInQuad: t => t*t,
  // decelerating to zero velocity
  easeOutQuad: t => t*(2-t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
  // accelerating from zero velocity
  easeInCubic: t => t*t*t,
  // decelerating to zero velocity
  easeOutCubic: t => (--t)*t*t+1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
  // accelerating from zero velocity
  easeInQuart: t => t*t*t*t,
  // decelerating to zero velocity
  easeOutQuart: t => 1-(--t)*t*t*t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
  // accelerating from zero velocity
  easeInQuint: t => t*t*t*t*t,
  // decelerating to zero velocity
  easeOutQuint: t => 1+(--t)*t*t*t*t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
}
