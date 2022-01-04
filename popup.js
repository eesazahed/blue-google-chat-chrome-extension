const changeColor = document.getElementById('changeColor');

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
    });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
        // Wait 1 second to load the website
        setTimeout(function () {
            // Change the colors of the website
            $("*").css("background-color", color);
            $("*").css("color", "chartreuse");
            $("input").css("color", "chartreuse");
        }, 1000);

    });
}
