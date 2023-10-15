function replaceThreeChunkFn(a, b) {
return THREE.ShaderChunk[b] + "\n";
}

function shaderParse(glsl) {
// return glsl.replace(/\/\/\s?chunk\(\s?(\w+)\s?\);/g, replaceThreeChunkFn);
return glsl
}

export const vs = shaderParse(`
precision highp float;

//uniform mat4 projectionMatrix;
//uniform mat4 viewMatrix;
//uniform mat4 modelMatrix;
//uniform mat4 modelViewMatrix; //window.camera + mesh/line/point node

//attribute mat4 instanceMatrix;
attribute mat4 instanceUVMatrix;
//attribute vec3 position;
attribute vec4 rgba;
//attribute vec2 uv;
attribute vec2 uvalt;
attribute float isColorPicker;

varying vec4 vPosition;
varying mat4 myModelMatrix;
varying vec3 vWorldPosition;
varying vec4 vuv;
varying vec2 vuvalt;
varying mat4 vuvMatrix;
varying vec4 vrgba;
varying float vIsColorPicker;

void main() {
    vuv = instanceUVMatrix * vec4(uv.xy, 1.0, 1.0);
    vuvalt = uvalt;
    vrgba = rgba;
    vIsColorPicker = isColorPicker;

    vPosition =  instanceMatrix * vec4( position.xyz, 1.0 );
    myModelMatrix = modelMatrix;

    vec4 worldPosition = modelMatrix * vPosition;

    // chunk(shadowmap_vertex);

    vec4 modelViewPosition = modelViewMatrix * vPosition;
    gl_Position = projectionMatrix * modelViewPosition;
}
`);
export const fs = shaderParse(`
precision highp float;

uniform sampler2D texture;
//uniform mat4 viewMatrix;

varying vec4 vuv;
varying vec2 vuvalt;
varying vec4 vPosition;
varying vec4 vrgba;
varying float vIsColorPicker;

void main() {

    vec4 col;
    col = texture2D(texture, vuv.xy );


    gl_FragColor = vrgba;

}
`);
  