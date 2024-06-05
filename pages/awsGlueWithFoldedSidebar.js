// ==UserScript==
// @name         Fold AWS Glue sidebar
// @namespace    http://tampermonkey.net/
// @version      2024-06-05
// @description  Fold AWS Glue sidebar
// @author       JGB
// @match        https://eu-west-1.console.aws.amazon.com/gluestudio/home*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

function tryFoldSidebar() {
  const parents = document.getElementsByClassName("awsui_drawer_1uo6m_117ru_109");
  const children = document.getElementsByClassName(
    "awsui_drawer-content_1uo6m_117ru_129 "
    + "awsui_drawer-content-clickable_1uo6m_117ru_141 "
    + "awsui_navigation_1fj9k_1uvk8_9"
  );
  if (Array.from(parents).length & Array.from(children).length) {
    // @ts-ignore
    parents[0].style.width = "150px";
    // @ts-ignore
    children[0].style.width = "150px";
    return true;
  } else {
    console.log(parents, children);
  }
  return false;
}

const intervalMs = 500;

(() => {
  'use strict';
  console.log("Awaiting AWS Glue to load for folding sidebar");
  let foldedSidebar = false, k = 1;
  const foldDemon = setInterval(() => {
    console.log(
      "Trying to fold sidebar after",
      (intervalMs * k / 1000).toFixed(1), "s"
    );
    foldedSidebar = tryFoldSidebar();
    if (foldedSidebar) {
      clearInterval(foldDemon);
    }
    k += 1;
  }, intervalMs);
})();