import * as THREE from '../three/three.module.js';
import { objectScene, cssScene } from '../main/main.js';
import { CSS3DObject, CSS3DRenderer } from '../three/CSS3DRenderer.js';
import { allCameras, modifyActiveCameraName } from '../main/main.js';

///////////////////////////////////////////////////////////////////
// Creates WebGL Renderer
//
///////////////////////////////////////////////////////////////////
export function createGlRenderer() {
  const glRenderer = new THREE.WebGLRenderer({ alpha: true });

  glRenderer.setClearColor(0xecf8ff);
  glRenderer.setPixelRatio(window.devicePixelRatio);
  glRenderer.setSize(window.innerWidth, window.innerHeight);

  glRenderer.domElement.style.position = "absolute";
  glRenderer.domElement.style.zIndex = 1;
  glRenderer.domElement.style.top = 0;
  // glRenderer.domElement.style.pointerEvents = "none";

  return glRenderer;
}

///////////////////////////////////////////////////////////////////
// Creates CSS Renderer
//
///////////////////////////////////////////////////////////////////
export function createCssRenderer() {
  const cssRenderer = new CSS3DRenderer();

  cssRenderer.setSize(window.innerWidth, window.innerHeight);

  cssRenderer.domElement.style.position = "absolute";
  cssRenderer.domElement.style.zIndex = 1;
  cssRenderer.domElement.style.top = 0;
  // cssRenderer.domElement.style.top = 0;

  return cssRenderer;
}

///////////////////////////////////////////////////////////////////
// Creates plane mesh
//
///////////////////////////////////////////////////////////////////
function createPlane(w, h, s, position, rotation) {
  const material = new THREE.MeshBasicMaterial({
    color: 0x010203,
    opacity: 0.0,
    side: THREE.DoubleSide
  });

  const geometry = new THREE.PlaneGeometry(w, h);

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.x = position.x;
  mesh.position.y = position.y;
  mesh.position.z = position.z;

  mesh.rotation.x = rotation.x;
  mesh.rotation.y = rotation.y;
  mesh.rotation.z = rotation.z;

  mesh.scale.set(s, s, s);

  return mesh;
}




///////////////////////////////////////////////////////////////////
// Creates CSS object
//
///////////////////////////////////////////////////////////////////
function createCssObject(w, h, s, position, rotation, url, html, image) {
  // w *= 100
  // h *= 100
  const timeuuid = String(Date.now())
  if (url) {
    html =
      `<h1 style="text-align: center;">` +
      `<image src="${expandArrowsPng}" alt="expand arrows"></image>` +
      `<button id="expandButton-${timeuuid}">EXPAND THIS PAGE</button>` +
      `<image src="${expandArrowsPng}" alt="expand arrows"></image>` +
      `</h1>` +
      '<iframe src="' + // When the src is set, this could be a good time to diable the iframe rather than waiting for the onload event...
      url +
      '" width="' +
      w +
      '" height="' +
      h +
      '" allow="autoplay"' +
      // 'onload="disabledIframeClicks(this)">' +
      "</iframe>";
  }
  html = [
    '<div class="css3ddiv" style="width:' + w + "px; height:" + h + 'px; border: 5px solid black;">',
    html,
    "</div>"
  ].join("\n");

  const div = document.createElement("div");

  if (image != undefined){
    const divImage = document.createElement("div");
    divImage.style.pointerEvents = "auto";
    divImage.className = "divImage";

    const imagePlaceholder = `
      <h1 style="text-align: center;"><button>LOAD THIS URL: ${url}</button></h1>
      <img src="${image}" alt="Iframe Placeholder" style="width: 100%; height: 100%;">
    `
    $(div).append(divImage);
    $(divImage).append(imagePlaceholder);
    $(divImage).on( "click", function() {
      $(div).html(html);
      $('iframe').css('pointer-events', 'auto');
      let active = false;
      $(`#expandButton-${timeuuid}`).on("click", function(){
        if (active){
          modifyActiveCameraName("third person player");
          $(`#expandButton-${timeuuid}`).html("EXPAND THIS PAGE");
        }else{
          modifyActiveCameraName(timeuuid);
          $(`#expandButton-${timeuuid}`).html("RETURN TO PLAYER VIEW");
        }
        active = !active
      })
    })
  } else{
    $(div).html(html);
  }
  

  const cssObject = new CSS3DObject(div);

  cssObject.position.x = position.x;
  cssObject.position.y = position.y;
  cssObject.position.z = position.z;

  cssObject.rotation.x = rotation.x;
  cssObject.rotation.y = rotation.y;
  cssObject.rotation.z = rotation.z;

  cssObject.scale.set(s, s, s);

  const camera = new THREE.OrthographicCamera( s*w/-2, s*w/2, s*h/2, s*h/-2, 0, 0.5 );

  camera.position.x = position.x;
  camera.position.y = position.y;
  camera.position.z = position.z;

  camera.rotation.x = rotation.x;
  camera.rotation.y = rotation.y;
  camera.rotation.z = rotation.z;

  allCameras[timeuuid] = camera;

  return cssObject;
}

///////////////////////////////////////////////////////////////////
// Creates 3d webpage object
//
///////////////////////////////////////////////////////////////////
export function create3dPage(w, h, s, position, rotation, url, html, image) {
  // console.log(html)

  const plane = createPlane(w, h, s, position, rotation);

  // Manually call this when you want.
  // console.log(plane);
  objectScene.add(plane);

  const cssObject = createCssObject(w, h, s, position, rotation, url, html, image);

  // console.log(cssObject);
  cssScene.add(cssObject);

  

  return { plane: plane, cssObject: cssObject, scale: s };
}

export const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);