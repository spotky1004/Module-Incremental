import Decimal from "../lib/decimal.min.js";
import roman from "../util/roman.js";

const UPGRADE_LEVEL_LIMIT = 250;

/**
 * @callback UpgradeEffectFunc
 * @param {number} tier
 * @param {number} level
 * @param {import("./Player.js").SavedataValues} savedata
 * @return {Decimal}
 */
/**
 * @callback UpgradeCostFunc
 * @param {number} tier
 * @param {number} level
 * @param {import("./Player.js").SavedataValues} savedata
 */

/**
 * @typedef UpgradeChunk
 * @property {string} upgradeName
 * @property {number} level
 * @property {string} name
 * @property {UpgradeGenerator} color
 * @property {import("./UpgradeEffects.js").EffectChunk[]} effect
 * @property {Decimal} cost
 */

class UpgradeGenerator {
  /**
   * @typedef UpgradeParams
   * @property {string} name
   * @property {string} color
   * @property {Object<string, UpgradeEffectFunc>} effects
   * @property {UpgradeCostFunc} cost
   */
  /**
   * @param {UpgradeParams} options 
   */
  constructor(options) {
    this.name = options.name;
    this.color = options.color;
    this.effects = options.effects;
    this.cost = options.cost;
  }

  /**
   * @param {number} tier 
   * @param {number[]} levelToOmit 
   * @param {import("./Player.js").SavedataValues} savedata
   * @param {number} count 
   */
  getUpgrades(tier, levelToOmit=[], savedata, count=10) {
    /** @type {UpgradeChunk[]} */
    const upgradeChunks = [];
    let level = -1;
    while (upgradeChunks.length < count) {
      level++;
      if (level >= UPGRADE_LEVEL_LIMIT) break;
      if (levelToOmit.includes(level)) continue;
      upgradeChunks.push({
        upgradeName: this.name,
        level,
        name: this.name + " " + roman(level+1),
        color: this.color,
        effect: this.getUpgradeEffect(tier, level, savedata),
        cost: Decimal(this.cost(tier, level, savedata))
      });
    }
    return upgradeChunks;
  }

  /**
   * @param {number} tier 
   * @param {number} level 
   * @param {import("./Player.js").SavedataValues} savedata
   */
  getUpgradeEffect(tier, level, savedata) {
    /** @type {import("./UpgradeEffects.js").EffectChunk[]} */
    const effects = [];
    for (const effectName in this.effects) {
      const effectFunc = this.effects[effectName];
      effects.push({
        name: effectName,
        value: Decimal(effectFunc(tier, level, savedata))
      });
    }
    return effects;
  }
}

export default UpgradeGenerator;
