var StereoPannerImpl = require("./stereo-panner-impl");
var AudioContext = global.AudioContext || global.webkitAudioContext;

function StereoPanner(audioContext) {
  var impl = new StereoPannerImpl(audioContext);

  Object.defineProperties(impl.inlet, {
    pan: {
      value: impl.pan,
      enumerable: true,
    },
    connect: {
      value: function(node) {
        return impl.connect(node);
      },
    },
    disconnect: {
      value: function() {
        return impl.disconnect();
      },
    },
  });

  return impl.inlet;
}

StereoPanner.polyfill = function() {
  if (!AudioContext || AudioContext.prototype.hasOwnProperty("createStereoPanner")) {
    return;
  }
  AudioContext.prototype.createStereoPanner = function() {
    return new StereoPanner(this);
  };
};

module.exports = StereoPanner;
