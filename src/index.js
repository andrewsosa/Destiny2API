const axios = require("axios");

const RAID_IDS = {
  DSC: 910380154,
  VOG: 3881495763,
  VOTD: 1441982566,
  KF: 1374392663,
};

const CHALLENGE_NAMES = {
  DSC: [
    "Red Rover", // activityModifierHash:4023623132
    "Copies of Copies", // activityModifierHash:3361897360
    "Of All Trades", // activityModifierHash:201968501
    "The Core Four", // activityModifierHash:191124900
  ],
  VOG: [
    "Wait for It...",
    "The Only Oracle For You",
    "Out Of Its Way",
    "Strangers in Time",
    "Ensemble's Refrain",
  ],
  VOTD: [
    "Swift Destruction",
    "Base Information",
    "Defenses Down",
    "Looping Catalyst",
  ],
  KF: [
    // "", // activityModifierHash:1374392663 no active challenge
    "The Grass Is Always Greener", // activityModifierHash:3577304467
    "Devious Thievery", // activityModifierHash:2159250954
    "Gaze Amaze", // activityModifierHash:2890753840
    "Under Construction", // activityModifierHash:2936050162
    "Hands Off", // activityModifierHash:4152669757
    "Contest Mode", // activityModifierHash:1009404927
  ],
};

function makeClient(apiKey) {
  const client = axios.create({
    baseURL: "https://www.bungie.net/Platform/Destiny2",
    headers: { "X-API-Key": apiKey },
    transformResponse: [(data) => JSON.parse(data).Response],
  });

  return client;
}

async function getRaidChallengeName(client, raidId) {
  // Milestones contain the correct active challenge
  let { data: milestones } = await client.get("/Milestones/");

  // search the milestones to find the right one for the raid ID
  const milestone = Object.values(milestones).find((el) => {
    return el?.activities?.find((act) => act?.activityHash === raidId);
  });

  // raids can have multiple activiites (normal, master), and each activity can have
  // multiple modifiers. find the first one which has a non-empty name, and assume it
  // is correct.
  for (const challengeHash of milestone.activities[0].modifierHashes) {
    let { data: challenge } = await client.get(
      `/Manifest/DestinyActivityModifierDefinition/${challengeHash}/`
    );

    const challengeName = challenge.displayProperties.name;

    if (challengeName) {
      return challengeName;
    }
  }

  return null;
}

module.exports = {
  RAID_IDS,
  CHALLENGE_NAMES,
  makeClient,
  getRaidChallengeName,
};
