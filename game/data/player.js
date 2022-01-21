import Player from "../../class/Player.js";
import { upgradeGeneratorEnum } from "./upgradeGenerators.js";
import Decimal from "../../lib/decimal.min.js";

const saveKey = "Module Incremental";
const player = new Player();
const savedata = player.savedata;
// player.load(saveKey);

// savedaats fix
for (const upgradeName in upgradeGeneratorEnum) {
  if (typeof savedata.modules[upgradeName] !== "undefined") continue;
  savedata.modules[upgradeName] = {
    tier: -1,
    exp: new Decimal(0)
  };
}
player.save(saveKey);

export default player;
export { savedata, saveKey };
