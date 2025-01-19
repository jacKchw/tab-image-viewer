chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "updateImgUrl" || !msg.value) return;
  let url = new URL(msg.value);
  if (url.host === "pbs.twimg.com") {
    url = new URL(url.origin + url.pathname + "?format=jpg&name=large");
  }

  document.getElementById("image").src = url;
});
