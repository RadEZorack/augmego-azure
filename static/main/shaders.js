function replaceThreeChunkFn(a, b) {
return THREE.ShaderChunk[b] + "\n";
}

function shaderParse(glsl) {
// return glsl.replace(/\/\/\s?chunk\(\s?(\w+)\s?\);/g, replaceThreeChunkFn);
return glsl
}

export const vs = shaderParse(`
precision highp float;

attribute vec4 rgba;

varying vec4 vPosition;
varying vec4 vrgba;

void main() {
    vrgba = rgba;

    vPosition =  instanceMatrix * vec4( position.xyz, 1.0 );
    vec4 modelViewPosition = modelViewMatrix * vPosition;
    gl_Position = projectionMatrix * modelViewPosition;
}
`);

export const fs = shaderParse(`
precision highp float;

varying vec4 vrgba;

void main() {
    gl_FragColor = vrgba;

}
`);
  