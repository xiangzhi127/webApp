/**
 * @Author: AidenCao caoyonggang@tuniu.com
 * @Date:   2016/06/15
 */

seajs.config({
  base: 'https://secure.tuniu.com/site/js/sea-modules/',
  alias: {
    dialog: 'dialog/dialog.min.js',
    // sea-modules
    zepto: 'zepto/zepto.min.js'
  }
});

seajs.use(['zepto', 'dialog'], function($, dialog) {
  var Passport = {
    init: function() {
      this.phone5 = /^[0-9]{5,11}$/;
      this.phone11 = /^1[34578]\d{9}$/;
      this.code4 = /^[a-z0-9]{4}$/i;
      this.code6 = /^[a-z0-9]{6}$/i;
      this.initState();
      this.bindEvents();
    },

    initState: function() {
      var errMsg = $('#errLoginMsg').val();
      var username = /login_user_name=([^;]+)/g.exec(document.cookie);
      var $input = $('[name="username"]');
      var tuniu_login_type = /tuniu_login_type=([^;]+)/g.exec(document.cookie);

      if($('#tmplogin').hasClass('hide') && tuniu_login_type){
          $('#tmplogin').removeClass('hide');
          $('#nomlogin').addClass('hide');
          $('#tmptab').addClass('active');
          $('#nomtab').removeClass('active');
      }

      dialog.tip = function(msg) {
        dialog({
          type: 'info',
          message: msg
        })
      };
      // 登录失败
      if (errMsg) {
        dialog.tip(errMsg)
      }
      // 填写默认的用户名
      username = username ? username[1] : '';
      if (username) {
        $input.siblings('.btn-close').removeClass('hide');
      }
      $input.val(decodeURIComponent(username));
      if ($('#telNum').val()) {
        this.needCaptcha();
      }
    },

    /* eslint-disable */
    getAC: function() {
      // 国家代码
      return (function() {
        var reduceAreaData = function(data) {
          var self = this,
            countrys = data,
            i,
            hotList = [];

          for (i = 0; i < countrys.length; i++) {
            if (countrys[i].isHot) {
              hotList.push(countrys[i]);
            }
          }
          self.areaKey = ['HOT'];
          self.areaMap = {
            'HOT': hotList
          };

          for (i = 65; i <= 90;) {
            self.areaMap[String.fromCharCode(i)] = [];
            self.areaKey.push(String.fromCharCode(i++));
          }

          self.areaCode = countrys.reduce(function(pre, next) {
            var spellFirst = next.spellFirst.toUpperCase();
            pre[spellFirst].push(next);
            return pre;
          }, self.areaMap);

          self.renderAreaList();
        };

        var renderAreaList = function() {
          var self = this,
            $areaCode = $('#areaCode'),
            $left = $areaCode.find('.left-inner'),
            $nav = $areaCode.find('.nav-inner'),
            key = self.areaKey,
            map = self.areaMap,
            headerHeight = 44;

          var id = ~~$('#J_area').data('id') || 40; //默认中国

          key.forEach(function(item, i) {
            if (map[item].length) {
              $left.append($('<div/>', {
                // 'class': (i ? (i === key.length - 1 ? 'cat last' : 'cat') : 'cat first'),
                'class': 'cat border-bottom',
                id: '_anchor_' + item
              }).append(item));

              $nav.append($('<li/>', {
                'data-target': item,
                text: item
              })).addClass('show');
            }


            map[item].sort(function(pre, next) {
              return pre.name.localeCompare(next.name);
            }).forEach(function(data) {
              $left.append($('<a/>', {
                'class': (data.countryId === id ? 'item selected' : 'item') + ' border-bottom',
                text: data.name,
                href: 'javascript:',
                'data-name': data.name,
                'data-intlCode': data.intlCode,
                'data-id': data.countryId
              }).append($('<i/>', {
                'class': 'intl-code',
                text: data.intlCode.replace(/^00/, '')
              })));
            });
          });

          $nav.on('touchstart', function(e) {
            var x = e.touches[0].clientX;
            $(this).addClass('active');
            try {
              var target = e.target.dataset.target;
              var $src = $('#_anchor_' + target);
              $(window).scrollTop($src.offset().top - headerHeight);
            } catch (e) {}

            var touchmove = function(e) {
              var elem = document.elementFromPoint(x, e.touches[0].clientY);
              try {
                var target = elem.dataset.target;
                var $src = $('#_anchor_' + target);
                $(window).scrollTop($src.offset().top - headerHeight);
              } catch (e) {}
              return false;
            };

            var touchend = function() {
              $nav.off('touchmove', touchmove).off('touchend', touchend).removeClass('active');
            };

            $nav.on('touchmove', touchmove).on('touchend', touchend);
            return false;
          });
        };

        var getAreaCode = function(fn) {
          var self = this;
          if (!self.ACData) {
            $.ajax({
              url: self.url,
              dataType: 'json',
              success: function(res) {
                if (res && res.length) {
                  self.ACData = res;
                  fn && fn.call(self, res);
                } else {
                  dialog.tip('获取国家地区代码失败, 请稍后重试!');
                }
              },
              error: function() {
                dialog.tip('获取国家地区代码失败, 请稍后重试!');
              }
            });
          }
        };
        var render = function() {
          this.getAreaCode(this.reduceAreaData);
        };

        var instance = null;

        function Render(options) {
          $.extend(this, options);
          return instance;
        }

        $.extend(Render.prototype, {
          render: render,
          getAreaCode: getAreaCode,
          renderAreaList: renderAreaList,
          reduceAreaData: reduceAreaData
        });

        function getInstance(options) {
          if (!instance) {
            instance = new Render(options);
          }
          return instance;
        }

        return getInstance;
      })();
    },
    /* eslint-enable */

    verifyCode: function(code, fn) {
      var self = this;
      var url = '/ajax/checkCaptcha?identify_code=' + code + '&t=' + (new Date().getTime() + Math.random());
      fn = fn || function() {};

      $.getJSON(url, function(json) {
        if (json.success) {
          // submit
          fn();
        } else {
          dialog.tip(json.errmsg || '验证码错误, 请重新输入');
          if (json.errno == -2) {
            self.changeIdentifyCode();
          }
        }
      });
    },

    sendCode: function(data, fn) {
      var self = this;
      fn = fn || function() {};

      $.post('/ajax/sendMobileCode', data, function(json) {
        if (json.success) {
          dialog.tip('动态口令已发送, 15分钟内有效!');
          fn();
        } else {
          switch (json.errno) {
            case 0:
              dialog.tip('动态口令已发送, 15分钟内有效! ');
              return;
            case -1:
              dialog.tip('请输入正确的手机号码');
              return;
            case -2:
              dialog.tip('请输入正确的验证码');
              self.changeIdentifyCode();
              return;
            case -3:
              dialog.tip('动态口令发送失败, 请稍后重试。');
              return;
            default:
              dialog.tip(json.errmsg);
              return;
          }
        }
      }, 'json');
    },

    changeTestIdentifyCode: function() {
      this.ll = true;

      function _refresh() {
        var $img = $('.identify-img');
        $img.siblings('.loading-gift').addClass('hide');
        $img.empty().append($('<img>', {
          src: '/ajax/captcha/m/' + (new Date().getTime() + Math.random()+'?test=1')
        }));
      }

      if (this.ll) {
        this.ll = false;
        setTimeout(_refresh, 500);
      } else {
        _refresh();
      }

      return false;
    },

    changeIdentifyCode: function() {
      this.ll = true;

      function _refresh() {
        var $img = $('.identify-img');
        $img.siblings('.loading-gift').addClass('hide');
        $img.empty().append($('<img>', {
          src: '/ajax/captcha/m/' + (new Date().getTime() + Math.random())
        }));
      }

      if (this.ll) {
        this.ll = false;
        setTimeout(_refresh, 500);
      } else {
        _refresh();
      }

      return false;
    },

    // 动态密码登录 是否需要图形验证码
    needCaptcha: function(fn) {
      var self = this;
      var tel = $('#telNum').val();
      var intlCode = $('#intlCode').val() || '0086';
      fn = fn || function() {};

      if (tel === self.preTel && intlCode === self.preCode) {
        fn(false);
        return;
      } else {
        self.preTel = tel;
        self.preCode = intlCode;
      }

      if (intlCode == '0086' && self.phone11.test(tel) || intlCode != '0086' && self.phone5.test(tel)) {
        $.getJSON('/ajax/isCaptchaRequired?tel=' + intlCode + tel, function(json) {
          if (json.success) {
            $('#captcha').removeClass('hide');
            fn(true);
          } else {
            $('#captcha').addClass('hide');
            fn(false);
          }
        });
      }
    },

    bindEvents: function() {
      var self = this;

      var checking = false;
      var threshold = 1000;
      var timer;

      // 图形码点击刷新
      var $img = $('.identify-img').click(self.changeIdentifyCode);
      $img.length && $img.trigger('click');

      // 更改登录按钮状态
      function _checkState(ele) {
        var $form = $(ele).parents('form');
        var $inputs = $('input', $form);

        if (!checking) {
          checking = true;
          timer && clearTimeout(timer);
          timer = setTimeout(function() {
            var $loginBtn = $form.find('.login-btn');
            if (_checkData($inputs, $form, false)) {
              $loginBtn.removeClass('disabled');
            } else {
              $loginBtn.addClass('disabled');
            }
            checking = false;
            clearTimeout(timer);
          }, threshold);
        }
      }

      // 提交表单
      function _checkData($inputs, $form, showTip) {
        var isCommon = $form.is('#CommonLogin');
        var isNormal = $('#nor_login_type').val() == 'm-n';
        // var hasCaptcha = !!$form.find('.identify').length;
        var checkArr = [];

        var $username = $inputs.filter('[name="username"]');
        var $password = $inputs.filter('[name="password"]');
        var $identify = $inputs.filter('[name="identify_code"]');
        showTip = showTip || false;


        if (isCommon) {
          // 途牛账号登录
          if (isNormal) {
            $username.length && checkArr.push(['name', $username]);
          } else {
            $username.length && checkArr.push(['intlNum', $username]);
          }
          $password.length && checkArr.push(['pass', $password]);
          $identify.length && checkArr.push(['identify', $identify]);
        } else {
          // 动态密码登录
          $username.length && checkArr.push(['intlNum', $username]);

          // 部分手机不需要图形码
          $identify.length && !$identify.parent().hasClass('hide') && checkArr.push(['identify', $identify]);
          $password.length && checkArr.push(['pass6', $password]);
        }

        return _checkFields(checkArr, showTip);
      }

      function _checkFields(checkArr, showTip) {
        var len = checkArr.length;
        var isValid = true;
        var i = 0;
        var item, key, $input, input;
        var intlCode;

        for (; i < len; i++) {
          item = checkArr[i];
          key = item[0];
          $input = item[1];
          input = $input.val();

          switch (key) {
            case 'name':
              if (!input) {
                showTip && dialog.tip('请输入手机号 / 会员名 / 昵称 / 邮箱');
                isValid = false;
              }
              break;
            case 'intlNum':
              if (!input) {
                showTip && dialog.tip('请输入手机号码');
                isValid = false;
                break;
              }

              intlCode = $input.parents('form').find('.intl-code').data('code');
              if (intlCode == '0086') {
                if (!self.phone11.test(input)) {
                  showTip && dialog.tip('请输入正确的号码');
                  isValid = false;
                }
              } else {
                if (!self.phone5.test(input)) {
                  showTip && dialog.tip('请输入正确的号码');
                  isValid = false;
                }
              }
              break;
            case 'pass':
              if (!input) {
                showTip && dialog.tip('请输入密码');
                isValid = false;
                break;
              }

              if (input.length < 6) {
                showTip && dialog.tip('请输入正确的密码，密码长度最少必须6位');
                isValid = false;
              }
              break;
            case 'identify':
              if (!input) {
                showTip && dialog.tip('请输入图形验证码');
                isValid = false;
                break;
              }
              if (!self.code4.test(input)) {
                showTip && dialog.tip('请输入正确的验证码，长度4位字母或者数字。');
                isValid = false;
                break;
              }
              break;
            case 'pass6':
              if (!input) {
                showTip && dialog.tip('请输入短信验证码');
                isValid = false;
                break;
              }
              if (!self.code6.test(input)) {
                showTip && dialog.tip('请输入正确的动态密码');
                isValid = false;
                break;
              }
              break;
          }
          if (!isValid) {
            break;
          }
        }
        return isValid;
      }

      // 返回按钮
      $('.historyBack').click(function() {
        history.back();
      });

      // 国家号码
      /* eslint-disable */
      $('#scroll').on('click', '.item', function() {
        var $target = $('.item[data-id="' + $(this).data('id') + '"]');
        $target.parent().find('.selected').removeClass('selected');
        $target.addClass('selected');
        var name = $(this).data('name');
        var code = $(this).data('intlcode');
        var $from = self.$ac.data('id', $(this).data('id'));
        $from.find('.intl-code').data('code', code).text(code.replace(/^00/, '+'));
        var $name = $from.find('.intl-name').data('name', name);
        if ($from.find('.intlCode').val(code).is('#intlCode')) {
          self.needCaptcha();
        }
        $name.text(name);
        $('#index, #areaCode').toggleClass('hide');
        return false;
      });
      /* eslint-enable */

      function _pageToggle() {
        $('#index,#areaCode').toggleClass('hide');
        return false;
      }

      $('#J_back').click(_pageToggle);
      $('#J_ac_bind, #J_dy_bind').click(function() {
        _pageToggle();
        self.$ac = $(this);
        if (!self.AC) {
          self.AC = self.getAC();
        }
        self.AC({
          url: '/ajax/getCountryCode'
        }).render();
        return false;
      });

      // 显示删除按钮
      function _toggleIconShow() {
        var $siblings = $(this).siblings('.btn-close');
        $(this).val() ? $siblings.removeClass('hide') : $siblings.addClass('hide');
      }

      $('.btn-close').click(function() {
        $(this).toggleClass('hide').siblings('input').val('');
        _checkState(this);
        return false;
      });

      $('.username').find('input').focus(_toggleIconShow).blur(_toggleIconShow).on('input propertychange', _toggleIconShow);

      $('.form input').on('input propertychange', function() {
        _checkState(this);
        if ($(this).is('#telNum')) {
          self.needCaptcha();
        }
      });


      $('.login-btn').click(function() {
        var $form = $(this).parents('form');
        var $inputs = $('input', $form);

        if (_checkData($inputs, $form, true)) {
          // 是否国际号码
          var isIntl = $('[name="login_type"]', $form).val() == 'm-i' || $('[name="login_type"]', $form).val() == 'm-m';
          var $intl = $form.find('.intlCode');

          if (isIntl) {
            !$intl.val() && $intl.val('0086');
          } else {
            $intl.val('');
          }
          // self.needCaptcha(function(need) {
          // if (need) {
          //   self.verifyCode($inputs.filter('[name="identify_code"]').val(), function() {
          //     $form.submit();
          //   });
          // } else {
          $form.submit();
          // }
          // });
        }
        return false;
      });

      //end
      //提交事件
      $("#normalNum").on("keyup", function() {
        if(this.value == '13951638125'||this.value == '13062527078'|| this.value =='17721561027'){
          self.changeTestIdentifyCode();
        }
      });


      // 切换tab标签
      $('#NavTab').on('click', '.tab', function() {
        var index = $(this).index();
        var $loginType = $('.loginType');
        if ($(this).hasClass('active')) {
          return;
        }

        $(this).addClass('active').siblings('.tab').removeClass('active');

        self.changeIdentifyCode();
        $loginType.eq(index).removeClass('hide').siblings('.loginType').addClass('hide');

        if (index) {
          self.needCaptcha();
        }
      });

      // 切换登录方式
      $('#J_tgLogin').click(function() {
        var $wrap = $('#J_ac_bind').parent().toggleClass('hide');
        var $normalNum = $('#normalNum');
        var $type = $('#nor_login_type');

        self.changeIdentifyCode();
        _checkState(this);
        // 是否国际号码登录
        if ($wrap.hasClass('hide')) {
          // 普通登录
          $type.val('m-n');
          $(this).text('国际手机号登录');
          $normalNum.attr({
            placeholder: '手机号 / 会员号 / 昵称 / 邮箱',
            maxlength: ''
          });
        } else {
          // 国际号码登录
          $type.val('m-i');
          $(this).text('普通登录');
          $normalNum.attr({
            placeholder: '请输入手机号',
            maxlength: '11'
          });
        }
        return false;
      });

      // 切换密码可见
      function _toggleInputType(ele) {
        ele.type = ele.type == 'text' ? 'password' : 'text';
      }

      $('.btn-see').click(function() {
        var $parent = $(this).parent();
        $parent.find('.btn-see').toggleClass('hide');
        _toggleInputType($parent.find('input')[0]);
        return false;
      });

      // 两周免登陆
      $('.twoWeek').click(function() {
        $(this).find('.btn-radio').toggleClass('hide');
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
          $(this).siblings('[name="remember_me"]').val('1');
        } else {
          $(this).siblings('[name="remember_me"]').val('');
        }
        return false;
      });

      // 发送短信验证码
      function _intervalTime() {
        var $sendCode = $('#sendCode').removeClass('hide');
        var $sendAgain = $('#sendCodeAgain');

        $sendCode.siblings().addClass('hide');
        $sendCode.find('span').text(60);

        self.sendTime && clearInterval(self.sendTime);
        self.sendTime = setInterval(function() {
          var $span = $sendCode.find('span');
          var time = ~~$span.text();
          if (time > 1) {
            $span.text(--time);
          } else {
            $sendAgain.removeClass('hide').siblings().addClass('hide');
            clearInterval(self.sendTime);
          }
        }, 1000);
      }

      function _getCode() {
        var intlCode = $('#intlCode').val() || '';
        var $form = $(this).parents('form');
        var postData = {
          intlCode: intlCode,
          tel: $('[name="username"]', $form).val(),
          identify_code: $('[name="identify_code"]', $form).val(),
          is_login: 1
        };

        /bind\/weixin/.test(window.location.href) && (postData.is_login = 0);

        self.sendCode(postData, _intervalTime.bind(this));
      }

      $('#getCode, #sendCodeAgain').click(function() {
        var _ = this;
        var $form = $(this).parents('form');
        var $inputs = $('input', $form);
        var status = _checkData($inputs.not('[name="password"]'), $form, true);
        var $identify;

        if (status) {
          $identify = $inputs.filter('[name="identify_code"]');
          if ($identify.length) {
            self.needCaptcha(function(need) {
              if (need) {
                self.verifyCode($identify.val(), _getCode.bind(_));
              } else {
                _getCode.call(_);
              }
            });
          }
          return false;
        }
      });
    }
  };

  Passport.init();
});
