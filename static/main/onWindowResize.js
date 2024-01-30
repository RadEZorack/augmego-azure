import { cssRenderer } from "../main/webpage3d.js";
import { renderer, rendererBackground, allCameras, activeCameraName } from "../main/main.js";
import { controlsOnWindowResize } from "../main/controls.js";

function onWindowResize(event) {
  allCameras[activeCameraName].aspect = window.innerWidth / window.innerHeight;
  allCameras[activeCameraName].updateProjectionMatrix();

  cssRenderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
  rendererBackground.setSize(window.innerWidth, window.innerHeight);

  controlsOnWindowResize();
}

window.addEventListener( 'resize', onWindowResize, false );