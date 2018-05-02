  (function ($) {
    var selecter = {
      init: function (options) {
        return (function () {
          selecter.fillHtml();
          selecter.bindEvent(options);
        })()
      },

      fillHtml: function (model, options) {
        return (function () {
          var model_select = '<ul class="model-select">';
          if (!model) {
            return;
          }

          $.each(options, function (item, index) {
            if ('object' === typeof index) {
              model_select += '<li class="select-item "> <span class="select-text">' + item +
                '</span> <em class="arrow"></em></li>';
            } else {
              model_select += '<li class="select-item">' + item + '</li>';
            }
          })
          model_select += '</ul>';
          model.append(model_select);

        })()
      },

      bindEvent: function (options) {
        return (function () {
          $(".btn-box").off('click');
          $(".model-selects").off('click', '.select-item');
          $(".btn-box").on('click', function () {
            var model_select = $(this).parent().find('.model-selects .model-select');
            var model_selects = $(this).parent().find('.model-selects');
            if (!$(this).hasClass('active')) {
              $(this).addClass('active');
              if (model_select.length > 0) {
                $(this).parent().find('.model-selects .model-select').show();
              } else {
                selecter.fillHtml(model_selects, options);
              }
            } else {
              $(this).removeClass('active');
              $(this).parent().find('.model-selects .model-select').hide();
            }
          });
          $(".model-selects").on('click', '.select-item', function (e) {
            var text = $(this).find('.select-text').text();
            var self = $(this);
            var nextAll = $(this).parent().nextAll();
            var e = e || window.event;
            e.stopPropagation();
            if (nextAll) {
              nextAll.remove();
            }
            if (text) { //继续分级
              var prev = $(this).parent().prev('ul').find('.active').find('.select-text').text();
              var model_selects = $(this).parents('.select-content').find('.model-selects');
              $.each(options, function (item, index) {
                if (text === item) {
                  selecter.fillHtml(model_selects, options[text]);
                } else {
                  if ('object' == typeof index) {
                    $.each(index, function (item, index2) {
                      if (text === item) {
                        selecter.fillHtml(model_selects, index[text]);
                      }
                    })
                  }
                }
              });
            } else { // 结束关闭
              var parent = $(this).parent();
              var prevs = parent.prevAll();
              var result = '所属分类：';
              var text = $(this).text();
              if (prevs.length === 0) {
                result += text;
              }
              if (prevs.length > 0) {
                for (var i = prevs.length - 1; i > -1; i--) {
                  var active = prevs.eq(i).find('.active');
                  var select_text = active.find('.select-text').text();
                  if (select_text) {
                    result += select_text + ">";
                  }
                }
                result += text;
              }
              console.log(result);
              $(".results").html(result);
              $(".btn-box").removeClass('active');
              $(this).parents('.model-selects').empty();
            }
            self.addClass('active').siblings('li').removeClass('active');
          });
          $('body').click(function (e) {
            var target = $(e.target);
            if (!target.is('.model-selects *') && !target.is('.btn-box')) {
              if ($('.model-selects').is(':visible')) {
                var active = $(".model-selects").find('.active');
                var result = '';
                if( active.length === 0) {
                  $(".btn-box").removeClass('active');
                  $('.model-selects').empty();
                  return;
                }
                if( active.length === 1) {
                  result = active.text();
                  $(".results").html("所属分类："+result);
                  $(".btn-box").removeClass('active');
                  $('.model-selects').empty();
                  return;
                }
                for (var i = active.length - 1; i > -1; i--){
                  var text = active.eq(i).text();
                  result += text + ">"
                }
                result = result.substr(0, result.length-1);
                $(".results").html("所属分类："+result);
                $(".btn-box").removeClass('active');
                $('.model-selects').empty();
              }
            }
          });
        })()
      }
    }

    $.fn.createSelect = function (opt) {
      var options = $.extend({
          '电子类': {
            '电子产品': {
              '二极管': '二极管',
              '电阻': '电阻',
              '电容': '电容'
            },
            '电子材料': '电子材料'
          },
          '服务类': {
            '服务产品': {
              '产品1': '产品1',
              '产品2': '产品2',
              '产品3': '产品3'
            },
            '服务工具': '服务工具'
          },
          '工程类': '工程类'
        },
        opt
      )
      selecter.init(options);
    }
  })(jQuery)
