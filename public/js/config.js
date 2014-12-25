seajs.config({
    // 映射,添加版本号
    map: [
         [ /^(.*\.(?:css|js))$/i, '$1?v=0.0.1' ]
    ],
    // 别名配置
    alias: {
        'jquery': 'lib/jquery/src/jquery-1.10.1.min',
        'placeholder': 'lib/placeholder/src/jquery.placeholder'
    },
    // 预加载项
    preload: ["jquery"],
    // 文件编码
    charset: 'utf-8'
});
