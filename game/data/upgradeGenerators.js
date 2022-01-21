import { effectNameEnum as effect } from "./upgradeEffects.js";
import UpgradeGenerator from "../../class/UpgradeGenerator.js";

import Decimal from "../../lib/decimal.min.js";
import factroial from "../../util/factroial.js";

export const upgradeGeneratorEnum = {
  "Gold Mine": 0,
  "Gold Duplicator": 1,
  "Growth Boost": 2,
  "Decay Boost": 3,
  "Sacrifice": 4,
  "Prestige Gain": 6,
  "Autobuy": 30,
  "Extra Module": 31,
};
/**
 * @typedef {keyof typeof upgradeGeneratorEnum} UpgradeGeneratorType 
 */

const upgradeGenerators = [
  new UpgradeGenerator({
    name: "Gold Mine",
    index: upgradeGeneratorEnum["Gold Mine"],
    color: "#d4d41e",
    effects: {
      [effect.goldGain]: (tier, level, savedata) => Decimal(level+1).pow(1+tier/10)
    },
    cost: (tier, level, savedata) => Decimal(level+5).pow(3+Math.max(0, level/20-tier)).div(tier+1).div(5)
  }),
  new UpgradeGenerator({
    name: "Gold Duplicator",
    index: upgradeGeneratorEnum["Gold Duplicator"],
    color: "#d1d194",
    effects: {
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(2+tier/2+level/10)
    },
    cost: (tier, level, savedata) => factroial(level).mul(Decimal((100+level*10)/(tier/3+1)).pow(level+1))
  }),
  new UpgradeGenerator({
    name: "Growth Boost",
    index: upgradeGeneratorEnum["Growth Boost"],
    color: "#72e8a7",
    effects: {
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(savedata.prestigeTime/1000/(20+level*10)).pow(0.5+tier/20).mul(1+level/2).add(1)
    },
    cost: (tier, level, savedata) => Decimal(1e10).pow(level+1).mul(Decimal(savedata.prestigeTime/1000).pow(1/(tier+1)).add(1))
  }),
  new UpgradeGenerator({
    name: "Decay Boost",
    index: upgradeGeneratorEnum["Decay Boost"],
    color: "#bd72e8",
    effects: {
      [effect.goldGainMult]: (tier, level, savedata) => Decimal((level+1)*(tier+1)).div(1+savedata.prestigeTime/1000/(100+level*50)).add(1)
    },
    cost: (tier, level, savedata) => Decimal(1e10).pow(level+1).div(Decimal(savedata.prestigeTime/1000).pow(tier+1).add(1))
  }),
  new UpgradeGenerator({
    name: "Sacrifice",
    index: upgradeGeneratorEnum["Sacrifice"],
    color: "#de3535",
    effects: {
      [effect.goldGain]: (tier, level, savedata) => Decimal(2+level+tier*2).pow(level+tier*2).mul(1e3),
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(1-0.4/(tier/2+1))
    },
    cost: (tier, level, savedata) => Decimal(9).div(tier/6+1).add(1).pow(level**2).mul(1000)
  }),
  new UpgradeGenerator({
    name: "Prestige Gain",
    index: upgradeGeneratorEnum["Prestige Gain"],
    color: "#78d3fa",
    effects: {
      [effect.prestigeGain]: (tier, level, savedata) => Decimal(level+1).pow(2+tier/6+level/3).floor()
    },
    cost: (tier, level, savedata) => Decimal(10).pow(level*(1+level/20)+3).div(Decimal(6).pow(tier))
  }),
  new UpgradeGenerator({
    name: "Autobuy",
    index: upgradeGeneratorEnum["Autobuy"],
    color: "#67f0b2",
    effects: {
      [effect.autobuy]: (tier, level, savedata) => 0.01*(tier/2+1),
    },
    cost: (tier, level, savedata) => Decimal.max(1, Decimal(2*(level-tier))).pow(level).mul(1000).div(Decimal(2).pow(tier-level))
  }),
  new UpgradeGenerator({
    name: "Extra Module",
    index: upgradeGeneratorEnum["Extra Module"],
    color: "#67f0db",
    effects: {
      [effect.maxModule]: (tier, level, savedata) => 0.1*Math.sqrt(tier),
    },
    cost: (tier, level, savedata) => Decimal.max(1, 10/(tier/10+1)).pow(Decimal(2).pow(level))
  }),
];

export default upgradeGenerators;
