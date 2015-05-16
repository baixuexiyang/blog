seajs.config({
    // 映射,添加版本号
    map: [
         [ /^(.*\.(?:css|js))$/i, '$1?v=0.0.1' ]
    ],
    // 别名配置
    alias: {
        'jquery': 'lib/jquery/src/jquery-1.10.1.min',
        'placeholder': 'lib/placeholder/src/jquery.placeholder',
        'angular': 'lib/angular/angular.min',
        'formatDate': 'lib/formatDate/main',    // 日期格式化插件
        'template': 'lib/template/jquery.tmpl.min',
        'artdialog': 'lib/artdialog/main',     // 对话框
        'dialogTools': 'lib/artdialog/plugins/iframeTools',
        'poshytip': 'lib/poshytip/main',
        'formValidate': 'lib/formValidate/app.js',
        'validatorMsg': 'validator-msg',
        'kendo-ui': 'lib/kendo/js/kendo.all'
    },
    // 预加载项
    preload: ["jquery"],
    // 文件编码
    charset: 'utf-8'
});
