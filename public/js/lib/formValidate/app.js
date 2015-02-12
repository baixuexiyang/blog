var SuperValidator = {
    'form-edit-node': {
        'data-text': {required: "请输入节点名称！"}
    }
};

$.fn.doValidate = function(){
    var formID = $(this)[0].id;
    $('.validate').removeClass('error-area');
    $('.error-text').empty();
    if (!SuperValidator) {
        return true;
    }

    var showError = function(obj, msg) {
        obj.focus();
        obj.addClass('error-area');
        if ($('.error-text').is(":hidden")) {
            $('.error-text').show();
        }
        $('.error-text').html(msg);
        return false;
    };
    var valids = SuperValidator[formID];
    if (valids) {
        for (var id in valids) {
            var validator = valids[id];
            if (!validator) {
                continue;
            }
            var obj = $('#' + id);
            if (obj.is(":hidden")) {
                continue;
            }
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