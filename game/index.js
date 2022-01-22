import * as tabs from "./tabs/index.js";
import {
  elements,
  updateEffects,
  player,
  savedata,
  saveKey
} from "./data/index.js";

const ENV = window.location?.hostname === "127.0.0.1" ? "development" : "production";

/** @param {keyof elements["tabButtons"]} tabToMove */
function moveTab(tabToMove) {
  const tabButtonElement = elements.tabButtons[tabToMove];
  if (typeof tabButtonElement === "undefined") return;
  savedata.watchingTab = tabToMove;
  for (const tabName in elements.tabButtons) {
    elements.tabButtons[tabName].classList.remove("active");
    elements.tabs[tabName].style.display = "none";
  }
  tabButtonElement.classList.add("active");
  elements.tabs[tabToMove].style.display = "";
}
for (const tabName in elements.tabButtons) {
  elements.tabButtons[tabName].addEventListener("click", function() {
    moveTab(this.dataset.tabName);
  });
}
moveTab(savedata.watchingTab);

let lastSaveAt = new Date().getTime();
function tick() {
  const timeNow = new Date().getTime();
  if (timeNow - lastSaveAt > 5000) {
    player.save(saveKey);
    lastSaveAt = timeNow;
  }
  let dt = timeNow - savedata.lastTickAt;
  if (ENV === "development") {
    // savedata.autobuyCharge += 1;
    dt *= 10;
  }
  savedata.time += dt;
  savedata.prestigeTime += dt;
  savedata.lastTickAt = timeNow;

  updateEffects();
  tabs.prestige(dt);
  tabs.modules(dt);
  tabs.base(dt);

  requestAnimationFrame(tick);
}

tick();
