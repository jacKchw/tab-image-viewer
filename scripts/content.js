let currentSrc = "";

let enhanceImageHost = "";

const host = document.location.host;
(async () => {
  const enhanceOptions = await chrome.storage.sync.get(defaultEnhanceOptioins);

  for (const enhanceURL of enhanceURLs) {
    if (host === enhanceURL.host && enhanceOptions[enhanceURL.id]) {
      enhanceImageHost = enhanceURL.imageHost;
    }
  }
})();

const fetchImage = async (url) => {
  const response = await fetch(url, {
    referrer: url.origin,
  });
  return response.blob();
};

const getOriginalImage = (imageSrc, target) => {
  let imageURL = new URL(imageSrc);

  if (enhanceImageHost === "") {
    return imageURL;
  }

  if (
    enhanceImageHost === imageURL.host &&
    enhanceImageHost === "i.pximg.net"
  ) {
    // get original image url in pixiv
    const linkElement = target.closest("a");
    const href = linkElement.href;
    if (href !== undefined && href.search(/(png)|(jpg)|(jpeg)/) !== -1) {
      return new URL(linkElement.href);
    }
  } else if (
    enhanceImageHost === imageURL.host &&
    enhanceImageHost === "pbs.twimg.com"
  ) {
    // get original image url in twitter
    return new URL(
      imageURL.origin + imageURL.pathname + "?format=jpg&name=large"
    );
  } else if (
    enhanceImageHost === imageURL.host &&
    enhanceImageHost === "i.ytimg.com"
  ) {
    // get original image url in youtube
    ytId = imageURL.pathname.split("/")[2];
    return new URL(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);
  }

  return imageURL;
};

document.addEventListener("mouseover", async (event) => {
  // get img src
  let target = event.target.closest("img");
  if (target && currentSrc !== target.currentSrc) {
    currentSrc = target.currentSrc;

    const imageURL = getOriginalImage(currentSrc, target);
    console.log(imageURL);
    const blob = await fetchImage(imageURL);
    const blobURL = URL.createObjectURL(blob);

    chrome.runtime.sendMessage({
      type: "updateImgUrl",
      value: blobURL,
    });
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (const enhanceURL of enhanceURLs) {
    if (host === enhanceURL.host && changes[enhanceURL.id] !== null) {
      if (changes[enhanceURL.id].newValue) {
        enhanceImageHost = enhanceURL.imageHost;
      } else {
        enhanceImageHost = "";
      }
    }
  }
});
