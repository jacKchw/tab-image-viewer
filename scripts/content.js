let currentSrc = "";

const parseTwitterURL = (imageURL) => {
  if (imageURL.host === "pbs.twimg.com") {
    return new URL(
      imageURL.origin + imageURL.pathname + "?format=jpg&name=large"
    );
  }
  return imageURL;
};

const fetchImage = async (url) => {
  const response = await fetch(url, {
    referrer: url.origin,
  });
  return response.blob();
};

document.addEventListener("mouseover", async (event) => {
  // get img src
  let target = event.target.closest("img");
  if (target && currentSrc !== target.currentSrc) {
    currentSrc = target.currentSrc;
    let imageURL = new URL(currentSrc);

    // get original image url in pixiv
    if (imageURL.host === "i.pximg.net") {
      const linkElement = target.closest("a");
      const href = linkElement.href;
      if (href !== undefined && href.search(/(png)|(jpg)|(jpeg)/) !== -1) {
        imageURL = new URL(linkElement.href);
      }
    }

    // get original image url in twitter
    imageURL = parseTwitterURL(imageURL);

    const blob = await fetchImage(imageURL);
    const blobURL = URL.createObjectURL(blob);

    chrome.runtime.sendMessage({
      type: "updateImgUrl",
      value: blobURL,
    });
  }
});
