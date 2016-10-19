https://developer.chrome.com/extensions/overview
https://developer.chrome.com/extensions/devtools
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context


Features:
---------
* Show z-index for all elements
* Show which elements are roots of stacking contexts
* Also show elements which aren't currently visible as z-index is often used for various menus
* Warnings:
** Show elements with z-index that has no effect because it's not the stacking context root
** Show elements which z-index doesn't correspond to naive ordering. For example, show that 1.1000 is below 2
* Warn about cross-browser incompatibilities

Also what I can do is to search StackOverflow for CSS z-index questions and see if the tool can help in those cases.
