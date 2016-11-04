var chrome = {
    runtime: {
        onMessage: {
            addListener: function() {}
        },
        connect: function() {
            return {
                onMessage: {
                    addListener: function() {}
                },
                postMessage: function() {}
            };
        }
    },
    devtools: {
        inspectedWindow: {
            tabId: "tabId"
        }
    }
};
