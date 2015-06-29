var assert = require("power-assert");
var StereoPannerNode = require("../lib/stereo-panner-node");

describe("StereoPannerNode", function() {
  var audioContext;

  beforeEach(function() {
    audioContext = new global.AudioContext();
  });

  describe("constructor", function() {
    it("(audioContext: global.AudioContext)", function() {
      var node = new StereoPannerNode(audioContext);

      assert(node instanceof global.AudioNode);
    });
  });
  describe("#pan", function() {
    it("get: AudioParam", function() {
      var node = new StereoPannerNode(audioContext);

      assert(node.pan instanceof global.AudioParam);
    });
  });
  describe("#connect", function() {
    it("(destination: AudioNode): void", function() {
      var node = new StereoPannerNode(audioContext);
      var sine = audioContext.createOscillator();

      sine.connect(node);
      node.connect(audioContext.destination);

      assert.deepEqual(audioContext.toJSON(), {
        name: "AudioDestinationNode",
        inputs: [
          {
            name: "ChannelMergerNode",
            inputs: [
              [
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
                              inputs: [],
                            },
                            inputs: [
                              {
                                name: "AudioBufferSourceNode",
                                buffer: {
                                  name: "AudioBuffer",
                                  sampleRate: 44100,
                                  length: 2,
                                  duration: 2 / 44100,
                                  numberOfChannels: 1,
                                },
                                playbackRate: {
                                  value: 1,
                                  inputs: [],
                                },
                                loop: true,
                                loopStart: 0,
                                loopEnd: 0,
                                inputs: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  inputs: [
                    {
                      name: "ChannelSplitterNode",
                      inputs: [
                        {
                          name: "OscillatorNode",
                          type: "sine",
                          frequency: {
                            value: 440,
                            inputs: [],
                          },
                          detune: {
                            value: 0,
                            inputs: [],
                          },
                          inputs: [],
                        },
                      ],
                    },
                  ],
                },
              ],
              [
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
                              inputs: [],
                            },
                            inputs: [
                              {
                                name: "AudioBufferSourceNode",
                                buffer: {
                                  name: "AudioBuffer",
                                  sampleRate: 44100,
                                  length: 2,
                                  duration: 2 / 44100,
                                  numberOfChannels: 1,
                                },
                                playbackRate: {
                                  value: 1,
                                  inputs: [],
                                },
                                loop: true,
                                loopStart: 0,
                                loopEnd: 0,
                                inputs: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  inputs: [
                    {
                      name: "ChannelSplitterNode",
                      inputs: [
                        {
                          name: "OscillatorNode",
                          type: "sine",
                          frequency: {
                            value: 440,
                            inputs: [],
                          },
                          detune: {
                            value: 0,
                            inputs: [],
                          },
                          inputs: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            ],
          },
        ],
      });
    });
  });
  describe("disconnect", function() {
    it("(): void", function() {
      var node = new StereoPannerNode(audioContext);
      var sine = audioContext.createOscillator();

      sine.connect(node);
      node.connect(audioContext.destination);
      node.disconnect();

      assert.deepEqual(audioContext.toJSON(), {
        name: "AudioDestinationNode",
        inputs: [],
      });
    });
  });
});
