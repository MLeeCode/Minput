const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 500 / 500, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true, autoSize: true });
renderer.setSize(500, 500);
renderer.setClearColor( 0xffffff, 1 );
document.body.appendChild( renderer.domElement );


//const square = createTriangle(3, color=0x000000);
//var s = createSquare(3, color=0x00ff00);

//const arr = createArrow(new THREE.Vector3(2, 1, 0), new THREE.Vector3(-2, 3, 0));
//var arr = createArrow(new THREE.Vector3(-2, 3, 0), new THREE.Vector3(2, 1, 0));
//scene.add(s)
//scene.add(square);
//scene.add(arr);
var halfWidth = 1;
var halfHeight = 1;
var vertices = [
  new THREE.Vector3(-1 * halfWidth, 1 * halfHeight, 0),
  new THREE.Vector3(1 * halfWidth, 1 * halfHeight, 0),
  new THREE.Vector3(1 * halfWidth, -1 * halfHeight, 0),
  new THREE.Vector3(-1 * halfWidth, -1 * halfHeight, 0)
]

var obj = new Triangle(0.2, {color :0x00ff88, strokeColor: 0x666});
var line = new NumberLine(0, 4, 3);
var translation = document.getElementById("translate");
var rotation = document.getElementById("rotation");
var scale = document.getElementById("scale");

function setVertex(object, index, vector){
  var pArr = object.geometry.attributes.position.array;
  pArr[index * 3] = vector.x;
  pArr[index * 3 + 1] = vector.y;
  pArr[index * 3 + 2] = vector.z;
  object.geometry.attributes.position.needsUpdate = true;
}

function translateVector(object, index, translateVector){
  var pArr = object.geometry.attributes.position.array;
  pArr[index * 3] += translateVector.x;
  pArr[index * 3 + 1] += translateVector.y;
  pArr[index * 3 + 2] += translateVector.z;
  object.geometry.attributes.position.needsUpdate = true;
}

function moveArrow(arr, startVertex, endVertex){
  var arr2 = createArrow(startVertex, endVertex);
  arr.children[0].geometry = arr2.children[0].geometry;
  arr.children[1] = arr2.children[1];
  return arr;
}

camera.position.z = 5;
const animate = function () {
  requestAnimationFrame( animate );

  line.positionX(translation.value);
  line.rotateZ(-rotation.value)
  line.positionY(0);

  obj.position(line.p2l(scale.value));
  //console.log(line.p2l(scale.value));
  /*
  square.rotateZ(0.01);



  //s.rotation.z = slider.value;

  s.geometry.attributes.position.array[0] = slider.value;

  arr = moveArrow(arr, new THREE.Vector3(-2, 3, 0),
  new THREE.Vector3(s.geometry.attributes.position.array[0], s.geometry.attributes.position.array[1], 0));
  s.geometry.attributes.position.needsUpdate = true;
  */
  //arr.children[1].rotation.z = slider.value;
  renderer.render( scene, camera );
};

animate();
