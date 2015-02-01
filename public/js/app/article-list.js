define(function(require, exports, moudle) {
    "use strict";
    var blog = {
        init: function() {
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

            // 多行显示省略号
            $(".content").each(function(i){
                var divH = $(this).height();
                var $p = $("p", $(this)).eq(0);
                while ($p.outerHeight() > divH) {
                    $p.text($p.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));
                };
            });
        },
        main: function() {
            blog.init();
        }
    };
    blog.main();
});