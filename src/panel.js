(function() {
    "use strict";

    var canvas = document.getElementById("canvas");
    // Use colors from D3 schemeCategory20
    // https://github.com/d3/d3-scale/blob/master/README.md#schemeCategory20
    var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c",
                  "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5",
                  "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f",
                  "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];

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

        var stackingContextTree = buildStackingContextTree(data);
        drawStackingContextTree(stackingContextTree);
    }

    function  buildStackingContextTree(elementTree) {
        var offsetLeft = elementTree.rect[0],
            offsetTop = elementTree.rect[1],
            width = elementTree.rect[2],
            height = elementTree.rect[3];
        var root = {
            zIndex: elementTree.computedZIndex,
            elementRectangles: [[offsetLeft, offsetTop, width, height]],
            children: []
        };
        var i;
        for (i = 0; i < elementTree.children.length; i++) {
            buildStackingContextTreeRecursive(root, elementTree.children[i], offsetLeft, offsetTop);
        }
        return root;
    }

    function buildStackingContextTreeRecursive(node, elementTree, parentOffsetLeft, parentOffsetTop) {
        var offsetLeft = elementTree.rect[0] + parentOffsetLeft;
        // In HTML offsetTop if position of the element's bottom and on canvas `y` is position of rect top.
        // It's not applicable to root element because it doesn't have `offsetParent`.
        var offsetTop = elementTree.rect[1] + parentOffsetTop;
        var elementRect = [offsetLeft, offsetTop, elementTree.rect[2], elementTree.rect[3]];
        var currentNode;
        if (elementTree.isStackingContextRoot) {
            currentNode = {
                zIndex: elementTree.computedZIndex,
                elementRectangles: [elementRect],
                children: []
            };
            node.children.push(currentNode);
        } else {
            node.elementRectangles.push(elementRect);
            currentNode = node;
        }
        var i;
        for (i = 0; i < elementTree.children.length; i++) {
            buildStackingContextTreeRecursive(currentNode, elementTree.children[i], offsetLeft, offsetTop);
        }
    }

    function drawStackingContextTree(stackingContextTree) {
        var context = canvas.getContext("2d");
        drawStackingContextTreeRecursive(context, stackingContextTree, false, 0);
    }

    // Returns number of used colors which is the same as number of stacking contexts in the tree excluding root.
    function drawStackingContextTreeRecursive(context, stackingContextTree, shouldFillRectangles, colorIndex) {
        var count = 0;
        var i;
        if (shouldFillRectangles) {
            context.fillStyle = getColor(colorIndex);
            for (i = 0; i < stackingContextTree.elementRectangles.length; i++) {
                var rect = stackingContextTree.elementRectangles[i];
                context.fillRect(rect[0], rect[1], rect[2], rect[3]);
            }
            count++;
        }
        if (stackingContextTree.children.length > 0) {
            var children = Array.from(stackingContextTree.children);
            children.sort(function(node1, node2) {
                if (node1.zIndex === node2.zIndex) {
                    return 0;
                }
                if (node1.zIndex === "auto") {
                    return -1;
                }
                if (node2.zIndex === "auto") {
                    return 1;
                }
                return parseInt(node1.zIndex, 10) - parseInt(node2.zIndex, 10);
            });
            for (i = 0; i < children.length; i++) {
                count += drawStackingContextTreeRecursive(context, children[i], true, colorIndex + count);
            }
        }
        // Draw z-index values for stacking contexts.
        context.fillStyle = "black";
        context.font = "14px sans-serif";
        context.fillText("z-index: " + stackingContextTree.zIndex,
            stackingContextTree.elementRectangles[0][0] + 5, stackingContextTree.elementRectangles[0][1] + 15);
        return count;
    }

    function getColor(index) {
        var hexColor = colors[index % colors.length];
        var red = parseInt(hexColor.substring(1, 3), 16);
        var green = parseInt(hexColor.substring(3, 5), 16);
        var blue = parseInt(hexColor.substring(5, 7), 16);
        return "rgba(" + red + "," + green + "," + blue + ", 0.7)";
    }
})();
