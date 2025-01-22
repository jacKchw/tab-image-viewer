// load options
let enhanceSiteKey = "";
const host = document.location.host;
(async () => {
  const options = await chrome.storage.sync.get(defaultOptioins);

  for (const [key, site] of Object.entries(enhanceSites)) {
    if (host.search(site.host) !== -1 && options[key]) {
      enhanceSiteKey = key;
      return;
    }
  }
})();

// react to option update
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key === enhanceSiteKey && !newValue) {
      enhanceSiteKey = "";
      return;
    }
    if (
      enhanceSiteKey === "" &&
      host.search(enhanceSites[key].host) &&
      newValue
    ) {
      enhanceSiteKey = key;
    }
  }
});

const fetchImage = async (url) => {
  const response = await fetch(url, {
    referrer: url.origin,
  });
  return response.blob();
};

// edit url to get larger image
const getOriginalImage = (imageSrc, target) => {
  let imageURL = new URL(imageSrc);

  if (enhanceSiteKey === "") {
    return imageURL;
  }

  if (
    enhanceSiteKey === "pixiv" &&
    enhanceSites[enhanceSiteKey].imageHost === imageURL.host
  ) {
    // get original image url in pixiv
    const linkElement = target.closest("a");
    const href = linkElement.href;
    if (href !== undefined && href.search(/(png)|(jpg)|(jpeg)/) !== -1) {
      return new URL(linkElement.href);
    }
  } else if (
    enhanceSiteKey === "twitter" &&
    enhanceSites[enhanceSiteKey].imageHost === imageURL.host
  ) {
    // get original image url in twitter
    return new URL(
      imageURL.origin + imageURL.pathname + "?format=jpg&name=large"
    );
  } else if (
    enhanceSiteKey === "youtube" &&
    enhanceSites[enhanceSiteKey].imageHost === imageURL.host
  ) {
    // get original image url in youtube
    ytId = imageURL.pathname.split("/")[2];
    return new URL(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);
  } else if (
    enhanceSiteKey === "pinterest" &&
    enhanceSites[enhanceSiteKey].imageHost === imageURL.host
  ) {
    // get original image url in pinterest
    return new URL(imageURL.origin + imageURL.pathname.replace(/236x/, "736x"));
  }

  return imageURL;
};

// when mouse hover on an img, fetch the image and send it to extension page
let currentSrc = "";
document.addEventListener("mouseover", async (event) => {
  // get img src
  let target = event.target.closest("img");
  if (target && currentSrc !== target.currentSrc) {
    currentSrc = target.currentSrc;

    const imageURL = getOriginalImage(currentSrc, target);
    const blob = await fetchImage(imageURL);
    const blobURL = URL.createObjectURL(blob);

    chrome.runtime.sendMessage({
      type: "updateImgUrl",
      value: blobURL,
    });
  }
});
