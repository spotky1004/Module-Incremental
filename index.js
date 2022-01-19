import Decimal from "./lib/decimal.min.js";

import Player from "./class/Player.js";
import upgradeEffects from "./upgradeEffects.js";
import upgradeGenerators from "./upgradeGenerators.js";
const upgradeTypes = upgradeGenerators.map(v => v.name);
import UpgradeManager from "./class/UpgradeManager.js";
const upgradeManager = new UpgradeManager(upgradeEffects, upgradeGenerators);
import elements from "./dom.js";

import notation from "./util/notation.js";

const saveKey = "Module Incremental";
const player = new Player();
const savedata = player.savedata;
player.load(saveKey);
for (let i = 0; i < upgradeTypes.length; i++) {
  savedata.upgradeTiers[upgradeTypes[i]] ??= 0;
}
player.savedata.selectedUpgrades = [...upgradeTypes];

function buyUpgrade(idx) {
  const upgrade = upgradeList[idx];
  if (savedata.gold.gt(upgrade.cost)) {
    savedata.gold = savedata.gold.sub(upgrade.cost);
    const selectedIdx = savedata.selectedUpgrades.findIndex(upgradeName => upgradeName === upgrade.upgradeName);
    if (selectedIdx === -1) return;
    savedata.boughtUpgrades[selectedIdx].push(upgrade.level);
  }
}
elements.upgrades.forEach((v, i) => {
  v.element.addEventListener("click", () => buyUpgrade(i));
});

let upgradeList = upgradeManager.getUpgradeList(savedata, 10);
let lastTickAt = new Date().getTime();
let lastSaveAt = new Date().getTime();
let lastUpgradeUpdateAt = 0;
function tick() {
  const timeNow = new Date().getTime();
  if (timeNow - lastSaveAt > 5000) {
    player.save(saveKey);
    lastSaveAt = timeNow;
  }
  const dt = timeNow - lastTickAt;
  savedata.time += dt;
  savedata.prestigeTime += dt;
  lastTickAt = timeNow;

  // Update "upgrade-modules" & "upgrade-list"
  if (timeNow - lastUpgradeUpdateAt > 1000/20) {
    const selectedUpgrades = savedata.selectedUpgrades;
    for (let i = 0; i < elements.upgradeModules.length; i++) {
      const upgrade = upgradeGenerators.find(upgradeGenerator => upgradeGenerator.name === selectedUpgrades[i]);
      const upgradeModuleElement = elements.upgradeModules[i];
      if (typeof upgrade !== "undefined") {
        upgradeModuleElement.innerHTML = upgrade.name + " T" + savedata.upgradeTiers[upgrade.name];
        upgradeModuleElement.style.color = upgrade.color;
      } else {
        upgradeModuleElement.innerHTML = "Empty";
        upgradeModuleElement.style.color = "#fff4";
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

      upgradeElement.name.innerHTML = upgrade.name;
      upgradeElement.name.style.color = upgrade.color;
      upgradeElement.cost.innerHTML = notation(upgrade.cost);
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
        effectElement.name.innerHTML = effectDisplay.name;
        effectElement.name.style.color = effectDisplay.color;
        effectElement.value.innerHTML = effectDisplay.operator + notation(effect.value);
      }
    }
    lastUpgradeUpdateAt = timeNow;
  }

  const effects = upgradeManager.getUpgradeEffects(savedata);
  const goldGain = effects.goldGain.mul(effects.goldGainMult);
  savedata.gold = savedata.gold.add(goldGain.mul(dt/1000));
  elements.gold.innerHTML = notation(savedata.gold);

  requestAnimationFrame(tick);
}

tick();
