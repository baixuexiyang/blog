var SuperValidator = {
    'form-add-category': {
        'title': {required: "请输入类别名称！"}
    },
    'form-edit-category': {
        "title": {required: "请输入类别名称！"}
    },
    'form-add-article': {
        "title": {
            required: "请输入文章标题！"
        },
        "author": {
            required: "请输入作者！"
        },
        "tags": {
            required: "请输入标签！"
        }
    },
    'form-edit-article': {
        "title": {
            required: "请输入文章标题！"
        },
        "author": {
            required: "请输入作者！"
        },
        "tags": {
            required: "请输入标签！"
        }
    },
    'form-commit-info': {
        "name": {
            required: "请输入姓名！"
        },
        "email": {
            required: "请输入邮箱！",
            email: function(v) {
                if(v && !/[\w!#$%&'*+\/=?^_`{|}~-]+(?:\.[\w!#$%&'*+\/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(v)) {
                    return "请输入合法的邮箱地址！";
                }
                return true;
            }
        },
        "site": {
            site: function(v) {
                if(v && !/[a-zA-z]+:\/\/[^\s]*/.test(v)) {
                    return "请输入合法的网址！";
                }
            }
        }
    },
    'form-user-login': {
        'value_1': {
            required: '请输入用户名！'
        },
        'value_2': {
            required: '请输入密码！'
        },
        'value_3': {
            required: '请再次输入密码！'
        }
    }
};