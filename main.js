import { requestMicrobit, getServices } from './lib/microbit.esm.js';
import {infoID, startID, viewerID, pairingFeedbackID, errorMessageID} from './constants.js';
import {init as initScene, animate, updateMeshRotation} from "./scene.js";

let info;
let startButton;
let viewer;
let pairingFeedback;
let errorMessage;

function queryDOMElems(){
  info = document.querySelector(`#${infoID}`);
  startButton = document.querySelector(`#${startID}`);
  viewer = document.querySelector(`#${viewerID}`);
  pairingFeedback = document.querySelector(`#${pairingFeedbackID}`)
  errorMessage = document.querySelector(`#${errorMessageID}`)
}


function writeError(msg = '') {
  errorMessage.innerHTML = msg !== '' ? `<p>Something went wrong: ${msg}</p>`: '';
}

function writeInfo(msg=''){
  info.innerHTML = msg;
}

function clearError(){
  writeError();
}


function registerAccelerometerEventsHandler(accelerometerService) {
  if (accelerometerService) {
    accelerometerService.addEventListener('accelerometerdatachanged', (event) => {
      updateMeshRotation(event.detail);
    });
  } else {
    throw Error('Accelerometer Service is undefined');
  }
}

async function pairMicrobit() {
  const device = await requestMicrobit(window.navigator.bluetooth);
  showPairingAnimation(true);
  if (device) {
    const services = await getServices(device);
    showPairingAnimation(false);
    if (services) {
      const msg = `<p>Device <b>${device.name}</b> successfully paired!</p>` +
        `<p>Wait for Wally and move you microbit along</p>`;

      writeInfo(msg);
      registerAccelerometerEventsHandler(services.accelerometerService);
    } else {
      throw Error('Failed to get Microbit services');
    }
  } else {
    throw Error('Failed to request microbit');
  }
}

function hideStartButton(){
  startButton.style.display = 'none';
}

function showPairingAnimation(visible){
  pairingFeedback.style.display = visible ? 'block': 'none';
}

function showRetryButton(){
  startButton.innerText = 'Retry';
  startButton.style.display = 'inline-block';
}

function registerEvents(){
  startButton.addEventListener('click', async () => {
    hideStartButton();
    clearError();
    try {
      await pairMicrobit();
      initThreeJS();
    } catch(e) {
      showPairingAnimation(false);
      showRetryButton();
      writeError(e.message);
    }
  })
}

function initThreeJS(){
  initScene(viewer);
  animate();
}

function init() {
  queryDOMElems();
  registerEvents();
}

init();
