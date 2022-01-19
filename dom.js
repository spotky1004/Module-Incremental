import roman from "./util/roman.js";
import notation from "./util/notation.js";
import upgradeEffects from "./upgradeEffects.js";

/**
 * @typedef Effect
 * @property {HTMLDivElement} element
 * @property {HTMLSpanElement} name
 * @property {HTMLSpanElement} value
 */
/**
 * @typedef Upgrade
 * @property {HTMLSpanElement} element
 * @property {HTMLDivElement} name
 * @property {HTMLDivElement} effectList
 * @property {Effect[]} effects
 * @property {HTMLDivElement} cost
 */
const elements = {
  gold: document.getElementById("gold"),
  /** @type {HTMLSpanElement[]} */
  upgradeModules: [],
  /** @type {Upgrade[]} */
  upgrades: [],
  /** @type {Effect[]} */
  effects: [],
};

// upgrade-modules
const upgradeModules = document.getElementById("upgrade-modules");
for (let i = 0; i < 20; i++) {
  const upgradeModule = document.createElement("span");
  elements.upgradeModules.push(upgradeModule);
  upgradeModules.append(upgradeModule);

  upgradeModule.innerHTML = "Module#"+(i+1);
  upgradeModule.classList.add("upgrade-modules__item");
}

// upgrade-list
const upgradeList = document.getElementById("upgrade-list");
for (let i = 0; i < 10; i++) {
  /** @type {Upgrade} */
  const upgrade = {};
  elements.upgrades.push(upgrade);

  // upgrade
  upgrade.element = document.createElement("span");
  upgrade.element.classList.add("upgrade");
  upgradeList.appendChild(upgrade.element);

  // upgrade__name
  upgrade.name = document.createElement("div");
  upgrade.name.innerHTML = "Upgrade " + roman(i+1);
  upgrade.name.classList.add("upgrade__name");
  upgrade.element.appendChild(upgrade.name);

  // upgrade__effect-list
  upgrade.effectList = document.createElement("div");
  upgrade.effectList.classList.add("upgrade__effect-list");
  upgrade.element.appendChild(upgrade.effectList);

  // upgrade__effect-list__item
  upgrade.effects = [];
  for (let j = 0; j < 5; j++) {
    /** @type {Upgrade["effects"][number]} */
    const upgradeEffect = {};
    upgrade.effects.push(upgradeEffect);

    upgradeEffect.element = document.createElement("div");
    upgradeEffect.element.classList.add("upgrade__effect-list__item");
    upgrade.effectList.appendChild(upgradeEffect.element);

    upgradeEffect.name = document.createElement("span");
    upgradeEffect.name.innerHTML = "Boost " + roman(j+1);
    upgradeEffect.name.classList.add("upgrade__effect-list__item__name");
    upgradeEffect.element.appendChild(upgradeEffect.name);

    upgradeEffect.value = document.createElement("span");
    upgradeEffect.value.innerHTML = notation(10**(Math.random()*5+i*5));
    upgradeEffect.value.classList.add("upgrade__effect-list__item__value");
    upgradeEffect.element.appendChild(upgradeEffect.value);
  }

  // upgrade__cost
  upgrade.cost = document.createElement("div");
  upgrade.cost.innerHTML = notation(10**(Math.random()*10+i*10));
  upgrade.cost.classList.add("upgrade__cost");
  upgrade.element.appendChild(upgrade.cost);
}

const effectList = document.getElementById("effect-list");
for (const effectName in upgradeEffects.effectsDatas) {
  /** @type {Effect} */
  const effect = {};
  elements.effects.push(effect);

  /** @type {import("./class/UpgradeEffects.js").EffectData} */
  const effectData = upgradeEffects.effectsDatas[effectName];
  
  effect.element = document.createElement("div");
  effect.element.classList.add("effect-list__item");
  effectList.append(effect.element);
  
  effect.name = document.createElement("span");
  effect.name.classList.add("effect-list__item__name");
  effect.name.innerHTML = effectData.display.name;
  effect.name.style.color = effectData.display.color;
  effect.element.append(effect.name);

  effect.value = document.createElement("span");
  effect.value.classList.add("effect-list__item__value");
  effect.value.innerHTML = effectData.display.operator + " " + notation(effectData.defaultValue);
  effect.element.append(effect.value);
}

export default elements;
