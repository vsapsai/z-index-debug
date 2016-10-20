"use strict";

describe("content-script", function() {
    describe("getElementTreeData", function() {
        var getElementTreeData = visibleForTesting.exports.getElementTreeData;
        var testElement;

        function createDom(html) {
            testElement = document.createElement("div");
            testElement.innerHTML = html;
            document.body.appendChild(testElement);
        }

        afterEach(function() {
            if (testElement) {
                testElement.remove();
                testElement = null;
            }
        })

        it("should return offset coordinates in 'rect'", function() {
            createDom("");
            testElement.style.marginLeft = "10px";
            var rect = getElementTreeData(testElement).rect;
            expect(rect.length).toBe(4);
            expect(rect[0]).toBe(testElement.offsetLeft);
            expect(rect[1]).toBe(testElement.offsetTop);
            expect(rect[2]).toBe(testElement.offsetWidth);
            expect(rect[3]).toBe(testElement.offsetHeight);
        });
    });
});