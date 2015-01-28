/**
 * 博文列表页面
 * @date   2015-01-27
 * @author xiyangbaixue
 */
define(function(require, exports, module) {

    "use strict";

    var list = {
        init: function() {
            $('.edit').click(function() {
                var api = snow.apiUrl + '/edit/' + $(this).data('id');
                $.ajax({
                    url: api,
                })
                .done(function(res) {
                    
                });
            });
        },
        main: function() {
            this.init();
        }
    };
    list.main();
});
