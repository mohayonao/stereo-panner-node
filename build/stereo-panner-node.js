!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.StereoPannerNode=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
 *  +-------------------------------+  +-----------------------+
 *  | ChannelSplitter(inlet)        |  | BufferSourceNode(dc1) |
 *  +-------------------------------+  | buffer: [ 1, 1 ]      |
 *    |                           |    | loop: true            |
 *    |                           |    +-----------------------+
 *    |                           |                |
 *    |                           |  +---------------+
 *    |                           |  | GainNode(pan) |
 *    |                           |  | gain: 0       |
 *    |                           |  +---------------+
 *    |                           |    |
 *    |    +----------------------|----+
 *    |    |                      |    |
 *    |  +---------------------+  |  +---------------------+
 *    |  | WaveShaperNode(wsL) |  |  | WaveShaperNode(wsR) |
 *    |  | curve: curveL       |  |  | curve: curveR       |
 *    |  +---------------------+  |  +---------------------+
 *    |                 |         |                 |
 *    |                 |         |                 |
 *    |                 |         |                 |
 *  +----------------+  |       +----------------+  |
 *  | GainNode(outL) |  |       | GainNode(outR) |  |
 *  | gain: 0      <----+       | gain: 0      <----+
 *  +----------------+          +----------------+
 *    |                           |
 *  +-------------------------------+
 *  | ChannelMergerNode(outlet)     |
 *  +-------------------------------+
 */
function StereoPanner(audioContext) {
  var _this = {};

  _this.audioContext = audioContext;
  _this.inlet = audioContext.createChannelSplitter(2);
  _this.pan = audioContext.createGain();
  _this.connected = false;

  _this.connect = _this.inlet.connect.bind(_this.inlet);
  _this.disconnect = _this.inlet.disconnect.bind(_this.inlet);

  _this.pan.gain.value = 0;

  Object.defineProperties(_this.inlet, {
    pan: {
      value: _this.pan.gain,
      enumerable: true
    },
    connect: {
      value: function(node) {
        if (!_this.connected) {
          connect(_this);
          _this.connected = true;
        }
        _this.outlet.connect(node);
      }
    },
    disconnect: {
      value: function() {
        if (_this.connected) {
          disconnect(_this);
          _this.connected = false;
        }
      }
    }
  });

  return _this.inlet;
}

function connect(_this) {
  var audioContext = _this.audioContext;

  _this.dc1buffer = audioContext.createBuffer(1, 2, audioContext.sampleRate);
  _this.dc1buffer.getChannelData(0).set([ 1, 1 ]);

  _this.dc1 = audioContext.createBufferSource();
  _this.dc1.buffer = _this.dc1buffer;
  _this.dc1.loop = true;
  _this.dc1.start(audioContext.currentTime);
  _this.dc1.connect(_this.pan);

  _this.wsL = audioContext.createWaveShaper();
  _this.wsL.curve = curveL;
  _this.pan.connect(_this.wsL);

  _this.wsR = audioContext.createWaveShaper();
  _this.wsR.curve = curveR;
  _this.pan.connect(_this.wsR);

  _this.outL = audioContext.createGain();
  _this.outL.gain.value = 0;
  _this.connect(_this.outL, 0);

  _this.outR = audioContext.createGain();
  _this.outR.gain.value = 0;
  _this.connect(_this.outR, 1);

  _this.wsL.connect(_this.outL.gain);
  _this.wsR.connect(_this.outR.gain);

  _this.outlet = audioContext.createChannelMerger(2);
  _this.outL.connect(_this.outlet, 0, 0);
  _this.outR.connect(_this.outlet, 0, 1);
}

function disconnect(_this) {
  var audioContext = _this.audioContext;

  _this.dc1.stop(audioContext.currentTime);
  _this.dc1.disconnect();
  _this.pan.disconnect();
  _this.disconnect.call(_this.inlet);
  _this.wsL.disconnect();
  _this.wsR.disconnect();
  _this.outL.disconnect();
  _this.outR.disconnect();
  _this.outlet.disconnect();

  _this.dc1buffer = null;
  _this.dc1 = null;
  _this.wsL = null;
  _this.wsR = null;
  _this.outL = null;
  _this.outR = null;
  _this.outlet = null;
}

module.exports = StereoPanner;

},{}]},{},[1])(1)
});