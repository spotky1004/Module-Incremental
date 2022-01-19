/**
 * @template T
 */
class UpgradeManager {
  /**
   * @param {import("./UpgradeEffects.js").default<T>} upgradeEffects 
   * @param {import("./UpgradeGenerator.js").default[]} upgradeGenerators 
   */
  constructor(upgradeEffects, upgradeGenerators) {
    /** @type {typeof upgradeEffects} */
    this.upgradeEffects = upgradeEffects;
    /** @type {typeof upgradeGenerators} */
    this.upgradeGenerators = [...upgradeGenerators];
  }

  /**
   * @param {import("./Player.js").SavedataValues} savedata 
   * @param {number} count
   */
  getUpgradeList(savedata, count=10) {
    const selectedUpgrades = savedata.selectedUpgrades;
    const boughtUpgrades = savedata.boughtUpgrades;

    /** @type {import("./UpgradeGenerator.js").UpgradeChunk[]} */
    const upgrades = [];
    for (let i = 0; i < selectedUpgrades.length; i++) {
      const upgradeName = selectedUpgrades[i];
      const upgradeGenerator = this.upgradeGenerators.find(upgradeGenerator => upgradeGenerator.name === upgradeName);
      const boughtUpgrade = boughtUpgrades[i];
      if (typeof upgradeGenerator === "undefined") continue;
      upgrades.push(...upgradeGenerator.getUpgrades(0, boughtUpgrade, savedata, count));
    }
    upgrades.sort((a, b) => a.cost.comparedTo(b.cost));
    return upgrades.slice(0, count);
  }

  /**
   * @param {import("./Player.js").SavedataValues} savedata 
   */
  getUpgradeEffects(savedata) {
    const selectedUpgrades = savedata.selectedUpgrades;
    const boughtUpgrades = savedata.boughtUpgrades;

    /** @type {import("./UpgradeEffects.js").EffectChunk[]} */
    const effects = [];
    for (let i = 0; i < selectedUpgrades.length; i++) {
      const upgradeName = selectedUpgrades[i];
      const upgradeGenerator = this.upgradeGenerators.find(upgradeGenerator => upgradeGenerator.name === upgradeName);
      const boughtUpgrade = boughtUpgrades[i];
      if (typeof upgradeGenerator === "undefined") continue;
      for (let j = 0; j < boughtUpgrade.length; j++) {
        const level = boughtUpgrade[j];
        effects.push(...upgradeGenerator.getUpgradeEffect(0, level, savedata));
      }
    }
    
    return this.upgradeEffects.calculateEffect(effects);
  }
}

export default UpgradeManager;