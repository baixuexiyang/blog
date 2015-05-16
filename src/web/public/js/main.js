/**
 * 主模块
 * @date   2014-12-25
 * @author  'xiyangbaixue'
 */
define("main", [], function(require, exports, module) {

    // "use strict";

    require.async('./validator-msg.js');

    var dispatcher = $('#dispatcher').val();
    switch(dispatcher) {
        case 'login':
            require.async('./app/login.js');
            break;
        case 'index':
            require.async('./app/index.js');
            break;
        case 'admin':
            require.async('./app/admin.js');
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
        require('placeholder');

        if($('.pagination')[0]) {
            var total = $('.pagination').data('total');
            var current = $('.pagination').data('current');
            var size = $('.pagination').data('size');
            var html = "";
            //获取页数
            var size = Math.ceil(total / size);
            size = (size == 0 ? 1 : size);
            //生成前面的条数和页数部分html代码
            html += '共<span class="total">'+size+'</span>页:<span href=""><a href="">首页</a></span>';
            if(size > 1) {
                html += '<span href=""><a href="">上一页</a></span>';
            }
            //生成第一条数据连接
            html += '<div class="inbl"><a href="javascript:;" data-page="' + 1;
            if (current == 1) {
                html += "' class='now'>1</a>";
            } else {
                html += "'>1</a>";
            }
            if (size >= 1) {
                //大于两页时，下一页连接
                var nextPage;
                if (size == current) {
                    nextPage = '</div><span><a href="javascript:;" data-page="' + size + '">下一页</a></span>';
                } else {
                    nextPage = '</div><span><a href="javascript:;" data-page="' + (parseInt(current) + 1) + '">下一页</a></span>';
                }
                //算法
                html += page(size, current, nextPage);
            }
            // $(".pagination").html(html);

            function page(size, current, nextpage) {
                var html = "";
                //大于4页，分页将进行...的显示
                if (size > 4) {
                    //判断当前页和首页之间相差页数
                    if ((parseInt(current) - 1) > 1) {
                        if ((parseInt(current) - 1) > 2) {
                            html += "<i>......</i>";
                        }
                        if ((current - 1) > 1) {
                            html += "<a href='javascript:;' data-page='" + (parseInt(current) - 1) + "'>" + (parseInt(current) - 1) + "</a>";
                        }
                        html += "<a href='javascript:;' data-page='" + current + "' class='now'>" + current + "</a>";
                    } else if (current > 1) {
                        html += "<a href='javascript:;' data-page='" + current + "' class='now'>" + current + "</a>";
                    }
                    //当前页之后的部分
                    if ((size - current) > 2) {
                        html += "<a href='javascript:;' data-page='" + (parseInt(current) + 1) + "'>" + (parseInt(current) + 1) + "</a>";
                        html += "<i>......</i>";
                        html += "<a href='javascript:;' data-page='" + size + "'>" + size + "</a>";
                        html += nextpage;
                    } else {
                        if (parseInt(current) + 2 == size) {
                            html += "<a href='javascript:;' data-page='" + (parseInt(current) + 1) + "'>" + (parseInt(current) + 1) + "</a>";
                            html += "<a href='javascript:;' data-page='" + size + "'>" + size + "</a>";
                        } else if (parseInt(current) + 1 == size) {
                            html += "<a href='javascript:;' data-page='" + size + "'>" + size + "</a>";
                        }
                        html += nextpage;
                    }
                } else {
                    if (current >= 1) {
                        //补齐首页和current页中间的html代码
                        for (var i = 2; i <= current; i++) {
                            html += "<a href='javascript:;'data-page='" + i + "'";
                            if (i == current) {
                                html += " class='now' ";
                            }
                            html += ">" + i + "</a>"
                        }
                        //追加current和last也之间的html代码
                        for (i = parseInt(current) + 1; i <= size; i++) {
                            html += "<a href='javascript:;'data-page='" + i + "'>" + i + "</a>"
                        }
                        html += nextpage;
                    }
                }
                return html;
            }
        }

        // placeholder
        // $('[placeholder]').placeholder();

        // nicescroll


    })();
});