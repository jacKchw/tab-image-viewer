const saveOptions = () => {
  const options = {};
  for (const id in defaultEnhanceOptioins) {
    const input = document.getElementById(id);
    options[id] = input.checked;
  }
  console.log(options);
  chrome.storage.sync.set(options, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(() => {
      status.textContent = "";
    }, 750);
  });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = async () => {
  const items = await chrome.storage.sync.get(defaultEnhanceOptioins);
  for (const id in defaultEnhanceOptioins) {
    document.getElementById(id).checked = items[id];
  }
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("saveBtn").addEventListener("click", saveOptions);
