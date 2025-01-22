const saveOptions = () => {
  const options = {};
  for (const [key, value] of Object.entries(enhanceSites)) {
    const input = document.getElementById(value.id);
    options[key] = input.checked;
  }
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
  const items = await chrome.storage.sync.get(defaultOptioins);
  for (const [key, value] of Object.entries(enhanceSites)) {
    document.getElementById(value.id).checked = items[key];
  }
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("saveBtn").addEventListener("click", saveOptions);
