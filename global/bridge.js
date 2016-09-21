define(function(require, t, e) {
    var i = {
        call: function(t, e, i) {
            G.webviewBridgeReady(function(n) {
                n.callHandler(t, e, i)
            })
        },
        getGPS: function(t) {
            var e = this;
            e.call("getGPS", {}, t)
        },
        getAppVersion: function(t) {
            var e = this;
            e.call("getAppVersion", {}, t)
        },
        getNetStatus: function(t) {
            var e = this;
            e.call("getNetStatus", {}, t)
        },
        getMultiWindowStatus: function(t) {
            var e = this;
            e.call("getMultiWindowStatus", {}, t)
        },
        setAppHeader: function(t, e) {
            this.call("setAppHeader", t, e)
        },
        setShare: function(t, e) {
            this.call("share", t, e)
        },
        setMultiWindowStatusChange: function(t, e) {
            this.call("setMultiWindowStatusChange", t, e)
        }
    };
    e.exports = i
});
