import Resources from './resources';

let isSuported = !!(window.AudioContext || window.webkitAudioContext);

let context;
let source, destination;
let compressor;

let Buffers = {};



if(isSuported) {
  context = new (window.AudioContext || window.webkitAudioContext)();
  compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -50.0;
  compressor.knee.value = 0.0;
  compressor.ratio.value = 20.0;
  compressor.attack.value = 0.005;
  compressor.release.value = 0.050;
}



function play(name) {
  if(!isSuported) return;

  if(Buffers[name]) {
    source = context.createBufferSource();
    source.buffer = Buffers[name];
    destination = context.destination;
    source.connect(compressor);
    compressor.connect(destination);
    source.start(0);
  } else {
    context.decodeAudioData(
      Resources.get(name),
      decodedArrayBuffer => Buffers[name] = decodedArrayBuffer,
      e => console.log('Error decoding file', e)
    );
  }
}



export default {
  play
}