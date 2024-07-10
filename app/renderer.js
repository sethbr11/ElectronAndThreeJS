import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from '../node_modules/three/examples/jsm/loaders/STLLoader.js';
import WebGL from '../node_modules/three/examples/jsm/capabilities/WebGL.js';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';

// AxesHelper
const axesHelper = new THREE.AxesHelper(5);

// Scene
const scene = new THREE.Scene();
scene.add(axesHelper);
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, -40, 50);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Resize Renderer
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

// STL Loader
const loader = new STLLoader();
loader.load('./models/Wolf_Rider.stl', function (geometry) {
  const mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
  scene.add(mesh);
}, function (xhr) {
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, function (error) {
  console.error(error);
});

// // Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Render
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  stats.update();
}

if (WebGL.isWebGLAvailable()) {
  animate();
} else {
  const warning = WebGLShader.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}
