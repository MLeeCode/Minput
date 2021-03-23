const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 500 / 500, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true, autoSize: true });
renderer.setSize(500, 500);
renderer.setClearColor( 0xffffff, 1 );
document.body.appendChild( renderer.domElement );


const square = createTriangle(3, color=0xffffff);

//const arr = createArrow(new THREE.Vector3(2, 1, 0), new THREE.Vector3(-2, 3, 0));
const arr = createArrow(new THREE.Vector3(-2, 3, 0), new THREE.Vector3(2, 1, 0));
scene.add(square);
scene.add(arr);

camera.position.z = 5;

const animate = function () {
  requestAnimationFrame( animate );

  square.rotateZ(0.01);

  renderer.render( scene, camera );
};

animate();
