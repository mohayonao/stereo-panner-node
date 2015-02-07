"use strict";

var StereoPannerImpl = require("./stereo-panner-impl");

function StereoPanner(audioContext) {
  var impl = new StereoPannerImpl(audioContext);

  Object.defineProperties(impl.inlet, {
    pan: {
      value: impl.pan,
      enumerable: true
    },
    connect: {
      value: function(node) {
        return impl.connect(node);
      }
    },
    disconnect: {
      value: function() {
        return impl.disconnect();
      }
    }
  });

  return impl.inlet;
}

module.exports = StereoPanner;
