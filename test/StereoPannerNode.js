"use strict";

const assert = require("assert");
const StereoPannerNode = require("../lib/StereoPannerNode");

describe("StereoPannerNode", () => {
  let audioContext;

  beforeEach(() => {
    audioContext = new global.AudioContext();
  });

  describe("constructor", () => {
    it("(audioContext: global.AudioContext)", () => {
      const node = new StereoPannerNode(audioContext);

      assert(node instanceof global.AudioNode);
    });
  });
  describe("#pan", () => {
    it("get: AudioParam", () => {
      const node = new StereoPannerNode(audioContext);

      assert(node.pan instanceof global.AudioParam);
    });
  });
});
