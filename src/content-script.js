(function() {
    "use strict";

    chrome.runtime.onMessage.addListener(function(message) {
        if (message.name === "get-data") {
            chrome.runtime.sendMessage({
                name: "get-data-response",
                data: getElementTreeData(document.body)
            });
        } else {
            console.log("[content-script] Unknown message name " + message.name);
        }
    });

    function getElementTreeData(element) {
        var result = {
            rect: [element.offsetLeft, element.offsetTop, element.offsetWidth, element.offsetHeight]
        };
        var resultChildren = [];
        // Recursively add children.
        var children = element.children;
        if (children) {
            var i;
            for (i = 0; i < children.length; i++) {
                resultChildren.push(getElementTreeData(children[i]));
            }
        }
        result.children = resultChildren;
        return result;
    }
})();
