seajs.config({
    base: "https://secure.tuniu.com/site/js/sea-modules/",
    alias: {
        dialog: "dialog/dialog.min.js",
        zepto: "zepto/zepto.min.js"
    }
}),
seajs.use(["zepto", "dialog"], function(e, t) {
    var i = {
        init: function() {
            this.phone5 = /^[0-9]{5,11}$/,
            this.phone11 = /^1[34578]\d{9}$/,
            this.code4 = /^[a-z0-9]{4}$/i,
            this.code6 = /^[a-z0-9]{6}$/i,
            this.password = /^[a-z0-9=\-_+)(*&^%$#@!~`\[\]{}\\|';":\/.,?><]{6,16}$/i,
            this.inviteCode = /^(?:[a-z0-9]{6}|1[34578]\d{9}|[c]\d+)$/i,
            this.submiting = !1,
            this.initState(),
            this.bindEvents()
        },
        defer: function(e, t, i) {
            i = i || this,
            t = t || 0,
            this.deferClock && clearTimeout(this.deferClock),
            this.deferClock = setTimeout(e.bind(i), t)
        },
        initState: function() {
            var i = /invite_code/i.test(window.location.search)
              , n = 1 == e("#isLogin").val();
            t.tip = function(e) {
                t({
                    type: "info",
                    message: e
                })
            }
            ,
            i && n && t({
                type: "alert",
                message: '<div style="text-align: center"><p>您已登录</p><p>邀请码仅供新会员使用</p></div>',
                okText: "返回首页",
                okCallback: function() {
                    window.location.href = "//m.tuniu.com"
                }
            }),
            window.location.hash = "step1"
        },
        getAC: function() {
            return function() {
                function i(t) {
                    return e.extend(this, t),
                    d
                }
                function n(e) {
                    return d || (d = new i(e)),
                    d
                }
                var a = function(e) {
                    var t, i = this, n = e, a = [];
                    for (t = 0; t < n.length; t++)
                        n[t].isHot && a.push(n[t]);
                    for (i.areaKey = ["HOT"],
                    i.areaMap = {
                        HOT: a
                    },
                    t = 65; 90 >= t; )
                        i.areaMap[String.fromCharCode(t)] = [],
                        i.areaKey.push(String.fromCharCode(t++));
                    i.areaCode = n.reduce(function(e, t) {
                        var i = t.spellFirst.toUpperCase();
                        return e[i].push(t),
                        e
                    }, i.areaMap),
                    i.renderAreaList()
                }
                  , o = function() {
                    var t = this
                      , i = e("#areaCode")
                      , n = i.find(".left-inner")
                      , a = i.find(".nav-inner")
                      , o = t.areaKey
                      , s = t.areaMap
                      , r = 44
                      , d = ~~e("#J_area").data("id") || 40;
                    o.forEach(function(t) {
                        s[t].length && (n.append(e("<div/>", {
                            "class": "cat border-bottom",
                            id: "_anchor_" + t
                        }).append(t)),
                        a.append(e("<li/>", {
                            "data-target": t,
                            text: t
                        })).addClass("show")),
                        s[t].sort(function(e, t) {
                            return e.name.localeCompare(t.name)
                        }).forEach(function(t) {
                            n.append(e("<a/>", {
                                "class": (t.countryId === d ? "item selected" : "item") + " border-bottom",
                                text: t.name,
                                href: "javascript:",
                                "data-name": t.name,
                                "data-intlCode": t.intlCode,
                                "data-id": t.countryId
                            }).append(e("<i/>", {
                                "class": "intl-code",
                                text: t.intlCode.replace(/^00/, "")
                            })))
                        })
                    }),
                    a.on("touchstart", function(t) {
                        var i = t.touches[0].clientX;
                        e(this).addClass("active");
                        try {
                            var n = t.target.dataset.target
                              , o = e("#_anchor_" + n);
                            e(window).scrollTop(o.offset().top - r)
                        } catch (t) {}
                        var s = function(t) {
                            var n = document.elementFromPoint(i, t.touches[0].clientY);
                            try {
                                var a = n.dataset.target
                                  , o = e("#_anchor_" + a);
                                e(window).scrollTop(o.offset().top - r)
                            } catch (t) {}
                            return !1
                        }
                          , d = function() {
                            a.off("touchmove", s).off("touchend", d).removeClass("active")
                        };
                        return a.on("touchmove", s).on("touchend", d),
                        !1
                    })
                }
                  , s = function(i) {
                    var n = this;
                    n.ACData || e.ajax({
                        url: n.url,
                        dataType: "json",
                        success: function(e) {
                            e && e.length ? (n.ACData = e,
                            i && i.call(n, e)) : t.tip("获取国家地区代码失败, 请稍后重试!")
                        },
                        error: function() {
                            t.tip("获取国家地区代码失败, 请稍后重试!")
                        }
                    })
                }
                  , r = function() {
                    this.getAreaCode(this.reduceAreaData)
                }
                  , d = null ;
                return e.extend(i.prototype, {
                    render: r,
                    getAreaCode: s,
                    renderAreaList: o,
                    reduceAreaData: a
                }),
                n
            }()
        },
        verifyCode: function(i, n) {
            var a = this
              , o = "/ajax/checkCaptcha?identify_code=" + i + "&t=" + ((new Date).getTime() + Math.random());
            n = n || function() {}
            ,
            e.getJSON(o, function(e) {
                e.success ? n() : (t.tip(e.errmsg || "验证码错误, 请重新输入"),
                -2 == e.errno && a.changeIdentifyCode())
            })
        },
        sendCode: function(i, n) {
            var a = this;
            n = n || function() {}
            ,
            e.post("/ajax/sendMobileCode", i, function(e) {
                if (e.success)
                    return t.tip("动态口令已发送, 15分钟内有效!"),
                    void n();
                switch (e.errno) {
                case 0:
                    return void t.tip("动态口令已发送, 15分钟内有效! ");
                case -1:
                    return t.tip("请输入正确的手机号码"),
                    void a.defer(function() {
                        a.toStep(1)
                    }, 1e3);
                case -2:
                    return t.tip("请输入正确的验证码"),
                    void a.changeIdentifyCode();
                case -3:
                    return void t.tip("动态口令发送失败, 请稍后重试。");
                default:
                    return void t.tip(e.errmsg)
                }
            }, "json")
        },
        isPhoneValid: function(i, n, a) {
            n = n || function() {}
            ,
            a = a || function() {}
            ,
            e.post("/register/isPhoneAvailable", i, function(e) {
                return "-20" != e.errno && e.success ? void n() : (t.tip(e.errmsg),
                void a())
            }, "json")
        },
        isInviteValid: function(i, n) {
            n = n || function() {}
            ,
            e.get("/register/isInviteCodeAvailable?invite_code=" + i, function(e) {
                return e.success ? void n() : void t.tip("邀请码不可用，请重新填写")
            }, "json")
        },
        changeIdentifyCode: function() {
            function t() {
                var t = e(".identify-img");
                t.siblings(".loading-gift").addClass("hide"),
                t.empty().append(e("<img>", {
                    src: "/ajax/captcha/m/" + ((new Date).getTime() + Math.random())
                }))
            }
            return this.ll = !0,
            this.ll ? (this.ll = !1,
            setTimeout(t, 500)) : t(),
            !1
        },
        toStep: function(t) {
            var i = e(".page-wrap").find(".page").eq(t - 1);
            i.removeClass("hide").siblings(".page").addClass("hide")
        },
        submitAndRegist: function(i, n) {
            var a = this;
            n = n || function() {}
            ,
            e.post("/register/mappPost", i, function(e) {
                a.submiting = !1,
                e.success ? (In("gaAndTac", function() {
                    tuniuTracker = _tat.getTracker(),
                    tuniuTracker.trackEvent("注册_成功")
                }),
                n(e)) : t.tip(e.errmsg)
            }, "json")
        },
        bindEvents: function() {
            function i(t) {
                e("." + t).removeClass("hide").siblings(".page").addClass("hide")
            }
            function n(t) {
                var i = e(t).parents(".page")
                  , n = i.index() + 1;
                h || (h = !0,
                u && clearTimeout(u),
                u = setTimeout(function() {
                    var e = i.find(".submit-btn");
                    a(n, !1) ? e.removeClass("disabled") : e.addClass("disabled"),
                    h = !1,
                    clearTimeout(u)
                }, p))
            }
            function a(t, i) {
                var n = e("#tel").val()
                  , a = e("#inviteCodeInput").val()
                  , s = e("#telIdentifyCode").val()
                  , r = e("#telCode").val()
                  , d = e("#telPwd").val()
                  , c = [];
                switch (t) {
                case 1:
                    c.push(["tel", n]),
                    a && a.length && c.push(["invite", a]);
                    break;
                case 2:
                    c.push(["identify", s]),
                    c.push(["telCode", r]);
                    break;
                case 3:
                    c.push(["telPwd", d])
                }
                return o(c, i)
            }
            function o(i, n) {
                for (var a, o, s, r, d = i.length, c = !0, l = 0; d > l; l++) {
                    switch (a = i[l],
                    o = a[0],
                    s = a[1],
                    o) {
                    case "tel":
                        if (!s) {
                            n && t.tip("请输入手机号码"),
                            c = !1;
                            break
                        }
                        r = e("#intlCode").val(),
                        "0086" == r ? f.phone11.test(s) || (n && t.tip("请输入正确的号码"),
                        c = !1) : f.phone5.test(s) || (n && t.tip("请输入正确的号码"),
                        c = !1);
                        break;
                    case "invite":
                        f.inviteCode.test(s) || (n && t.tip("请输入正确的邀请码"),
                        c = !1);
                        break;
                    case "identify":
                        if (!s) {
                            n && t.tip("请输入图形验证码"),
                            c = !1;
                            break
                        }
                        if (!f.code4.test(s)) {
                            n && t.tip("请输入正确的验证码，长度4位字母或者数字。"),
                            c = !1;
                            break
                        }
                        break;
                    case "telCode":
                        if (!s) {
                            n && t.tip("请输入短信验证码"),
                            c = !1;
                            break
                        }
                        if (!f.code6.test(s)) {
                            n && t.tip("请输入正确的动态密码"),
                            c = !1;
                            break
                        }
                        break;
                    case "telPwd":
                        if (!s) {
                            n && t.tip("请输入新密码"),
                            c = !1;
                            break
                        }
                        if (!f.password.test(s)) {
                            n && t.tip("密码为6~16位数字或英文字符"),
                            c = !1;
                            break
                        }
                    }
                    if (!c)
                        break
                }
                return c
            }
            function s() {
                return e("#index,#areaCode").toggleClass("hide"),
                !1
            }
            function r() {
                var t = e(this).siblings(".btn-close");
                e(this).val() ? t.removeClass("hide") : t.addClass("hide")
            }
            function d(e) {
                e.type = "text" == e.type ? "password" : "text"
            }
            function c() {
                var t = e("#sendCode").removeClass("hide")
                  , i = e("#sendCodeAgain");
                t.siblings().addClass("hide"),
                t.find("span").text(60),
                f.sendTime && clearInterval(f.sendTime),
                f.sendTime = setInterval(function() {
                    var e = t.find("span")
                      , n = ~~e.text();
                    n > 1 ? e.text(--n) : (i.removeClass("hide").siblings().addClass("hide"),
                    clearInterval(f.sendTime))
                }, 1e3)
            }
            function l() {
                var t = e("#intlCode").val() || "0086"
                  , i = {
                    intlCode: t,
                    tel: e("#tel").val(),
                    identify_code: e("#telIdentifyCode").val(),
                    isReg: 1
                };
                f.sendCode(i, c.bind(this))
            }
            var u, f = this, h = !1, p = 1e3, v = e(".identify-img").click(f.changeIdentifyCode);
            v.length && v.trigger("click"),
            e(window).on("hashchange", function() {
                var e = window.location.hash.slice(1);
                -1 !== ["step1", "step2", "step3", "step4"].indexOf(e) ? i(e) : window.location.hash = "step1"
            }).trigger("hashchange"),
            e("#inviteCode").click(function() {
                e(this).toggleClass("hide"),
                e("#inviteInput").toggleClass("hide")
            }),
            e(".historyBack").click(function() {
                history.back()
            }),
            e("#scroll").on("click", ".item", function() {
                var t = e('.item[data-id="' + e(this).data("id") + '"]');
                t.parent().find(".selected").removeClass("selected"),
                t.addClass("selected");
                var i = e(this).data("name")
                  , n = e(this).data("intlcode")
                  , a = f.$ac.data("id", e(this).data("id"));
                a.find(".intl-code").data("code", n).text(n.replace(/^00/, "+"));
                var o = a.find(".intl-name").data("name", i);
                return o.text(i),
                e("#intlCode").val(n),
                e("#index, #areaCode").toggleClass("hide"),
                !1
            }),
            e("#J_back").click(s),
            e("#J_ac_bind").click(function() {
                return s(),
                f.$ac = e(this),
                f.AC || (f.AC = f.getAC()),
                f.AC({
                    url: "/ajax/getCountryCode"
                }).render(),
                !1
            }),
            e(".btn-close").click(function() {
                return e(this).toggleClass("hide").siblings("input").val(""),
                !1
            }),
            e(".username").find("input").focus(r).blur(r).on("input propertychange", r),
            e(".form input").on("input propertychange", function() {
                n(this)
            }),
            e(".btn-see").click(function() {
                var t = e(this).parent();
                return t.find(".btn-see").toggleClass("hide"),
                d(t.find("input")[0]),
                !1
            }),
            e("#getCode, #sendCodeAgain").click(function() {
                var i;
                return a(1, !0) ? (i = e("#telIdentifyCode").val()) ? f.code4.test(i) ? void f.verifyCode(i, l.bind(this)) : void t.tip("请输入正确的图形验证码") : void t.tip("请输入图形验证码") : void f.toStep(1)
            }),
            e("#step1").click(function() {
                a(1, !0) && f.isPhoneValid({
                    intlCode: e("#intlCode").val(),
                    tel: e("#tel").val()
                }, function() {
                    var t = e("#inviteCodeInput").val();
                    t ? f.isInviteValid(t, function() {
                        window.location.hash = "step2"
                    }) : window.location.hash = "step2"
                })
            }),
            e("#step2").click(function() {
                a(1, !0) ? f.isPhoneValid({
                    intlCode: e("#intlCode").val(),
                    tel: e("#tel").val()
                }, function() {
                    a(2, !0) && (window.location.hash = "step3")
                }, function() {
                    window.location.hash = "step1"
                }) : window.location.hash = "step1"
            }),
            e("#iTimerBtn").click(function() {
                f.iTimer && clearInterval(f.iTimer)
            }),
            e("#step3").click(function() {
                var i = {};
                if (!f.submiting)
                    return a(1, !0) ? a(2, !0) ? void (a(3, !0) && (i.countryId = e("#J_ac_bind").data("id"),
                    i.intlCode = e("#intlCode").val(),
                    i.tel = e("#tel").val(),
                    i.telIdentifyCode = e("#telIdentifyCode").val(),
                    i.telCode = e("#telCode").val(),
                    i.telPwd = e("#telPwd").val(),
                    i.invite_code = e("#inviteCodeInput").length && e("#inviteCodeInput").val(),
                    f.submiting = !0,
                    f.submitAndRegist(i, function(i) {
                        var n = 15;
                        i.invite ? (f.toStep(4),
                        e("#banner").attr("src", e("#banner").data("src")),
                        f.iTimer && clearInterval(f.iTimer),
                        f.iTimer = setInterval(function() {
                            e("#iTimer").text(n-- + "秒"),
                            1 > n && (clearInterval(f.iTimer),
                            window.lcoation.href = "/login")
                        }, 1e3)) : (t.tip("注册成功"),
                        f.defer(function() {
                            window.location.href = "/login"
                        }, 2e3))
                    }))) : void (window.location.hash = "step2") : void (window.location.hash = "step1")
            })
        }
    };
    i.init()
});
