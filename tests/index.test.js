import { expect } from "chai";
import * as api from "../index.js";

describe("basic tests", () => {
  it("should pass", () => {
    expect(true).to.be.true;
  });
});

describe("get raid challenges", () => {
  Object.entries(api.RAID_IDS).forEach(([raidName, raidId]) => {
    it(`should get ${raidName} challenge`, async () => {
      const client = api.makeClient(process.env.BUNGIE_API_KEY);
      const name = await api.getRaidChallengeName(client, raidId);
      expect(api.CHALLENGE_NAMES[raidName]).to.contain(name);
    });
  });
});

describe("get active lost sector", () => {
  it("should get active lost sector", async () => {
    const client = api.makeClient(process.env.BUNGIE_API_KEY);
    const name = await api.getActiveLostSector(client);
    expect(name).to.equal("Lost Sector");
  });
});
