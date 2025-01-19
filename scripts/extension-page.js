chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "knockknock");
  port.onMessage.addListener(function (msg) {
    console.log(msg);
    let url = new URL(msg.value);
    if (url.host === "pbs.twimg.com") {
      url = new URL(url.origin + url.pathname + "?format=jpg&name=large");
    }

    document.getElementById("image").src = url;
  });
});
