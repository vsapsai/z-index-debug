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

    if ((typeof visibleForTesting !== "undefined") && visibleForTesting && (visibleForTesting.id === "z-index debug plugin")) {
        visibleForTesting.exports.getElementTreeData = getElementTreeData;
    }

    function getElementTreeData(element) {
        var result = {
            rect: [element.offsetLeft, element.offsetTop, element.offsetWidth, element.offsetHeight],
            tagName: element.tagName
        };
        // In HTML <p> offsetTop if position of the element's bottom and on canvas `y` is position of rect top.
        if (element.tagName === "P") {
            result.rect[1] -= result.rect[3];
        }
        // z-index
        var computedStyle = window.getComputedStyle(element);
        result.computedZIndex = computedStyle.zIndex;

        // Stacking context.
        result.isStackingContextRoot = ((computedStyle.zIndex != "auto") &&
            ((computedStyle.position === "absolute") || (computedStyle.position === "relative")));

        // Recursively add children.
        var resultChildren = [];
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
