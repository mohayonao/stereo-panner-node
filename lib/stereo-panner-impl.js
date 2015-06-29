var curve = require("./curve");

/**
 *  StereoPannerImpl
 *  +--------------------------------+  +------------------------+
 *  | ChannelSplitter(inlet)         |  | BufferSourceNode(_dc1) |
 *  +--------------------------------+  | buffer: [ 1, 1 ]       |
 *    |                            |    | loop: true             |
 *    |                            |    +------------------------+
 *    |                            |       |
 *    |                            |  +----------------+
 *    |                            |  | GainNode(_pan) |
 *    |                            |  | gain: 0(pan)   |
 *    |                            |  +----------------+
 *    |                            |    |
 *    |    +-----------------------|----+
 *    |    |                       |    |
 *    |  +----------------------+  |  +----------------------+
 *    |  | WaveShaperNode(_wsL) |  |  | WaveShaperNode(_wsR) |
 *    |  | curve: curveL        |  |  | curve: curveR        |
 *    |  +----------------------+  |  +----------------------+
 *    |               |            |               |
 *    |               |            |               |
 *    |               |            |               |
 *  +--------------+  |          +--------------+  |
 *  | GainNode(_L) |  |          | GainNode(_R) |  |
 *  | gain: 0    <----+          | gain: 0    <----+
 *  +--------------+             +--------------+
 *    |                            |
 *  +--------------------------------+
 *  | ChannelMergerNode(outlet)      |
 *  +--------------------------------+
 */
function StereoPannerImpl(audioContext) {
  this.audioContext = audioContext;
  this.inlet = audioContext.createChannelSplitter(2);
  this._pan = audioContext.createGain();
  this.pan = this._pan.gain;
  this._wsL = audioContext.createWaveShaper();
  this._wsR = audioContext.createWaveShaper();
  this._L = audioContext.createGain();
  this._R = audioContext.createGain();
  this.outlet = audioContext.createChannelMerger(2);

  this.inlet.channelCount = 2;
  this.inlet.channelCountMode = "explicit";
  this._pan.gain.value = 0;
  this._wsL.curve = curve.L;
  this._wsR.curve = curve.R;
  this._L.gain.value = 0;
  this._R.gain.value = 0;

  this.inlet.connect(this._L, 0);
  this.inlet.connect(this._R, 1);
  this._L.connect(this.outlet, 0, 0);
  this._R.connect(this.outlet, 0, 1);
  this._pan.connect(this._wsL);
  this._pan.connect(this._wsR);
  this._wsL.connect(this._L.gain);
  this._wsR.connect(this._R.gain);

  this._isConnected = false;
  this._dc1buffer = null;
  this._dc1 = null;
}

StereoPannerImpl.prototype.connect = function(destination) {
  var audioContext = this.audioContext;

  if (!this._isConnected) {
    this._isConnected = true;
    this._dc1buffer = audioContext.createBuffer(1, 2, audioContext.sampleRate);
    this._dc1buffer.getChannelData(0).set([ 1, 1 ]);

    this._dc1 = audioContext.createBufferSource();
    this._dc1.buffer = this._dc1buffer;
    this._dc1.loop = true;
    this._dc1.start(audioContext.currentTime);
    this._dc1.connect(this._pan);
  }

  global.AudioNode.prototype.connect.call(this.outlet, destination);
};

StereoPannerImpl.prototype.disconnect = function() {
  var audioContext = this.audioContext;

  if (this._isConnected) {
    this._isConnected = false;
    this._dc1.stop(audioContext.currentTime);
    this._dc1.disconnect();
    this._dc1 = null;
    this._dc1buffer = null;
  }

  global.AudioNode.prototype.disconnect.call(this.outlet);
};

module.exports = StereoPannerImpl;
