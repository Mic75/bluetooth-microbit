import * as THREE from './node_modules/three/build/three.module.js';
import {HALF_PI} from "./constants.js";

var camera, scene, renderer;
var geometry, material, mesh;


export function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );

  camera.position.z = 1;
  camera.position.y = 1;
  camera.lookAt(0,0,0);
  scene = new THREE.Scene();

  geometry = new THREE.BoxGeometry( 0.8, 0.05, 0.632 );
  material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

}

export function updateMeshRotation(accelData){
  const sensitivityMax = 0.2;
  const rZ = -(accelData.x * HALF_PI) / 1.024;
  const rX = -(accelData.y * HALF_PI) / 1.024;

  const deltatRz = Math.abs(rZ - mesh.rotation.z);
  const deltatRx = Math.abs(rX - mesh.rotation.x);

  if (deltatRz > sensitivityMax) {
    mesh.rotation.z = rZ;
  }

  if (deltatRx > sensitivityMax) {
    mesh.rotation.x = rX;
  }
}

export function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
