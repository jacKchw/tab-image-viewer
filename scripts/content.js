let currentSrc = "";

const fetchImage = async (url) => {
  let originalImageURL = new URL(url);
  if (originalImageURL.host === "pbs.twimg.com") {
    originalImageURL = new URL(
      originalImageURL.origin +
        originalImageURL.pathname +
        "?format=jpg&name=large"
    );
  }

  const response = await fetch(originalImageURL);
  return response.blob();
};

document.addEventListener("mouseover", async (event) => {
  let target = event.target.closest("img");
  if (target && currentSrc !== target.currentSrc) {
    currentSrc = target.currentSrc;

    const blob = await fetchImage(currentSrc);
    const blobURL = URL.createObjectURL(blob);

    chrome.runtime.sendMessage({
      type: "updateImgUrl",
      value: blobURL,
    });
  }
});
