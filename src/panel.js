(function() {
    "use strict";

    var canvas = document.getElementById("canvas");

    // Create a connection to the background page.
    var backgroundPageConnection = chrome.runtime.connect({
        name: "z-index-panel"
    });

    backgroundPageConnection.onMessage.addListener(function(message) {
        // Handle responses from the background page, if any
        if (message.name === "get-data-response") {
            updateElementTree(message.data);
        } else {
            console.log("[z-index panel] Unknown message name " + message.name);
        }
    });

    backgroundPageConnection.postMessage({
        name: "init",
        tabId: chrome.devtools.inspectedWindow.tabId
    });
    backgroundPageConnection.postMessage({
        name: "get-data",
        tabId: chrome.devtools.inspectedWindow.tabId
    });

    function updateElementTree(data) {
        canvas.width = data.rect[2];
        canvas.height = data.rect[3];

        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "green";
        var i;
        for (i = 0; i < data.children.length; i++) {
            var childRect = data.children[i].rect;
            // In HTML offsetTop if position of the element's bottom and on canvas `y` is position of rect top.
            ctx.fillRect(childRect[0], childRect[1] - childRect[3], childRect[2], childRect[3]);
        }
    }
})();
