define(function(require, exports, module) {
    "use strict";

    require('formValidate');
    require('formatDate');
    var dialog = require('artdialog');
    var pop = new dialog();


    var detail = {
        init: function() {
            $(window).scroll(function(){
                $(window).scrollTop() > 0 ? $('.scrollup').show() : $('.scrollup').hide();
            });
            $('.scrollup').click(function() {
                $("html, body").animate({
                    scrollTop:"0px"
                }, 'slow');
            });

            // 固定导航条
            var topMain=$("#header").height()+20//是头部的高度加头部与nav导航之间的距离
            var nav=$("#navigator");
            $(window).scroll(function(){
                if ($(window).scrollTop()>topMain){//如果滚动条顶部的距离大于topMain则就nav导航就添加类.nav_scroll，否则就移除
                    nav.addClass("nav_scroll");
                }else{
                    nav.removeClass("nav_scroll");
                }
            });
        },
        initUI: function() {
            UE.getEditor('editor', {
                toolbars: [
                    ['emotion', 'blockquote']
                ],
                autoHeightEnabled: false,
                autoFloatEnabled: true,
                maximumWords: 300,
                elementPathEnabled : false,
                saveInterval: 5000000000
            });
        },
        submitComment: function() {
            $('#submit-comment').on('click', function() {
                var tarForm = $('#form-commit-info');
                if(!tarForm.doValidate()) {
                    return false;
                }
                if(!UE.getEditor('editor').getContent()) {
                    pop.init({
                        content: "请输入评论内容！",
                        time: 500
                    });
                    return false;
                }
                var data = $.extend({info: $('#form-commit-info').serialize()}, {content: UE.getEditor('editor').getContent(), date: $.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')});
                $.ajax({
                    url: snow.apiUrl + '/commit/add.json',
                    data: data,
                    type: 'post'
                })
                .done(function(res) {
                    if(res.success) {
                        pop.init({
                            content: "评论成功！",
                            time: 500
                        });
                        setTimeout(function() {
                            location.reload();
                        }, 500);
                    } else {
                        pop.init({
                            content: '提交失败！',
                            time: 500
                        });
                    }
                });
            });
        },
        main: function() {
            this.init();
            this.initUI();
            this.submitComment();
        }
    };

    // 总入口
    detail.main();
});