import { effectNameEnum as effect } from "./upgradeEffects.js";
import UpgradeGenerator from "./class/UpgradeGenerator.js";

import Decimal from "./lib/decimal.min.js";
import factroial from "./util/factroial.js";

const upgradeGenerators = [
  new UpgradeGenerator({
    name: "Gold Mine",
    color: "#d4d41e",
    effects: {
      [effect.goldGain]: (tier, level, savedata) => Decimal(level+1).pow(1+tier/10)
    },
    cost: (tier, level, savedata) => Decimal(level+5).pow(3+Math.max(0, level/20-tier)).div(tier+1).div(5)
  }),
  new UpgradeGenerator({
    name: "Prestige Gain",
    color: "#78d3fa",
    effects: {
      [effect.prestigeGain]: (tier, level, savedata) => Decimal(level+1).pow(2+tier/3+level/6).floor()
    },
    cost: (tier, level, savedata) => Decimal(10).pow(level*(1+level/10)+4).div(Decimal(6).pow(tier))
  }),
  new UpgradeGenerator({
    name: "Gold Duplicator",
    color: "#d1d194",
    effects: {
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(2+tier/2+level/10)
    },
    cost: (tier, level, savedata) => factroial(level).mul(Decimal((1000+level*100)/(tier+1)).pow(level+1))
  }),
  new UpgradeGenerator({
    name: "Decay Boost",
    color: "#bd72e8",
    effects: {
      [effect.goldGainMult]: (tier, level, savedata) => Decimal((level+1)*(tier+1)).div(1+savedata.prestigeTime/1000/(100+level*50)).add(1)
    },
    cost: (tier, level, savedata) => Decimal(1e10).pow(level+1).div(Decimal(savedata.prestigeTime/1000).pow(tier+1).add(1))
  }),
  new UpgradeGenerator({
    name: "Growth Boost",
    color: "#72e8a7",
    effects: {
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(savedata.prestigeTime/1000/(20+level*10)).pow(0.5+tier/20).mul(1+level/2).add(1)
    },
    cost: (tier, level, savedata) => Decimal(1e10).pow(level+1).mul(Decimal(savedata.prestigeTime/1000).pow(1/(tier+1)).add(1))
  }),
  new UpgradeGenerator({
    name: "Autobuy",
    color: "#67f0b2",
    effects: {
      [effect.autobuy]: (tier, level, savedata) => 0.01*(tier/2+1),
    },
    cost: (tier, level, savedata) => Decimal.max(1, Decimal(2*(level-tier))).pow(level).mul(1000).div(Decimal(2).pow(tier-level))
  }),
  new UpgradeGenerator({
    name: "Sacrifice",
    color: "#de3535",
    effects: {
      [effect.goldGain]: (tier, level, savedata) => Decimal(level+1).pow(2+tier/2).mul(100+level*(50+tier*20)).mul(Decimal(2+tier/10).pow(level)),
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(1-0.4/(tier/2+1))
    },
    cost: (tier, level, savedata) => Decimal(9).div(tier/6+1).add(1).pow(level**2).mul(1000)
  })
];

export default upgradeGenerators;
