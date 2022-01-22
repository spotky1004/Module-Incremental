import upgradeManager from "./upgradeManager.js";
import { savedata } from "./player.js";

const { rawEffects, effects } = upgradeManager.getUpgradeEffects(savedata);

function updateEffects() {
  const tmpEffects = upgradeManager.getUpgradeEffects(savedata);
  for (const effectName in tmpEffects.effects) {
    effects[effectName] = tmpEffects.effects[effectName];
  }
  for (const effectName in tmpEffects.rawEffects) {
    rawEffects[effectName] = tmpEffects.rawEffects[effectName];
  }
}

export { effects, rawEffects, updateEffects };
