import * as THREE from './node_modules/three/build/three.module.js';
import TWEEN from "./node_modules/@tweenjs/tween.js/dist/tween.esm.js";
import {HALF_PI} from "./constants.js";

var camera, scene, renderer;
var geometry, material, mesh;
let rotation = {
  x: 0.0,
  z: 0.0
};

let rotationTarget = {
  x: 0.0,
  z: 0.0
};

let tween = {update(){}};

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
  rotationTarget.z =   -(accelData.x * HALF_PI) / 1.024;
  rotationTarget.x = (accelData.y * HALF_PI) / 1.024;
  tween = new TWEEN.Tween(rotation)
    .to(rotationTarget, 200)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      mesh.rotation.z = rotation.z;
      mesh.rotation.x = rotation.x;
    })
    .start();
}

export function animate(time) {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  tween.update(time);
}
