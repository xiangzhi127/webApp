define(function(require, e, t) {
    var o = require("zepto")
      , n = {
        mInfo: null ,
        getGPS: function(e) {
            if (G.versionCmp(G.AppVersion, "7.1.0") > 0)
                return void this.useBridgeGPS(e);
            var t = localStorage.getItem("zipLocation")
              , o = localStorage.getItem("userGPS")
              , n = localStorage.getItem("autoGPS");
            if (t && (!/iphone/i.test(navigator.userAgent) || G.isHybrid)) {
                if (t = JSON.parse(t),
                t.orderCityLetter)
                    return e({
                        letter: t.orderCityLetter,
                        code: t.orderCityCode,
                        name: t.orderCityName,
                        lat: t.lat,
                        lng: t.lng,
                        address: t.address
                    }),
                    this;
                if (o) {
                    var r = JSON.parse(o);
                    if (r.letter)
                        return e({
                            letter: r.letter,
                            code: r.code,
                            name: r.name,
                            lat: t.lat,
                            lng: t.lng,
                            address: t.address
                        }),
                        this
                }
                return e(t),
                this
            }
            return o ? (e(JSON.parse(o)),
            this) : n ? (e(JSON.parse(n)),
            this) : (window.G && window.G.autoGPSListeners ? window.G.addAutoGPSListener(e) : e(""),
            this)
        },
        getHistoryCity: function() {
            var e = localStorage.getItem("userGPS") || localStorage.getItem("autoGPS");
            return e ? JSON.parse(e) : null
        },
        getAddressFromGPS: function(e, t) {
            var o = "ccff568d387a70b74963aeefdfd92cbd"
              , n = document.createElement("iframe");
            n.style.width = n.style.height = 0,
            document.body.appendChild(n);
            var r = n.contentWindow
              , a = r.document;
            a.open(),
            a.writeln('<script src="http://webapi.amap.com/maps?v=1.3&key=' + o + '"></script>'),
            a.close(),
            r.onload = function() {
                r.AMap.service("AMap.Geocoder", function() {
                    var o = new r.AMap.Geocoder({
                        city: ""
                    });
                    o.getAddress([e.lng, e.lat], function(e, o) {
                        t("complete" === e && "OK" === o.info ? o.regeocode : "")
                    })
                })
            }
        },
        getTel: function(e) {
            var t = "4007999999";
            if (!e || "function" != typeof e)
                return t;
            var o = document.cookie.match(new RegExp("(^| )400phone=([^;]*)(;|$)"));
            return null !== o ? void e(o[2]) : void (window.G && window.G.phoneListeners ? window.G.phoneListeners.push(e) : e(t))
        },
        getUserGPS: function(e) {
            var t = localStorage.getItem("userGPS");
            return t ? (e(JSON.parse(t)),
            this) : (e(""),
            this)
        },
        checkPositionChanged: function(e) {
            window.G && e && window.G.checkCityChanged(e)
        },
        getMInfo: function(e) {
            var t = this;
            if (t.mInfo)
                e(t.mInfo);
            else {
                var o = document.createElement("iframe");
                o.style.cssText = "width:0;height:0",
                o.src = "http://" + window.location.hostname.replace("dynamic.", "") + "/site/m2015/html/proxy.html",
                document.body.appendChild(o),
                window.addEventListener("message", function n(r) {
                    var a = JSON.parse(r.data);
                    "ready" == a.method && o.contentWindow.postMessage(JSON.stringify({
                        method: "info",
                        data: ""
                    }), "*"),
                    "info" == a.method && (t.mInfo = a.data,
                    e(t.mInfo),
                    o.parentNode.removeChild(o),
                    window.removeEventListener("message", n))
                })
            }
        },
        useBridgeGPS: function(e) {
            var t = require("bridge");
            t.getGPS(function(t) {
                t.success && (t = t.data,
                e({
                    letter: t.orderCityLetter,
                    code: t.orderCityCode,
                    name: t.orderCityName,
                    lat: t.lat,
                    lng: t.lng,
                    address: t.address
                }))
            })
        },
        useAutoBridgeGPS: function(e) {
            var t = require("bridge");
            t.getGPS(function(t) {
                t.success && (t = t.data,
                e({
                    letter: t.letter,
                    code: t.code,
                    name: t.name,
                    lat: t.lat,
                    lng: t.lng,
                    address: t.address
                }))
            })
        },
        getAutoGPS: function(e) {
            var t = localStorage.getItem("zipLocation");
            if (G.versionCmp(G.AppVersion, "7.1.0") > 0)
                return void this.useAutoBridgeGPS(e);
            if (t) {
                var o = JSON.parse(t);
                return 0 == o.lat && 0 == o.lng && (o.lat = "",
                o.lng = ""),
                e(o),
                this
            }
            var n = localStorage.getItem("autoGPS");
            return n ? (e(JSON.parse(n)),
            this) : (window.G && window.G.autoGPSListeners ? window.G.addAutoGPSListener(e) : e(""),
            this)
        },
        getUserInfo: function(e) {
            var t = this;
            if (t.userInfo)
                return e(t.userInfo),
                this;
            var n = window.G ? window.G.getHost() : "http://dynamic.m.tuniu.com";
            window.globalAjaxControl && window.globalAjaxControl.user ? o.ajax({
                url: n + "/m2015/global/index",
                type: "get",
                xhrFields: {
                    withCredentials: !0
                },
                dataType: "json",
                data: {
                    data: JSON.stringify({
                        user: window.globalAjaxControl.user
                    })
                },
                success: function(o) {
                    localStorage.setItem("userInfo", JSON.stringify(o.data.user)),
                    t.userInfo = o.data.user,
                    e(o.data.user)
                }
            }) : e("")
        }
    };
    t.exports = n
});
