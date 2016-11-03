/* global Float32Array */

var BaseAudioContext = require("base-audio-context");
var AudioNode = global.AudioNode;

var WS_CURVE_SIZE = 4096;
var curveL = new Float32Array(WS_CURVE_SIZE);
var curveR = new Float32Array(WS_CURVE_SIZE);
var curveDC = new Float32Array([ 1, 1 ]);

for (var i = 0; i < WS_CURVE_SIZE; i++) {
  curveL[i] = Math.cos((i / WS_CURVE_SIZE) * Math.PI * 0.5);
  curveR[i] = Math.sin((i / WS_CURVE_SIZE) * Math.PI * 0.5);
}

function StereoPannerNode(audioContext) {
  var splitter = audioContext.createChannelSplitter(2);
  var wsDC = audioContext.createWaveShaper();
  var pan = audioContext.createGain();
  var wsL = audioContext.createWaveShaper();
  var wsR = audioContext.createWaveShaper();
  var gainL = audioContext.createGain();
  var gainR = audioContext.createGain();
  var merger = audioContext.createChannelMerger(2);

  splitter.channelCount = 2;
  splitter.channelCountMode = "explicit";
  splitter.channelInterpretation = "speakers";
  splitter.connect(gainL, 0);
  splitter.connect(gainR, 1);
  splitter.connect(wsDC, 1);

  wsDC.channelCount = 1;
  wsDC.channelCountMode = "explicit";
  wsDC.channelInterpretation = "discrete";
  wsDC.curve = curveDC;
  wsDC.connect(pan);

  pan.channelCount = 1;
  pan.ChannelMergerNode = "explicit";
  pan.channelInterpretation = "discrete";
  pan.gain.value = 0;
  pan.connect(wsL);
  pan.connect(wsR);

  wsL.channelCount = 1;
  wsL.channelCountMode = "explicit";
  wsL.channelInterpretation = "discrete";
  wsL.curve = curveL;
  wsL.connect(gainL.gain);

  wsR.channelCount = 1;
  wsR.channelCountMode = "explicit";
  wsR.channelInterpretation = "discrete";
  wsR.curve = curveR;
  wsR.connect(gainR.gain);

  gainL.channelCount = 1;
  gainL.channelCountMode = "explicit";
  gainL.channelInterpretation = "discrete";
  gainL.gain.value = 0;
  gainL.connect(merger, 0, 0);

  gainR.channelCount = 1;
  gainR.channelCountMode = "explicit";
  gainR.channelInterpretation = "discrete";
  gainR.gain.value = 0;
  gainR.connect(merger, 0, 1);

  merger.channelCount = 1;
  merger.channelCountMode = "explicit";
  merger.channelInterpretation = "discrete";

  Object.defineProperties(splitter, {
    pan: {
      value: pan.gain,
      enumerable: true, writable: false, configurable: true
    },
    connect: {
      value: AudioNode.prototype.connect.bind(merger),
      enumerable: false, writable: false, configurable: true
    },
    disconnect: {
      value: AudioNode.prototype.disconnect.bind(merger),
      enumerable: false, writable: false, configurable: true
    }
  });

  return splitter;
}

StereoPannerNode.polyfill = function() {
  if (BaseAudioContext && !BaseAudioContext.prototype.hasOwnProperty("createStereoPanner")) {
    StereoPannerNode.install();
  }
};

StereoPannerNode.install = function() {
  Object.defineProperty(BaseAudioContext.prototype, "createStereoPanner", {
    value: function() {
      return new StereoPannerNode(this);
    },
    enumerable: false, writable: false, configurable: true
  });
};

module.exports = StereoPannerNode;