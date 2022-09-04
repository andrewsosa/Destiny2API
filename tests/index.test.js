const { expect } = require("chai");

const api = require("../src/index.js");

describe("get raid challenges", () => {
  Object.entries(api.RAID_IDS).forEach(([raidName, raidId]) => {
    it(`should get ${raidName} challenge`, async () => {
      const client = api.makeClient(process.env.BUNGIE_API_KEY);
      const name = await api.getRaidChallengeName(client, raidId);
      expect(api.CHALLENGE_NAMES[raidName]).to.contain(name);
    });
  });
});
