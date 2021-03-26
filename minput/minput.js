
class Mtransform{
  positionX(value){
    this.group.position.x = value;
  }

  positionY(value){
    this.group.position.y = value;
  }

  positionZ(value){
    this.group.position.z = value;
  }

  position(vector){
    this.positionX(vector.x);
    this.positionY(vector.y);
    this.positionZ(vector.z);
  }

  scaleX(value){
    this.group.scale.x = value;
  }

  scaleY(value){
    this.group.scale.y = value;
  }

  scaleZ(value){
    this.group.scale.z = value;
  }

  scale(vector){
    this.scaleX(vector.x);
    this.scaleY(vector.y);
    this.scaleZ(vector.z);
  }

  rotateX(value){
    this.group.rotation.x = value;
  }

  rotateY(value){
    this.group.rotation.y = value;
  }

  rotateZ(value){
    this.group.rotation.z = value;
  }

  rotate(vector){
    this.rotateX(vector.x);
    this.rotateY(vector.y);
    this.rotateZ(vector.z);
  }
}

class Mobject extends Mtransform{
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

  constructor(vertices, {color=0x000, strokeColor=0x000, strokeWidth=0.1} = {}){
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
    var material = new MeshLineMaterial({color: this.strokeColor});
    this.border = new THREE.Mesh(line, material);
    return this.border;
  }

  create(addToScene=true){
    this.shape = new THREE.Shape(this.vertices);
    this.geometry = this.createGeometry(this.shape);
    this.material = new THREE.MeshBasicMaterial({color: this.color});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.border = this.createBorder();
    this.group = new THREE.Group();
    this.group.add(this.mesh);
    this.group.add(this.border);
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
  contructor(vertices, {color=0x000, strokeColor=0x000, strokeWidth=0.1} = {}){
    super(vertices);
  }
}

function createLine(vertices, width=0.1, color=0x000){
  const line = new MeshLine();
  line.setPoints(vertices, p => width);
  const material = new MeshLineMaterial({color: color});
  return new THREE.Mesh(line, material);
}

function createArrow(startVertex, endVertex, width=0.03, headWidth=0.15, color=0x000){

  var dxdy = new THREE.Vector3(endVertex.x - startVertex.x, endVertex.y - startVertex.y, endVertex.z - startVertex.z);
  var dist = startVertex.distanceTo(endVertex);
  if(dist > 0){
    dxdy.x /= dist;
    dxdy.y /= dist;
  }
  dxdy.x *= dist - headWidth;
  dxdy.y *= dist - headWidth;
  endVertex = new THREE.Vector3(startVertex.x + dxdy.x, startVertex.y + dxdy.y, 0);
  var vertices = [startVertex, endVertex];
  var line = createLine(vertices, width, color);
  var arrowHead = createTriangle(headWidth, color=color);


  //console.log(dist);
  // Calculate the angle between points
  arrowHead.translateX(endVertex.x);
  arrowHead.translateY(endVertex.y);

  var v1 = endVertex.sub(startVertex);
  var v2 = new THREE.Vector3(0, 1, 0);
  var angle = v2.angleTo(v1);
  var orientation = v1.x * v2.y - v1.y * v2.x;
  if(orientation > 0) angle = 2*Math.PI - angle;

  arrowHead.rotateZ(angle);

  const group = new THREE.Group();
  group.add(line);
  group.add(arrowHead);
  return group;
}

function createPolygon(vertices, color=0x1b87e5, strokeColor=0x000000, strokeWidth=0.1){
  const s = new THREE.Shape(vertices);

  const geometry = new THREE.ShapeGeometry(s);
  const material = new THREE.MeshBasicMaterial({color: color});
  const shape = new THREE.Mesh(geometry, material);
  vertices.push(vertices[0]);
  const border = createLine(vertices, width=strokeWidth, color=strokeColor);
  const group = new THREE.Group();

  group.add(shape);
  //group.add(border);

  return shape;
}

function createRectangle(width=2, height=1, color=0x1b87e5){
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  var vertices = [
    new THREE.Vector3(-1 * halfWidth, 1 * halfHeight, 0),
    new THREE.Vector3(1 * halfWidth, 1 * halfHeight, 0),
    new THREE.Vector3(1 * halfWidth, -1 * halfHeight, 0),
    new THREE.Vector3(-1 * halfWidth, -1 * halfHeight, 0)
  ]
  return createPolygon(vertices, color);
}

function createSquare(size=1, color=0x9b27af){
  return createRectangle(size, size, color);
}

function createCircle(diameter=1, steps=50, color=0x1b87e5){
  var radius = diameter / 2
  var stepDist = Math.PI * 2 / steps;
  var vertices = [];
  for(var i=0; i < Math.PI * 2; i += stepDist){
    var v = new THREE.Vector3(Math.cos(i) * radius, Math.sin(i) * radius, 0);
    vertices.push(v);
  }
  return createPolygon(vertices, color);
}

function createTriangle(size=1, color=0x1b87e5){
  var halfSize = size / 2;
  var vertices = [
    new THREE.Vector3(-1 * halfSize, 0, 0),
    new THREE.Vector3(0, size, 0),
    new THREE.Vector3(1 * halfSize, 0, 0),
  ]
  var triangle = createPolygon(vertices, color);
  return triangle;
}
