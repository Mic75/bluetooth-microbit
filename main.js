import { requestMicrobit, getServices } from './node_modules/microbit-web-bluetooth/dist/microbit.esm.js';
import {infoID, startID} from './constants.js';
import {init as initScene, animate, updateMeshRotation} from "./scene.js";

let info;
let startButton;

function queryDOMElems(){
  info = document.querySelector(`#${infoID}`);
  startButton = document.querySelector(`#${startID}`);
}


function writeInfo(msg) {
  info.innerHTML = `<p>${msg}</p>` + info.innerHTML;
}


function registerAccelerometerEventsHandler(accelerometerService) {
  if (accelerometerService) {
    accelerometerService.addEventListener('accelerometerdatachanged', (event) => {
      // writeInfo(JSON.stringify(event.detail));
      updateMeshRotation(event.detail);
    });
  } else {
    throw Error('Accelerometer Service is undefined');
  }
}

async function pairMicrobit() {
  const device = await requestMicrobit(window.navigator.bluetooth);
  if (device) {
    const services = await getServices(device);
    if (services) {
      writeInfo(`Device <b>${device.name}</b> successfully paired`)
      registerAccelerometerEventsHandler(services.accelerometerService);
    } else {
      throw Error('Failed to get Microbit services');
    }
  } else {
    throw Error('Failed to request microbit');
  }
}

function registerEvents(){
  startButton.addEventListener('click', async () => {
    writeInfo('Pairing device');
    try {
      await pairMicrobit();
    } catch(e) {
      writeInfo(e.message);
    }
  })
}

function init() {
  queryDOMElems();
  registerEvents();

  initScene();
  animate();
}

init();
