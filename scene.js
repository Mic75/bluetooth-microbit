import * as THREE from './node_modules/three/build/three.module.js';
import TWEEN from "./node_modules/@tweenjs/tween.js/dist/tween.esm.js";
import {HALF_PI, viewerDimension} from "./constants.js";
import { GLTFLoader } from './gltfloader.js';
import { OrbitControls } from './orbit.js';

var camera, scene, renderer;
let wally;
let rotation = {
  x: 0.0,
  z: 0.0
};

let rotationTarget = {
  x: 0.0,
  z: 0.0
};

let tween = {update(){}};

export function init(container) {

  camera = new THREE.OrthographicCamera( -5, 5, -5, 5, 0.1, 1000 );

  camera.position.z = 10;
  camera.lookAt(0,0,0);
  scene = new THREE.Scene();

  const light = new THREE.AmbientLight(0xb3b3b3);
  scene.add(light);

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.z = -1;
  scene.add( directionalLight );

  const glTfLoader = new GLTFLoader()
  glTfLoader.load( './wally.glb',(gltf) => {
    wally = gltf.scene
    scene.add(wally);
  }, undefined, (error) => {
    console.error(error);
  });

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( viewerDimension, viewerDimension );
  const controls = new OrbitControls( camera, renderer.domElement );
  container.appendChild( renderer.domElement );
  controls.update();
}

export function updateMeshRotation(accelData){
  rotationTarget.z =   (accelData.x * HALF_PI) / 1.024;
  rotationTarget.x = (accelData.y * HALF_PI) / 1.024;
  tween = new TWEEN.Tween(rotation)
    .to(rotationTarget, 200)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      wally.rotation.z = rotation.z;
      wally.rotation.x = rotation.x;
    })
    .start();
}

export function animate(time) {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  tween.update(time);
}
