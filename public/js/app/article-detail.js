define(function(require, exports, module) {
    "use strict";

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
        },
        main: function() {
            this.init();
        }
    };

    // 总入口
    detail.main();
});