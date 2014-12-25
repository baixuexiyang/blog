/**
 * 主模块
 * @date   2014-12-25
 * @author  'xiyangbaixue'
 */
define("main", [], function(require, exports, module) {

    "use strict";
    window.snow = {
        apiUrl : 'http://127.0.0.1:3001'
    };

    var dispatcher = $('#dispatcher').val();
    switch(dispatcher) {
        case 'login':
            require.async('./app/login.js');
            break;
    }

});