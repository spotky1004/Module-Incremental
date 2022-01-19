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
    name: "Gold Duplicator",
    color: "#d1d194",
    effects: {
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(2+tier/2+level/10)
    },
    cost: (tier, level, savedata) => factroial(level*(0.975**tier)).mul(Decimal((1000+level*100)/(tier+1)).pow(level+1))
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
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(Math.sqrt(savedata.prestigeTime/1000/(20+level*10))).mul(1+level/2).mul(1+tier*3).add(1)
    },
    cost: (tier, level, savedata) => Decimal(1e10).pow(level+1).mul(Decimal(savedata.prestigeTime/1000).pow(1/(tier+1)).add(1))
  }),
  new UpgradeGenerator({
    name: "Sacrifice",
    color: "#de3535",
    effects: {
      [effect.goldGain]: (tier, level, savedata) => Decimal(level+1).pow(2+tier/2).mul(100+level*(50+tier*20)).mul(Decimal(2+tier/10).pow(level)),
      [effect.goldGainMult]: (tier, level, savedata) => Decimal(1-0.4/(tier/2+1))
    },
    cost: (tier, level, savedata) => Decimal(1e5).mul(level+1).pow((level+1)**1.5)
  })
];

export default upgradeGenerators;
