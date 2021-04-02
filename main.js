const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1000 / 500, 0.1, 1000);

var canvas = document.getElementById("minput");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, autoSize: true });
renderer.setSize(1000, 500);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xffffff, 1);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;
const controls = new THREE.OrbitControls(camera, renderer.domElement);


axis = new Axis2D(0, 5, 0, 5, 5, 5);
axis.position(new THREE.Vector3(-2.5, -2.5, 0));

function sin(x) {
    return Math.sin(x ** 2) + 3;
}

function cos(x) {
    return Math.cos(x ** 2) + 3;
}

axis.parametricPlot(sin);
axis.parametricPlot(cos, 0x00aaaa);

triangle = new Circle(0.2, 50, { color: 0x0000ff, strokeWidth: 0 });

triangle.position(axis.p2l(2, 4));

var xSlider = document.getElementById("xAxis");
var ySlider = document.getElementById("yAxis");

console.log(axis.xAxis.p2l(0));
console.log(axis.yAxis.p2l(0));

const animate = function () {
    requestAnimationFrame(animate);
    triangle.position(axis.p2l(xSlider.value, ySlider.value));
    controls.update();
    renderer.render(scene, camera);
};

animate();

/*
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

function func(x){
  return Math.sin(x * 3.14);
}

function drawMathjax(text, x, y){
  var para = document.createElement("p");
  var node = document.createTextNode(text);
  para.appendChild(node);
  para.style.position = "absolute";
  para.style.margin = 0;
  para.style.left = canvas.offsetLeft + x + "px";
  para.style.top = canvas.offsetTop + y + "px";
  document.body.appendChild(para);
  var group = new THREE.Group();
  group.add(para);

  MathJax.typesetPromise();
  return group;

}

function updateGrid(grid, squares) {
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            var s = squares[i][j];
            s.material.color = new THREE.Color(grid[i][j], 0, 0);
        }
    }
}
*/


