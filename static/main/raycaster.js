import * as THREE from '../three/three.module.js';
import { objectScene, camera } from '../main/main.js';

const clickPosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

export function selectedObject(e, preview = false) {
  // Center around 0, with a range from -0.5 <> 0.5
  clickPosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  clickPosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // console.log(clickPosition);
  raycaster.setFromCamera(clickPosition, camera);
  // console.log(Array.from(objectScene.children));
  // console.log(raycaster);
  const intersects = raycaster.intersectObjects(
    Array.from(objectScene.children),
    true
  ); //array
  // console.log("intersects", intersects);
  if (intersects.length > 0) {
    const selectedObject = intersects[0];
    // console.log("selectedObject", selectedObject);
    // const position = selectedObject.point;
    return selectedObject;
  }
}
