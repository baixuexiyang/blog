define(function(require, exports, module) {
    "use strict";

    require('poshytip');

    $.fn.doValidate = function(){
        var formID = $(this)[0].id;
        $('.error-area').removeClass('error-area');
        $('.error-tip').empty();
        if (!window.SuperValidator) {
            return true;
        }

        var showError = function(obj, msg) {
            obj.poshytip({
                className: 'tip-yellowsimple',
                content: msg,
                showOn: 'focus',
                showTimeout: 1,
                alignTo: 'target',
                alignX: 'center',
                offsetY: 5,
                allowTipHover: false
            });
            obj.focus();
            obj.addClass('error-area');
            // $('.error-tip').html(msg);
            return false;
        }
        var valids = window.SuperValidator[formID];
        if (valids) {
            for (var id in valids) {
                var validator = valids[id];
                if (!validator) {
                    continue;
                }
                var obj = $('#' + id);
                var msg = '';
                for (var k in validator) {

                    if (k === "required") {
                        if (!$.trim(obj.val())) {
                            msg = validator[k];
                            if (typeof(msg) === "string") {
                                showError(obj, msg);
                                return;
                            }
                        }
                    } else if ($.isFunction(validator[k])) {
                        msg = (validator[k])(obj.val());
                        if (typeof(msg) === "string") {
                            showError(obj, msg);
                            return;
                        }
                    }
                }
            }
        }
        return true;
    };
});