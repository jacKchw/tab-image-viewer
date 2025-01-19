chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "0",
  });
});

let tabs = [];

chrome.action.onClicked.addListener(async (tab) => {
  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    text: (tabs.length + 1).toString(),
  });
  const extensionTab = await chrome.tabs.create({
    url: chrome.runtime.getURL("index.html"),
  });
  tabs.push(extensionTab.id);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  tabs = tabs.filter((id) => id !== tabId);
  chrome.action.setBadgeText({
    text: tabs.length.toString(),
  });
});
