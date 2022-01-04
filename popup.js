const changeColor = document.getElementById('changeColor');
let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#191970", "#2832C2", "#051094", "#241571", "#1E90FF", "#0000CD"];

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

// Reacts to a button click by marking the selected button and saving
// the selection
function handleButtonClick(event) {
    // Remove styling from the previously selected color
    let current = event.target.parentElement.querySelector(
        `.${selectedClassName}`
    );
    if (current && current !== event.target) {
        current.classList.remove(selectedClassName);
    }

    // Mark the button as selected
    let color = event.target.dataset.color;
    event.target.classList.add(selectedClassName);
    chrome.storage.sync.set({ color });
    chrome.storage.sync.get("color", ({ color }) => {
        changeColor.style.backgroundColor = color;
    });
}

// Add a button to the page for each supplied color
function constructOptions(buttonColors) {
    chrome.storage.sync.get("color", (data) => {
        let currentColor = data.color;
        // For each color we were provided…
        for (let buttonColor of buttonColors) {
            // …create a button with that color…
            let button = document.createElement("button");
            button.dataset.color = buttonColor;
            button.style.backgroundColor = buttonColor;

            // …mark the currently selected color…
            if (buttonColor === currentColor) {
                button.classList.add(selectedClassName);
            }

            // …and register a listener for when that button is clicked
            button.addEventListener("click", handleButtonClick);
            page.appendChild(button);
        }
    });
}

// Initialize the page by constructing the color options
constructOptions(presetButtonColors); 
