"use strict";

var assert = require("power-assert");
var StereoPannerImpl = require("../lib/stereo-panner-impl");

describe("StereoPannerImpl", function() {
  var audioContext;

  beforeEach(function() {
    audioContext = new global.AudioContext();
  });

  describe("constructor", function() {
    it("(audioContext: AudioContext)", function() {
      var impl = new StereoPannerImpl(audioContext);

      assert(impl instanceof StereoPannerImpl);
      assert(impl.inlet instanceof global.ChannelSplitterNode);
      assert(impl.outlet instanceof global.ChannelMergerNode);
      assert(impl.pan instanceof global.AudioParam);

      assert.deepEqual(impl.outlet.toJSON(), {
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
                      inputs: []
                    }
                  ]
                }
              ]
            },
            inputs: [
              {
                name: "ChannelSplitterNode",
                inputs: []
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
                      inputs: []
                    }
                  ]
                }
              ]
            },
            inputs: [
              {
                name: "ChannelSplitterNode",
                inputs: []
              }
            ]
          }
        ]
      });
    });
  });
  describe("#connect", function() {
    it("(destination: AudioNode): void", function() {
      var impl = new StereoPannerImpl(audioContext);

      impl.connect(audioContext.destination);

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
                    name: "ChannelSplitterNode",
                    inputs: []
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
                    name: "ChannelSplitterNode",
                    inputs: []
                  }
                ]
              }
            ]
          }
        ]
      });
    });
  });
  describe("#disconnect", function() {
    it("(): void", function() {
      var impl = new StereoPannerImpl(audioContext);

      impl.connect(audioContext.destination);
      impl.disconnect();

      assert.deepEqual(audioContext.toJSON(), {
        name: "AudioDestinationNode",
        inputs: []
      });
    });
  });
});
