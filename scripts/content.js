let currentSrc = "";

document.addEventListener("mouseover", (event) => {
  let target = event.target.closest("img");
  if (target && currentSrc !== target.currentSrc) {
    currentSrc = target.currentSrc;
    chrome.runtime.sendMessage({
      type: "updateImgUrl",
      value: currentSrc,
    });
  }
});
