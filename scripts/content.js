let currentSrc = "";

let enhanceImageHost = "";

(async () => {
  const enhanceOptions = await chrome.storage.sync.get(defaultEnhanceOptioins);
  const host = document.location.host;

  for (const enhanceURL of enhanceURLs) {
    if (host === enhanceURL.host && enhanceOptions[enhanceURL.id]) {
      enhanceImageHost = enhanceURL.imageHost;
    }
  }
  console.log(enhanceImageHost);
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

  // get original image url in pixiv
  if (
    enhanceImageHost === imageURL.host &&
    enhanceImageHost === "i.pximg.net"
  ) {
    const linkElement = target.closest("a");
    const href = linkElement.href;
    if (href !== undefined && href.search(/(png)|(jpg)|(jpeg)/) !== -1) {
      imageURL = new URL(linkElement.href);
    }
  }

  // get original image url in twitter
  if (
    enhanceImageHost === imageURL.host &&
    enhanceImageHost === "pbs.twimg.com"
  ) {
    return new URL(
      imageURL.origin + imageURL.pathname + "?format=jpg&name=large"
    );
  }

  // get original image url in youtube
  if (
    enhanceImageHost === imageURL.host &&
    enhanceImageHost === "i.ytimg.com"
  ) {
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
