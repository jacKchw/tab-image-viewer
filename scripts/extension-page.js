chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "updateImgUrl" || !msg.value) return;

  document.getElementById("image").src = msg.value;
});
