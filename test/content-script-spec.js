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

        function clearDom() {
            if (testElement) {
                testElement.remove();
                testElement = null;
            }
        }

        afterEach(clearDom);

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

        it("should mention element tag name", function() {
            createDom("");
            var treeData = getElementTreeData(testElement);
            expect(treeData.tagName).toBe("DIV");
        });

        it("should contain data about child elements", function() {
            createDom("<span></span>");
            var treeData = getElementTreeData(testElement);
            expect(treeData.children).toBeDefined();
            expect(treeData.children.length).toBe(1);
            expect(treeData.children[0].tagName).toBe("SPAN");
        });

        it("should have different offset for <p> element", function() {
            createDom("<p>text</p>");
            var childData = getElementTreeData(testElement).children[0];
            expect(childData.rect[1]).not.toBe(testElement.children[0].offsetTop);
        });

        it("should have computed z-index", function() {
            createDom("<div class='test-z-index-1 test-position-relative'>foo</div>");
            var treeData = getElementTreeData(testElement);
            expect(treeData.computedZIndex).toBe("auto");
            expect(treeData.children[0].computedZIndex).toBe("1");
        });

        describe("isStackingContextRoot", function() {
            function getStackingContextRoot(classes) {
                createDom("<div class='" + classes + "'>foo</div>");
                return getElementTreeData(testElement).children[0].isStackingContextRoot;
            }

            afterEach(clearDom);

            it("should be true when has z-index and position absolute", function() {
                expect(getStackingContextRoot("test-z-index-1 test-position-absolute")).toBe(true);
            });

            it("should be true when has z-index and position relative", function() {
                expect(getStackingContextRoot("test-z-index-1 test-position-relative")).toBe(true);
            });

            it("should be false when has z-index and some other position", function() {
                expect(getStackingContextRoot("test-z-index-1 test-position-other")).toBe(false);
            });

            it("should be false when has z-index and no position", function() {
                expect(getStackingContextRoot("test-z-index-1")).toBe(false);
            });

            // Now without z-index.
            it("should be false when has no z-index and position absolute", function() {
                expect(getStackingContextRoot("test-position-absolute")).toBe(false);
            });

            it("should be false when has no z-index and position relative", function() {
                expect(getStackingContextRoot("test-position-relative")).toBe(false);
            });

            it("should be false when has no z-index and some other position", function() {
                expect(getStackingContextRoot("test-position-other")).toBe(false);
            });

            it("should be false when has no z-index and no position", function() {
                expect(getStackingContextRoot("")).toBe(false);
            });
        });
    });
});