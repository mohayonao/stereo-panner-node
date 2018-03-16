(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.StereoPannerNode = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
/* global Float32Array, Symbol, AudioNode, AudioParam */

var BaseAudioContext = require("base-audio-context");

var WS_CURVE_SIZE = 4096;
var curveL = new Float32Array(WS_CURVE_SIZE);
var curveR = new Float32Array(WS_CURVE_SIZE);
var curveFix = new Float32Array([ 0, 0 ]);
var curveDC = new Float32Array([ 1, 1 ]);

for (var i = 0; i < WS_CURVE_SIZE; i++) {
  curveL[i] = Math.cos((i / WS_CURVE_SIZE) * Math.PI * 0.5);
  curveR[i] = Math.sin((i / WS_CURVE_SIZE) * Math.PI * 0.5);
}

function StereoPannerNode(audioContext, opts) {
  opts = opts || {};

  var splitter = audioContext.createChannelSplitter(2);
  var wsDC = audioContext.createWaveShaper();
  var wsFix = audioContext.createWaveShaper();
  var pan = audioContext.createGain();
  var wsL = audioContext.createWaveShaper();
  var wsR = audioContext.createWaveShaper();
  var gainL = audioContext.createGain();
  var gainR = audioContext.createGain();
  var merger = audioContext.createChannelMerger(2);
  var panValue = typeof opts.pan === "number" ? opts.pan : 0;

  splitter.channelCount = 2;
  splitter.channelCountMode = "explicit";
  splitter.channelInterpretation = "speakers";
  splitter.connect(gainL, 0);
  splitter.connect(gainR, 1);
  splitter.connect(wsDC, 1);
  splitter.connect(wsFix, 1);

  wsDC.channelCount = 1;
  wsDC.channelCountMode = "explicit";
  wsDC.channelInterpretation = "discrete";
  wsDC.curve = curveDC;
  wsDC.connect(pan);

  // GainNode mute sound when gain value is 0.
  // This node avoid to mute of GainNode for pan attribute. (#13)
  wsFix.channelCount = 1;
  wsFix.channelCountMode = "explicit";
  wsFix.channelInterpretation = "discrete";
  wsFix.curve = curveFix;
  wsFix.connect(pan.gain);

  pan.channelCount = 1;
  pan.channelCountMode = "explicit";
  pan.channelInterpretation = "discrete";
  pan.gain.value = panValue;
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
  if (BaseAudioContext && !("createStereoPanner" in BaseAudioContext.prototype)) {
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

if (typeof Symbol === "function" && typeof Symbol.hasInstance === "symbol") {
  Object.defineProperty(StereoPannerNode, Symbol.hasInstance, {
    value: function(value) {
      return value instanceof AudioNode && value.pan instanceof AudioParam;
    }
  });
}

module.exports = StereoPannerNode;

},{"base-audio-context":2}],2:[function(require,module,exports){
(function (global){
var AudioContext = global.AudioContext || global.webkitAudioContext;
var OfflineAudioContext = global.OfflineAudioContext || global.webkitOfflineAudioContext;
var BaseAudioContext = global.BaseAudioContext || (OfflineAudioContext && Object.getPrototypeOf(OfflineAudioContext));

module.exports = (typeof BaseAudioContext === "function" && BaseAudioContext.prototype) ? BaseAudioContext : AudioContext;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});