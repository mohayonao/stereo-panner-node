(function(global) {
  "use strict";

  var WS_CURVE_SIZE = 4096;
  var curveL = new Float32Array(WS_CURVE_SIZE);
  var curveR = new Float32Array(WS_CURVE_SIZE);

  (function() {
    for (var i = 0; i < WS_CURVE_SIZE; i++) {
      curveL[i] = Math.cos((i / WS_CURVE_SIZE) * Math.PI * 0.5);
      curveR[i] = Math.sin((i / WS_CURVE_SIZE) * Math.PI * 0.5);
    }
  })();

  /**
   *  StereoPannerNode
   *  +-----------------+  +-----------------------+
   *  | GainNode(inlet) |  | BufferSourceNode(dc1) |
   *  | gain: 1         |  | buffer: [ 1, 1 ]      |
   *  +-----------------+  | loop: true            |
   *    |                  +-----------------------+
   *    |                    |
   *    |                  +---------------+
   *    |                  | GainNode(pan) |
   *    |                  | gain: 0       |
   *    |                  +---------------+
   *    |                    |
   *    |     +--------------+----------+
   *    |     |                         |
   *    |   +---------------------+    +---------------------+
   *    |   | WaveShaperNode(wsL) |    | WaveShaperNode(wsR) |
   *    |   | curve: curveL       |    | curve: curveR       |
   *    |   +---------------------+    +---------------------+
   *    |                       |                          |
   *    +-----+-----------------|--------+                 |
   *          |                 |        |                 |
   *        +----------------+  |      +----------------+  |
   *        | GainNode(outL) |  |      | GainNode(outR) |  |
   *        | gain: 0      <----+      | gain: 0      <----+
   *        +----------------+         +----------------+
   *          |                          |
   *  +------------------------------------------+
   *  | ChannelMergerNode (outlet)               |
   *  +------------------------------------------+
   */
  function StereoPanner(audioContext) {
    var inlet = audioContext.createGain();
    var pan = audioContext.createGain();
    var connected = false;

    inlet.channelCount = 1;
    inlet._connect = inlet.connect;
    inlet._disconnect = inlet.disconnect;

    pan.gain.value = 0;

    Object.defineProperties(inlet, {
      pan: {
        value: pan.gain,
        enumerable: true
      },
      connect: {
        value: function(node) {
          if (!connected) {
            connect(inlet, pan);
            connected = true;
          }
          inlet._outlet.connect(node);
        }
      },
      disconnect: {
        value: function() {
          if (connected) {
            disconnect(inlet, pan);
            connected = false;
          }
        }
      }
    });

    return inlet;
  }

  function connect(inlet, pan) {
    var audioContext = inlet.context;

    inlet._dc1buffer = audioContext.createBuffer(1, 2, audioContext.sampleRate);
    inlet._dc1buffer.getChannelData(0).set([ 1, 1 ]);

    inlet._dc1 = audioContext.createBufferSource();
    inlet._dc1.buffer = inlet._dc1buffer;
    inlet._dc1.loop = true;
    inlet._dc1.start(audioContext.currentTime);
    inlet._dc1.connect(pan);

    inlet._wsL = audioContext.createWaveShaper();
    inlet._wsL.curve = curveL;
    pan.connect(inlet._wsL);

    inlet._wsR = audioContext.createWaveShaper();
    inlet._wsR.curve = curveR;
    pan.connect(inlet._wsR);

    inlet._outL = audioContext.createGain();
    inlet._outL.channelCount = 1;
    inlet._outL.channelCountMode = "explicit";
    inlet._outL.gain.value = 0;
    inlet._connect(inlet._outL);

    inlet._outR = audioContext.createGain();
    inlet._outR.channelCount = 1;
    inlet._outR.channelCountMode = "explicit";
    inlet._outR.gain.value = 0;
    inlet._connect(inlet._outR);

    inlet._wsL.connect(inlet._outL.gain);
    inlet._wsR.connect(inlet._outR.gain);

    inlet._outlet = audioContext.createChannelMerger(2);
    inlet._outL.connect(inlet._outlet, 0, 0);
    inlet._outR.connect(inlet._outlet, 0, 1);
  }

  function disconnect(inlet, pan) {
    var audioContext = inlet.context;

    inlet._dc1.stop(audioContext.currentTime);
    inlet._dc1.disconnect();
    pan.disconnect();
    inlet._disconnect();
    inlet._wsL.disconnect();
    inlet._wsR.disconnect();
    inlet._outL.disconnect();
    inlet._outR.disconnect();
    inlet._outlet.disconnect();

    inlet._dc1buffer = null;
    inlet._dc1 = null;
    inlet._wsL = null;
    inlet._wsR = null;
    inlet._outL = null;
    inlet._outR = null;
    inlet._outlet = null;
  }

  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = StereoPanner;
  } else {
    global.StereoPanner = StereoPanner;
  }

})(this.window || this.self || this.global);
