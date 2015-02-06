/**
 * 主模块
 * @date   2014-12-25
 * @author  'xiyangbaixue'
 */
define("main", [], function(require, exports, module) {

    "use strict";

    var dispatcher = $('#dispatcher').val();
    switch(dispatcher) {
        case 'login':
            require.async('./app/login.js');
            break;
        case 'index':
            require.async('./app/index.js');
            break;
        case 'admin-list':
            require.async('./app/admin-list.js');
            break;
        case 'admin-edit':
            require.async('./app/admin-edit.js');
            break;
        case 'article-list':
            require.async('./app/article-list.js');
            break;
        case 'article-detail':
            require.async('./app/article-detail.js');
            break;
        default:
            break;
    }

    (function() {
        window.snow = {
            apiUrl : 'http://127.0.0.1:3001'
        };
        seajs.use('placeholder');
        // placeholder
        // $('[placeholder]').placeholder();

        // nicescroll


    })();
});