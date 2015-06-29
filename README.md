# StereoPannerNode
[![Build Status](http://img.shields.io/travis/mohayonao/stereo-panner-node.svg?style=flat-square)](https://travis-ci.org/mohayonao/stereo-panner-node)
[![NPM Version](http://img.shields.io/npm/v/stereo-panner-node.svg?style=flat-square)](https://www.npmjs.org/package/stereo-panner-node)
[![Bower](http://img.shields.io/bower/v/stereo-panner-node.svg?style=flat-square)](http://bower.io/search/?q=stereo-panner-node)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> StereoPannerNode for legacy Web Audio API

http://webaudio.github.io/web-audio-api/#the-stereopannernode-interface

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

- [stereo-panner-node.js](https://raw.githubusercontent.com/mohayonao/stereo-panner-node/master/build/stereo-panner-node.js)
- [stereo-panner-node.min.js](https://raw.githubusercontent.com/mohayonao/stereo-panner-node/master/build/stereo-panner-node.min.js)

## API
### StereoPannerNode
  - `constructor(audioContext: AudioContext)`

#### Class Methods
  - `polyfill(): void`
    - install `createStereoPanner()` method to AudioContext.prototype if needed.

#### Instance Attributes
  - `pan: AudioParam` _readonly_

#### Instance Methods
  - `connect(destination: AudioNode|AudioParam): void`
  - `disconnect(): void`

## Example
http://mohayonao.github.io/stereo-panner-node/

## AudioGraph
```
+-------------------------------+  +-----------------------+
| ChannelSplitter(inlet)        |  | BufferSourceNode(dc1) |
+-------------------------------+  | buffer: [ 1, 1 ]      |
  |                           |    | loop: true            |
  |                           |    +-----------------------+
  |                           |                |
  |                           |  +---------------+
  |                           |  | GainNode(pan) |
  |                           |  | gain: 0       |
  |                           |  +---------------+
  |                           |    |
  |    +----------------------|----+
  |    |                      |    |
  |  +---------------------+  |  +---------------------+
  |  | WaveShaperNode(wsL) |  |  | WaveShaperNode(wsR) |
  |  | curve: curveL       |  |  | curve: curveR       |
  |  +---------------------+  |  +---------------------+
  |                 |         |                 |
  |                 |         |                 |
  |                 |         |                 |
+----------------+  |       +----------------+  |
| GainNode(outL) |  |       | GainNode(outR) |  |
| gain: 0      <----+       | gain: 0      <----+
+----------------+          +----------------+
  |                           |
+-------------------------------+
| ChannelMergerNode(outlet)     |
+-------------------------------+
```

## License
MIT
