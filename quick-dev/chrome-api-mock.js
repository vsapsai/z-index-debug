var chrome = {
    runtime: {
        connect: function() {
            return {
                onMessage: {
                    addListener: function(listener) {
                        window.parent.communicationChannel.addConnectionListener(listener);
                    }
                },
                postMessage: function(message) {
                    window.parent.communicationChannel.postConnectionMessage(message);
                }
            }
        },
        onMessage: {
            addListener: function(listener) {
                window.parent.communicationChannel.addRuntimeListener(listener);
            }
        },
        sendMessage: function(message) {
            window.parent.communicationChannel.postRuntimeMessage(message);
        }
    },
    devtools: {
        inspectedWindow: {
            tabId: "tabId"
        }
    }
};
