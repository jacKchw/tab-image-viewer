var port = chrome.runtime.connect({ name: "knockknock" });
var currentSrc = "";
document.addEventListener("mouseover", (event) => {
  let target = event.target.closest("img");
  if (target && currentSrc !== target.currentSrc) {
    currentSrc = target.currentSrc;
    console.log(currentSrc);
    port.postMessage({ value: target.currentSrc });
  }
});
