`z-index` CSS property looks deceptively simple. To show an element on top of others you just add `z-index: 1000;` in CSS and expect it to be sufficient. But reality turns out to be more complex than that. Ordering of elements depends on other properties and on `z-index` value of other elements in DOM hierarchy. On sufficiently big pages this interaction can get quite complex pretty quickly. The goal of this plugin it to help with understanding `z-index` and its effects. Currently plugin looks the following way

![z-index debugging tool](https://bytebucket.org/vsapsai/z-index-debug/raw/d00d16816c7f851f4fc32eedee669eb78604586b/screenshot.png)

## Development
Some of development relies on running simple HTTP server in project directory. The simplest way to do so is to run `python -m SimpleHTTPServer 8008` from corresponding directory.

### Running tests
You can run tests by going to http://localhost:8008/test/ in browser after simple HTTP server is started.

### Quick dev
Reloading plugin in browser takes some time and after reloading doesn't always work so to speed up development you can go to http://localhost:8008/quick-dev/ in browser after simple HTTP server is started. It imitates plugin behavior by showing in one &lt;iframe&gt; some HTML page and in another &lt;iframe&gt; z-index plugin panel.

### Test in browser
To test plugin in Chrome you can go to chrome://extensions/ and Load unpacked extension… In opened dialog select `src/` directory, i.e. directory that contains `manifest.json`.

## Useful resources
* https://developer.chrome.com/extensions/overview
* https://developer.chrome.com/extensions/devtools
* https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
