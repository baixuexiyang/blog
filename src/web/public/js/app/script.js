/**
 *@Author: ganzw@shterm.com
 *@Date: 2014-7-3
 */
jQuery(function($) {

    "use strict";

    /**
     *初始化节点数据
     */
    var treeview,
        datasource = [{
            "text"     : "节点数据",
            "sprite"   : "mcyi",
            "dataUrl"  : "#",
            "dataProp" : {}
        }];

    /**
     *删除数据多余的属性
     */
    function formatData(data) {
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i],
                ds   = _.omit(item, ["index", "selected", "expanded", "defaults"]);
            data[i] = ds;
            if (_.has(item, 'items')) {
                formatData(item.items);
            }
        }
        return data;
    }


    var createJSON = {
        init: function() {
            /**
             *节点数据初始化
             *刷页面时从localStorage获取
             */
            if (window.localStorage && localStorage.getItem('data')) {
                datasource = JSON.parse(localStorage.getItem('data'));
            }


            datasource = new kendo.data.HierarchicalDataSource({
                data: datasource
            });

            /**
             *左边树形结构初始化
             */
            $("#treeview").kendoTreeView({
                dataTextField           : "text",
                dataSpriteCssClassField : "sprite",
                dataUrlField            : "dataUrl",
                dragAndDrop             : true,
                dataSource              : datasource
            });

            /**
             *树节点
             */
            treeview = $("#treeview").data("kendoTreeView");
            treeview.expand(".k-item");

            return this;
        },
        eventHandle: function() {
            /**
             *添加子节点
             */
            $('#add-child').on('click', function() {
                var $sel = $('.k-item[aria-selected="true"]');
                if (!$sel[0]) {
                    return;
                }
                treeview.append({
                    text     : "子节点",
                    dataUrl  : "#",
                    sprite   : "cssClass",
                    dataProp : {}
                }, $sel);
            });

            /**
             *添加兄弟节点
             */
            $('#add-sibling').on('click', function() {
                var $sel = $('.k-item[aria-selected="true"]');
                if (!$sel[0]) {
                    return;
                }
                treeview.insertAfter({
                    text     : "兄弟节点",
                    dataUrl  : "#",
                    sprite   : "cssClass",
                    dataProp : {}
                }, $sel);
            });

            /**
             *删除节点
             */
            $('#del-node').click(function() {
                treeview.remove($('.k-item[aria-selected="true"]'));
            });

            /**
             *点击节点编辑
             */
            $(document).on('click', '.k-in', function() {
                var dataUid     = $('.k-item[aria-selected="true"]').data('uid'),
                    barDataItem = treeview.dataSource.getByUid(dataUid);

                $('#data-text').val(barDataItem.text);
                $('#data-class').val(barDataItem.sprite || '');
                $('#data-url').val(barDataItem.dataUrl || '');
                $('#data-prop').val(JSON.stringify(barDataItem.dataProp, null, 4) || '');
                return false;
            });

            /**
             *复制数据
             */
            $('#copy').zclip({
                path: '/js/lib/zeroclipboard/ZeroClipboard10.swf',
                copy: function() {
                    return JSON.stringify(formatData(treeview.dataSource.data()), null, 4);
                },
                beforeCopy: function() {
                    if ($('#json').text() === '') {
                        alert("请先生成数据！");
                        return false;
                    }
                },
                afterCopy: function() {
                    alert("复制成功！");
                }
            });

            /**
            *导入数据
            */
            /** 点击关闭 */
            var onClose = function() {
                var paste_data = $('#import textarea').val();
                if(paste_data === '') {
                    return;
                }
                try {
                    paste_data = JSON.parse(paste_data);
                } catch (e) {
                    alert("JSON数据格式错误！");
                    // $('#import').data('kendoWindow').show();
                    return false;
                }

                treeview.setDataSource(new kendo.data.HierarchicalDataSource({data: paste_data}));
                treeview.expand(".k-item");

                /** 保存到localStorage */
                if (window.localStorage) {
                    localStorage.setItem('data', JSON.stringify(paste_data));
                }
            };
            /** 点击导入数据 */
            $('#insert').click(function() {
                var context = $('#import');
                context.kendoWindow({
                    width    : '520px',
                    title    : "Import JSON Data",
                    actions  : ["Minimize","Maximize","Close"],
                    close    : onClose
                });
                context.data('kendoWindow').open().center();
            });

            return this;
        },
        produce: function() {
            var me = this;
            /**
             *点击生成
             */
            $('#create').click(function() {
                var json,
                    dataUid     = $('.k-item[aria-selected="true"]').data('uid'),
                    barDataItem = treeview.dataSource.getByUid(dataUid),
                    tarForm     = $('#form-edit-node'),
                    container,
                    editor;

                if (!dataUid) {
                    container           = document.getElementById("json");
                    container.innerHTML = '';
                    editor              = new JSONEditor(container);
                    editor.set(JSON.parse(JSON.stringify(formatData(treeview.dataSource.data()))));
                    me.saveData();

                    return this;
                }
                if (!tarForm.doValidate()) {
                    return this;
                }
                try {
                    json = JSON.parse(document.getElementById('data-prop').value || '{}');
                } catch (e) {
                    $('.error-text').html("JSON数据错误");
                    return false;
                }
                barDataItem.text     = decodeURI($('#data-text').val());
                barDataItem.sprite = $('#data-class').val();
                barDataItem.dataUrl      = $('#data-url').val();
                barDataItem.dataProp = json;
                treeview.dataSource.sync();
                treeview.expand(".k-item");
                container           = document.getElementById("json");
                container.innerHTML = '';
                editor              = new JSONEditor(container);
                editor.set(JSON.parse(JSON.stringify(formatData(treeview.dataSource.data()))));

                me.saveData();
            });
            return this;
        },
        showTips: function() {
            /**
             *鼠标悬上节点时加标记
             *@flag
             */
            $(document).off('mouseover').on('mouseover', '.k-item', function() {
                $('.k-item').removeClass('flag');
                $(this).addClass('flag');
                return false;
            });

            /**
             *鼠标悬停节点上显示节点数据信息
             */
            $('#treeview').kendoTooltip({
                filter   : '.k-in',
                position : 'right',
                content  : function(e) {
                    var uid = $('.flag').data('uid'),
                        barDataItem = treeview.dataSource.getByUid(uid),
                        str =
                          '<table class="tips">'       +
                          '<tr><td>text:</td><td>'     + barDataItem.text     + '</td></tr>' +
                          '<tr><td>sprite:</td><td>' + barDataItem.sprite + '</td></tr>' +
                          '<tr><td>dataUrl:</td><td>'      + barDataItem.dataUrl      + '</td></tr>' +
                          '<tr><td>dataProp:</td><td>' + (JSON.stringify(barDataItem.dataProp, null, 4) || "") + '</td></tr>' +
                          '</table>';
                    return str;
                }
            });
            return this;
        },
        saveData: function() {
            /** 本地保存数据 */
            if (window.localStorage) {
                localStorage.setItem('data', JSON.stringify(treeview.dataSource.data().toJSON()));
            }
        },
        main: function() {
            /** 入口 */
            this.init().eventHandle().produce().showTips();
        }
    };

    createJSON.main();
});
