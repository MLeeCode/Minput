function createLine(vertices, width=0.1, color=0x000){
  const line = new MeshLine();
  line.setPoints(vertices, p => width);
  const material = new MeshLineMaterial({color: color});
  return new THREE.Mesh(line, material);
}

function createArrow(startVertex, endVertex, width=0.1, headWidth=0.5, color=0x000){
  const vertices = [startVertex, endVertex];
  const line = createLine(vertices, width, color);
  const arrowHead = createTriangle(headWidth, color=color);

  var arrowPos = new THREE.Vector3(0, 1, 0);





  if(startVertex.x > endVertex.x){
    var endVertexCopy = new THREE.Vector3(0, 0, 0)
    endVertexCopy.copy(endVertex);
    var direction = endVertexCopy.sub(startVertex);
    var angle = direction.angleTo(arrowPos);
  }else{
    var direction = startVertex.sub(endVertex);
    var angle = arrowPos.angleTo(direction);

  }



  arrowHead.position.set(endVertex.x, endVertex.y, endVertex.z);
  arrowHead.rotateZ(angle);
  console.log(angle)
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
  group.add(border);
  group.add(shape);

  return group;
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
    new THREE.Vector3(-1 * halfSize, -1 * halfSize, 0),
    new THREE.Vector3(0, 2 * halfSize, 0),
    new THREE.Vector3(1 * halfSize, -1 * halfSize, 0),
  ]
  return createPolygon(vertices, color);
}
