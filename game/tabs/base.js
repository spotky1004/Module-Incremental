import upgradeGenerators from "../upgradeGenerators.js";
import upgradeEffects from "../upgradeEffects.js";
import upgradeManager from "../upgradeManager.js";

import elements from "../elements.js";
import { savedata } from "../player.js";

import notation from "../../util/notation.js";

/**
 * @param {number} idx 
 * @returns {boolean}
 */
function buyUpgrade(idx) {
  const upgrade = upgradeList[idx];
  if (typeof upgrade === "undefined") return false;
  if (savedata.gold.gt(upgrade.cost)) {
    const selectedIdx = savedata.selectedUpgrades.findIndex(upgradeName => upgradeName === upgrade.upgradeName);
    if (savedata.boughtUpgrades[selectedIdx].includes(upgrade.level)) return;
    savedata.gold = savedata.gold.sub(upgrade.cost);
    if (selectedIdx === -1) return;
    savedata.boughtUpgrades[selectedIdx].push(upgrade.level);
    return true;
  }
  return false;
}
elements.upgrades.forEach((v, i) => {
  v.element.addEventListener("click", () => buyUpgrade(i));
});

/** @type {ReturnType<upgradeManager["getUpgradeList"]>} */
let upgradeList = [];
let upgradeListUpdateTime = 0;
/**
 * @param {import("../../class/Player.js").SavedataValues} savedata 
 * @param {number} dt 
 * @param {ReturnType<upgradeManager["getUpgradeEffects"]>} effects
 */
function render(dt, effects) {
  upgradeListUpdateTime += dt;

  if (upgradeListUpdateTime > 1000/20) {
    const selectedUpgrades = savedata.selectedUpgrades;
    for (let i = 0; i < elements.upgradeModules.length; i++) {
      const upgrade = upgradeGenerators.find(upgradeGenerator => upgradeGenerator.name === selectedUpgrades[i]);
      const upgradeModuleElement = elements.upgradeModules[i];
      if (typeof upgrade !== "undefined") {
        upgradeModuleElement.innerText = upgrade.name + " T" + savedata.modules[upgrade.name].tier;
        upgradeModuleElement.style.color = upgrade.color;
      } else {
        if (i >= effects.maxModule.toNumber()) {
          upgradeModuleElement.innerText = "Locked";
          upgradeModuleElement.style.color = "#fff1";
        } else {
          upgradeModuleElement.innerText = "Empty";
          upgradeModuleElement.style.color = "#fff4";
        }
      }
    }

    upgradeList = upgradeManager.getUpgradeList(savedata, 10);
    for (let i = 0; i < elements.upgrades.length; i++) {
      const upgrade = upgradeList[i];
      const upgradeElement = elements.upgrades[i];

      if (typeof upgrade === "undefined") {
        upgradeElement.element.style.display = "none";
        continue;
      }
      upgradeElement.element.style.display = "";

      upgradeElement.name.innerText = upgrade.name;
      upgradeElement.name.style.color = upgrade.color;
      upgradeElement.cost.innerText = notation(upgrade.cost);
      upgradeElement.cost.style.color = savedata.gold.lt(upgrade.cost) ? "#fc8181" : "";
      upgradeElement.cost.style.setProperty("--progress", savedata.gold.div(upgrade.cost).mul(100)+"%")

      for (let j = 0; j < upgradeElement.effects.length; j++) {
        const effect = upgrade.effect[j];
        const effectElement = upgradeElement.effects[j];

        if (typeof effect === "undefined") {
          effectElement.element.style.display = "none";
          continue;
        }
        effectElement.element.style.display = "";

        /** @type {import("./class/UpgradeEffects.js").EffectDisplay} */
        const effectDisplay = upgradeEffects.effectsDatas[effect.name].display;
        effectElement.name.innerText = effectDisplay.name;
        effectElement.name.style.color = effectDisplay.color;
        effectElement.value.innerText = effectDisplay.operator + notation(effect.value);
      }
    }
    upgradeListUpdateTime = new Date().getTime();
  }

  
  let effectElementIdx = 0;
  for (const effectName in effects) {
    /** @type {import("./class/UpgradeEffects.js").EffectData} */
    const effectData = upgradeEffects.effectsDatas[effectName];
    const operator = effectData.display.operator;
    if (effects[effectName].eq(effectData.defaultValue)) {
      elements.effects[effectElementIdx].element.style.display = "none";
    } else {
      elements.effects[effectElementIdx].element.style.display = "";
      elements.effects[effectElementIdx].value.innerText = operator + " " + notation(effects[effectName]);
    }
    effectElementIdx++;
  }
}

/**
 * @param {number} dt 
 */
function update(dt) {
  const effects = upgradeManager.getUpgradeEffects(savedata);

  savedata.selectedUpgrades = [...new Set(savedata.selectedUpgrades)].slice(0, effects.maxModule.toNumber());

  const goldGain = effects.goldGain.mul(effects.goldGainMult);
  savedata.gold = savedata.gold.add(goldGain.mul(dt/1000));
  elements.gold.innerText = notation(savedata.gold);

  savedata.autobuyCharge += effects.autobuy.toNumber() * dt / 1000;
  if (savedata.autobuyCharge > 1) {
    for (let i = Math.min(9, Math.floor(savedata.autobuyCharge-1)); i >= 0; i--) {
      buyUpgrade(i);
    }
    savedata.autobuyCharge %= 1;
  }

  render(dt, effects);
}

export default update;