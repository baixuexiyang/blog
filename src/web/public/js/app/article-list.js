define(function(require, exports, moudle) {
    "use strict";
    var blog = {
        init: function() {
            // 多行显示省略号
            $(".content").each(function(i){
                var divH = $(this).height();
                var $p = $("div", $(this)).eq(0);
                while ($p.outerHeight() > divH) {
                    $p.text($p.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));
                };
                $p.text($p.text().replace(/<(\S*?)[^>]*>|<.*? \/>/, ""));
                $p.text($p.text().replace(/\s/g," "));
            });
        },
        main: function() {
            blog.init();
        }
    };
    blog.main();
});