# StereoPannerNode
[![Build Status](http://img.shields.io/travis/mohayonao/stereo-panner-node.svg?style=flat-square)](https://travis-ci.org/mohayonao/stereo-panner-node)
[![NPM Version](http://img.shields.io/npm/v/stereo-panner-node.svg?style=flat-square)](https://www.npmjs.org/package/node-pico)
[![Bower](https://img.shields.io/bower/v/stereo-panner-node.svg?style=flat-square)](https://github.com/mohayonao/stereo-panner-node)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

## Installation

npm:

```
npm install stereo-panner-node
```

bower:

```
bower install stereo-panner-node
```

downloads:

- [stereo-panner-node.js](https://raw.githubusercontent.com/mohayonao/stereo-panner-node/master/lib/stereo-panner-node.js)

## API
### StereoPannerNode
  - `constructor(audioContext: AudioContext)`

#### Instance Attributes
  - `pan: AudioParam` _readonly_

#### Instance Methods
  - `connect(destination: AudioNode | AudioParam) : void`
  - `disconnect() : void`

## Example

```javascript
var audioContext = new AudioContext();
var audioElement = document.getElementById("audioElement");

var mediaSource = audioContext.createMediaElementSource(audioElement);
var autoPanRate = audioContext.createOscillator();
var stereoPanner = new StereoPannerNode(audioContext);

autoPanRate.frequency.value = 0.05;
autoPanRate.start(audioContext.currentTime);

mediaSource.connect(stereoPanner);
autoPanRate.connect(stereoPanner.pan);

stereoPanner.connect(audioContext.destination);
```

## AudioGraph
```
+-----------------+  +-----------------------+
| GainNode(inlet) |  | BufferSourceNode(dc1) |
| gain: 1         |  | buffer: [ 1, 1 ]      |
+-----------------+  | loop: true            |
  |                  +-----------------------+
  |                    |
  |                  +---------------+
  |                  | GainNode(pan) |
  |                  | gain: 0       |
  |                  +---------------+
  |                    |
  |     +--------------+-----------+
  |     |                          |
  |   +---------------------+    +---------------------+
  |   | WaveShaperNode(wsL) |    | WaveShaperNode(wsR) |
  |   | curve: curveL       |    | curve: curveR       |
  |   +---------------------+    +---------------------+
  |                       |                          |
  +-----+-----------------|--------+                 |
        |                 |        |                 |
      +----------------+  |      +----------------+  |
      | GainNode(outL) |  |      | GainNode(outR) |  |
      | gain: 0      <----+      | gain: 0      <----+
      +----------------+         +----------------+
        |                          |
+------------------------------------------+
| ChannelMergerNode (outlet)               |
+------------------------------------------+
```

## License
MIT
