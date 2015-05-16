define(function(require, exports, module) {
    "use strict";

    $.extend({
        /**
         * 兼容key没有双引括起来的JSON字符串解析
         * @param  {[string]} str [JSON字符串]
         * @return {[Object]}
         */
        decoedJson: function(str) {
            if(str) {

            }
                    $str = preg_replace('/(\w+):/is', '"$1":', $str);
                }
                return json_decode($str, $mode);
        }
    });


    $.fn.extend({

    });
});