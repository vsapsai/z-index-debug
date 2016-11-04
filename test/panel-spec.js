"use strict";

describe("panel", function() {
    describe("buildStackingContextTree", function() {
        var buildStackingContextTree = visibleForTesting.exports.buildStackingContextTree;
        var elementTree = {
            rect: [10, 15, 100, 100],
            tagName: "BODY",
            computedZIndex: "10",
            isStackingContextRoot: true,
            children: [{
                rect: [5, 7, 50, 50],
                tagName: "DIV",
                computedZIndex: "20",
                isStackingContextRoot: true,
                children: []
            },
            {
                rect: [25, 25, 40, 40],
                tagName: "P",
                computedZIndex: "auto",
                isStackingContextRoot: false,
                children: []
            }]
        };

        it("should populate zIndex field", function() {
            var stackingContextTree = buildStackingContextTree(elementTree);
            expect(stackingContextTree.zIndex).toBe("10");
            expect(stackingContextTree.children[0].zIndex).toBe("20");
        });

        it("should create new child nodes only for stacking context roots", function() {
            var stackingContextTree = buildStackingContextTree(elementTree);
            expect(stackingContextTree.children.length).toBe(1);
            expect(stackingContextTree.children[0].children.length).toBe(0);
            expect(stackingContextTree.elementRectangles.length).toBe(2);
            expect(stackingContextTree.children[0].elementRectangles.length).toBe(1);
        });

        it("should calculate element rectangles based on parent offset", function() {
            var stackingContextTree = buildStackingContextTree(elementTree);
            expect(stackingContextTree.elementRectangles[0]).toEqual([10, 15, 100, 100]);
            expect(stackingContextTree.elementRectangles[1]).toEqual([35, 40, 40, 40]);
            expect(stackingContextTree.children[0].elementRectangles[0]).toEqual([15, 22, 50, 50]);
        });
    });
});
