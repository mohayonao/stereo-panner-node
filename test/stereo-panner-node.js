"use strict";

var assert = require("assert");
var StereoPannerNode = require("../");

describe("StereoPannerNode", function() {
  describe("constructor", function() {
    it("(audioContext: global.AudioContext)", function() {
      var audioContext = new global.AudioContext();
      var node = new StereoPannerNode(audioContext);

      assert(node instanceof global.AudioNode);
    });
  });
  describe("pan", function() {
    it("get: AudioParam", function() {
      var audioContext = new global.AudioContext();
      var node = new StereoPannerNode(audioContext);

      assert(node.pan instanceof global.AudioParam);
    });
  });
  describe("connect", function() {
    it("(destination: AudioNode|AudioParam): void", function() {
      var audioContext = new global.AudioContext();
      var node = new StereoPannerNode(audioContext);

      assert(typeof node.connect === "function");
    });
  });
  describe("disconnect", function() {
    it("(): void", function() {
      var audioContext = new global.AudioContext();
      var node = new StereoPannerNode(audioContext);

      assert(typeof node.disconnect === "function");
    });
  });
  describe("works", function() {
    it("connect", function() {
      var audioContext = new global.AudioContext();
      var osc = audioContext.createOscillator();
      var node = new StereoPannerNode(audioContext);

      osc.connect(node);
      node.connect(audioContext.destination);

      assert.deepEqual(audioContext.toJSON(), {
        name: "AudioDestinationNode",
        inputs: [
          {
            name: "ChannelMergerNode",
            inputs: [
              {
                name: "GainNode",
                gain: {
                  value: 0,
                  inputs: [
                    {
                      name: "WaveShaperNode",
                      oversample: "none",
                      inputs: [
                        {
                          name: "GainNode",
                          gain: {
                            value: 0,
                            inputs: []
                          },
                          inputs: [
                            {
                              name: "AudioBufferSourceNode",
                              buffer: {
                                name: "AudioBuffer",
                                sampleRate: 44100,
                                length: 2,
                                duration: 2 / 44100,
                                numberOfChannels: 1
                              },
                              playbackRate: {
                                value: 1,
                                inputs: []
                              },
                              loop: true,
                              loopStart: 0,
                              loopEnd: 0,
                              inputs: []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                inputs: [
                  {
                    name: "GainNode",
                    gain: {
                      value: 1,
                      inputs: []
                    },
                    inputs: [
                      {
                        name: "OscillatorNode",
                        type: "sine",
                        frequency: {
                          value: 440,
                          inputs: []
                        },
                        detune: {
                          value: 0,
                          inputs: []
                        },
                        inputs: []
                      }
                    ]
                  }
                ]
              },
              {
                name: "GainNode",
                gain: {
                  value: 0,
                  inputs: [
                    {
                      name: "WaveShaperNode",
                      oversample: "none",
                      inputs: [
                        {
                          name: "GainNode",
                          gain: {
                            value: 0,
                            inputs: []
                          },
                          inputs: [
                            {
                              name: "AudioBufferSourceNode",
                              buffer: {
                                name: "AudioBuffer",
                                sampleRate: 44100,
                                length: 2,
                                duration: 2 / 44100,
                                numberOfChannels: 1
                              },
                              playbackRate: {
                                value: 1,
                                inputs: []
                              },
                              loop: true,
                              loopStart: 0,
                              loopEnd: 0,
                              inputs: []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                inputs: [
                  {
                    name: "GainNode",
                    gain: {
                      value: 1,
                      inputs: []
                    },
                    inputs: [
                      {
                        name: "OscillatorNode",
                        type: "sine",
                        frequency: {
                          value: 440,
                          inputs: []
                        },
                        detune: {
                          value: 0,
                          inputs: []
                        },
                        inputs: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
    });
    it("disconnect", function() {
      var audioContext = new global.AudioContext();
      var osc = audioContext.createOscillator();
      var node = new StereoPannerNode(audioContext);

      osc.connect(node);
      node.connect(audioContext.destination);
      node.disconnect();

      assert.deepEqual(audioContext.toJSON(), {
        name: "AudioDestinationNode",
        inputs: []
      });
    });
  });
});
