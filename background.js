// Start the extension
console.log("Connected. Be sure to have dark mode already enabled for Google Chat.");

let color = '#191970';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
});
