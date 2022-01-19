import Decimal from "../lib/decimal.min.js";
import typeEqualize from "../util/typeEqualize.js";

/**
 * @typedef SavedataValues
 * @property {number} runStartTime
 * @property {number} lastTickAt
 * @property {number} time
 * @property {number} prestigeTime
 * @property {Decimal} gold
 * @property {string[]} selectedUpgrades
 * @property {number[][]} boughtUpgrades
 * @property {Object<string, number>} upgradeTiers
 */

/**
 * @type {SavedataValues}
 */
const savedataDefaults = {
  runStartTime: new Date().getTime(),
  lastTickAt: new Date().getTime(),
  time: 0,
  prestigeTime: 0,
  gold: Decimal(10),
  selectedUpgrades: ["Gold Mine"],
  boughtUpgrades: Array(10).fill().map(_ => []),
  upgradeTiers: {"Gold Mine": 0},
};


class Player {
  constructor() {
    /** @type {SavedataValues} */
    this.savedata = {};
    this.init();
  }

  clearSavedata() {
    for (const key in this.savedata) {
      delete this.savedata[key];
    }
  }

  init() {
    this.clearSavedata();
    this.savedata = typeEqualize(this.savedata, savedataDefaults);
  }

  save(key) {
    localStorage.setItem(key, window.btoa(JSON.stringify(this.savedata)));
  }

  load(key) {
    const data = localStorage.getItem(key);
    this.init();
    if (data === null) return;
    try {
      this.clearSavedata();
      /** @type {SavedataValues} */
      const savedata = JSON.parse(window.atob(data));
      for (const key in savedata) {
        this.savedata[key] = savedata[key];
      }
      const defaults = savedataDefaults;
      this.savedata = typeEqualize(this.savedata, defaults);
    } catch (e) {
      this.init();
    }
  }
}

export default Player;
