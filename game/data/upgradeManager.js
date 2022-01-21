import UpgradeManager from "../../class/UpgradeManager.js";
import upgradeEffects from "./upgradeEffects.js";
import upgradeGenerators from "./upgradeGenerators.js";

const upgradeManager = new UpgradeManager(upgradeEffects, upgradeGenerators);

export default upgradeManager;
