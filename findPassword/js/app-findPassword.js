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
            this.mail = /^([a-z0-9_\.-]+)@([a-z0-9\.-]+)\.([a-z\.]{2,6})$/i,
            this.initState(),
            this.bindEvents()
        },
        initState: function() {
            var i = e("#errmsg").val()
              , n = /login_user_name=([^;]+)/g.exec(document.cookie)
              , a = e('[name="tel"]')
              , s = /[?&]?type=email(?=[;&#]|$)/i.test(window.location.href);
            s && (e("#NavTab").find(".tab").toggleClass("active"),
            e("section.loginType").toggleClass("hide")),
            t.tip = function(e) {
                t({
                    type: "info",
                    message: e
                })
            }
            ,
            i && t.tip(i),
            n = n ? n[1] : "",
            n && a.siblings(".btn-close").removeClass("hide"),
            a.val(decodeURIComponent(n))
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
                  , s = function() {
                    var t = this
                      , i = e("#areaCode")
                      , n = i.find(".left-inner")
                      , a = i.find(".nav-inner")
                      , s = t.areaKey
                      , o = t.areaMap
                      , r = 44
                      , d = ~~e("#J_area").data("id") || 40;
                    s.forEach(function(t) {
                        o[t].length && (n.append(e("<div/>", {
                            "class": "cat border-bottom",
                            id: "_anchor_" + t
                        }).append(t)),
                        a.append(e("<li/>", {
                            "data-target": t,
                            text: t
                        })).addClass("show")),
                        o[t].sort(function(e, t) {
                            return e.name.localeCompare(t.name)
                        }).forEach(function(t) {
                            n.append(e("<a/>", {
                                "class": (t.countryId == d ? "item selected" : "item") + " border-bottom",
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
                              , s = e("#_anchor_" + n);
                            e(window).scrollTop(s.offset().top - r)
                        } catch (t) {}
                        var o = function(t) {
                            var n = document.elementFromPoint(i, t.touches[0].clientY);
                            try {
                                var a = n.dataset.target
                                  , s = e("#_anchor_" + a);
                                e(window).scrollTop(s.offset().top - r)
                            } catch (t) {}
                            return !1
                        }
                          , d = function() {
                            a.off("touchmove", o).off("touchend", d).removeClass("active")
                        };
                        return a.on("touchmove", o).on("touchend", d),
                        !1
                    })
                }
                  , o = function(i) {
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
                    getAreaCode: o,
                    renderAreaList: s,
                    reduceAreaData: a
                }),
                n
            }()
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
        verifyCode: function(i, n) {
            var a = this
              , s = "/ajax/checkCaptcha?identify_code=" + i + "&t=" + ((new Date).getTime() + Math.random());
            n = n || function() {}
            ,
            e.getJSON(s, function(e) {
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
                    t.tip("动态口令已发送, 15分钟内有效!"),
                    n();
                else
                    switch (e.errno) {
                    case 0:
                        return void t.tip("动态口令已发送, 15分钟内有效! ");
                    case -1:
                        return void t.tip("请输入正确的手机号码");
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
        setPassByPhone: function(i, n) {
            n = n || function() {}
            ,
            e.post("/forget/verTel", i, function(i) {
                i.success ? n() : (e("#telSubmit").removeClass("point-event-none disable"),
                t.tip(i.errmsg))
            }, "json")
        },
        setPassByMail: function(i, n) {
            n = n || function() {}
            ,
            e.post("/forget/sendEmail", i, function(e) {
                e.success ? t.tip("发送成功, 请登录邮箱重置密码。") : (t.tip(e.errmsg),
                n())
            }, "json")
        },
        bindEvents: function() {
            function i(e, t) {
                h || (h = !0,
                u && clearTimeout(u),
                u = setTimeout(function() {
                    var i = t.find(".submit-btn");
                    n(e, t, !1) ? i.removeClass("disabled") : i.addClass("disabled"),
                    h = !1,
                    clearTimeout(u)
                }, m))
            }
            function n(e, t, i) {
                var n = t.hasClass("byPhone")
                  , s = []
                  , o = e.filter('[name="tel"]')
                  , r = e.filter('[name="identify"]')
                  , d = e.filter('[name="verifyCode"]')
                  , l = e.filter('[name="mail"]');
                return i = i || !1,
                n ? (o.length && s.push(["tel", o]),
                r.length && s.push(["identify", r]),
                d.length && s.push(["verify", d])) : (l.length && s.push(["mail", l]),
                r.length && s.push(["identify", r])),
                a(s, i)
            }
            function a(e, i) {
                for (var n, a, s, o, r, d = e.length, l = !0, c = 0; d > c; c++) {
                    switch (n = e[c],
                    a = n[0],
                    s = n[1],
                    o = s.val(),
                    a) {
                    case "tel":
                        if (!o) {
                            i && t.tip("请输入手机号码"),
                            l = !1;
                            break
                        }
                        r = s.parents(".form").find(".intl-code").data("code"),
                        "0086" == r ? f.phone11.test(o) || (i && t.tip("请输入正确的号码"),
                        l = !1) : f.phone5.test(o) || (i && t.tip("请输入正确的号码"),
                        l = !1);
                        break;
                    case "identify":
                        if (!o) {
                            i && t.tip("请输入图形验证码"),
                            l = !1;
                            break
                        }
                        if (!f.code4.test(o)) {
                            i && t.tip("请输入正确的验证码，长度4位字母或者数字。"),
                            l = !1;
                            break
                        }
                        break;
                    case "verify":
                        if (!o) {
                            i && t.tip("请输入短信验证码"),
                            l = !1;
                            break
                        }
                        if (!f.code6.test(o)) {
                            i && t.tip("请输入正确的动态密码"),
                            l = !1;
                            break
                        }
                        break;
                    case "mail":
                        if (!o) {
                            i && t.tip("请输入邮箱地址"),
                            l = !1;
                            break
                        }
                        if (!f.mail.test(o)) {
                            i && t.tip("请输入正确的邮箱地址"),
                            l = !1;
                            break
                        }
                    }
                    if (!l)
                        break
                }
                return l
            }
            function s() {
                return e("#index,#areaCode").toggleClass("hide"),
                !1
            }
            function o() {
                var t = e(this).siblings(".btn-close");
                e(this).val() ? t.removeClass("hide") : t.addClass("hide")
            }
            function r() {
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
            function d() {
                var t = e("#intlCode").val() || ""
                  , i = e(this).parents(".form")
                  , n = {
                    intlCode: t,
                    tel: e('[name="tel"]', i).val(),
                    identify_code: e('[name="identify"]', i).val()
                };
                f.sendCode(n, r.bind(this))
            }
            function l() {
                var t = e("#mailSubmit");
                t.hasClass("point-event-none") || (t.text(f.mailTime + "秒后重新发送"),
                t.addClass("point-event-none").addClass("disable"),
                f.mailTimer && clearInterval(f.mailTimer),
                f.mailTimer = setInterval(function() {
                    t.text(f.mailTime-- + "秒后重新发送"),
                    f.mailTime < 1 && (t.text("获取新密码").removeClass("point-event-none disable"),
                    f.mailTime = 60,
                    clearInterval(f.mailTimer),
                    f.mailTimer = null )
                }, m))
            }
            function c() {
                var t = {
                    email: e("#email").val(),
                    identifyCode: e("#mailIdentifyCode").val()
                };
                f.setPassByMail(t, function() {
                    e('[name="identify"]').val(""),
                    f.changeIdentifyCode(),
                    clearInterval(f.mailTimer),
                    f.mailTimer = null ,
                    e("#mailSubmit").text("获取新密码").removeClass("disable point-event-none")
                })
            }
            var u, f = this, h = !1, m = 1e3, p = e(".identify-img").click(f.changeIdentifyCode);
            p.length && p.trigger("click"),
            e(".form input").on("input propertychange", function() {
                var t = e(this).parents(".form");
                i(e("input", t), t)
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
                var s = a.find(".intl-name").data("name", i);
                return s.text(i),
                e("#intlCode").val(n),
                e("#index, #areaCode").toggleClass("hide"),
                !1
            }),
            e("#J_back").click(s),
            e("#J_ac_bind, #J_dy_bind").click(function() {
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
            e(".username").find("input").focus(o).blur(o).on("input propertychange", o),
            e("#NavTab").on("click", ".tab", function() {
                var t = e(this).index()
                  , i = e(".loginType");
                e(this).hasClass("active") || (e(this).addClass("active").siblings(".tab").removeClass("active"),
                f.changeIdentifyCode(),
                i.eq(t).removeClass("hide").siblings(".loginType").addClass("hide"))
            }),
            e("#getCode, #sendCodeAgain").click(function() {
                var t = this
                  , i = e(this).parents(".form")
                  , a = e("input", i)
                  , s = n(a.not('[name="verifyCode"]'), i, !0);
                return s ? (f.verifyCode(a.filter('[name="identify"]').val(), d.bind(t)),
                !1) : void 0
            }),
            e("#telSubmit").click(function() {
                var t, i = e(this).parents(".form");
                n(e("input", i), i, !0) && (e(this).addClass("point-event-none disable"),
                t = {
                    intlCode: e("#intlCode").val(),
                    tel: e("#tel").val(),
                    identifyCode: e("#telIdentifyCode").val(),
                    verifyCode: e('[name="verifyCode"]').val()
                },
                f.setPassByPhone(t, function() {
                    window.location.href = "/forget/setPassword"
                }))
            }),
            f.mailTime = 60,
            e("#mailSubmit").click(function() {
                var t = e(this).parents(".form");
                n(e("input", t), t, !0) && (f.mailTimer || c(),
                l())
            })
        }
    };
    i.init()
});
