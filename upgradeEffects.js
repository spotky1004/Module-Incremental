import UpgradeEffects from "./class/UpgradeEffects.js";

const upgradeEffects = new UpgradeEffects({
  goldGain: {
    defaultValue: 1,
    effectReducerFunc: (a, b) => a.add(b),
    display: {
      name: "Gold Gain",
      color: "#f0e52b",
      operator: "+"
    }
  },
  goldGainMult: {
    defaultValue: 1,
    effectReducerFunc: (a, b) => a.mul(b),
    display: {
      name: "Gold Mult",
      color: "#ebe7a4",
      operator: "×"
    }
  }
});

export default upgradeEffects;
export const effectNameEnum = upgradeEffects.getEffectNameEnum();
