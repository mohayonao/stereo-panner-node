var StereoPannerNodeImpl = require("./StereoPannerNodeImpl");
var AudioContext = global.AudioContext || global.webkitAudioContext;

function StereoPannerNode(audioContext) {
  var impl = new StereoPannerNodeImpl(audioContext);

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

StereoPannerNode.polyfill = function() {
  if (!AudioContext || AudioContext.prototype.hasOwnProperty("createStereoPanner")) {
    return;
  }
  AudioContext.prototype.createStereoPanner = function() {
    return new StereoPannerNode(this);
  };
};

module.exports = StereoPannerNode;
