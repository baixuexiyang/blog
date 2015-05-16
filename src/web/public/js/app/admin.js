/**
 * 博文列表页面
 * @date   2015-01-27
 * @author xiyangbaixue
 */
define(function(require, exports, module) {

    "use strict";

    require('formatDate');
    require('template');
    require('formValidate');
    var dialog = require('artdialog');
    var pop = new dialog();


    var list = {
        init: function() {

        },
        editHandler: function() {
            if(!$('#model')[0]) {
                return false;
            }
            $.ajax({
                url: location.href,
                type: 'post'
            })
            .done(function(res) {
                if(res.success) {
                    var ipt = ['_id', 'title', 'author', 'tags'];
                    $.each(ipt, function(i, n) {
                        $('#'+n).val(res.data[n]);
                    });
                    $.each(res.data['category'].split(','), function(i, m) {
                        $('.category input[value='+ m +']').prop('checked', true);
                    });
                    $('.create input[value='+res.data.create+']').prop('checked', true);
                    $('.attribute input[value='+res.data.attribute+']').prop('checked', true);
                    ue.setContent(res.data.content);
                }
                if(!res.success) {
                    pop.alert('获取文章失败！');
                }
            });

            $('#edit-publish,#edit-draft,#edit-save').on('click', function() {
                var target = $('#form-edit-article');
                if(!target.doValidate()) {
                    return false;
                }
                if(!ue.getContent()) {
                    pop.alert('文章内容不能为空！');
                    return false;
                }
                var attribute = '', category = '', create = '';
                $('.category input:checked').each(function() {
                    category += this.value + ',';
                });
                var data = {
                    title: $('#title').val(),
                    content: ue.getContent(),
                    category: category.substring(0, category.length - 1),
                    attribute: $('.attribute input:checked').val(),
                    tags: $('#tags').val(),
                    status: parseInt($(this).data('value'), 10),
                    author: $('#author').val(),
                    create: $('.create input:checked').val()
                };
                var api = snow.apiUrl + '/articles/update/' + $('#_id').val();
                $.ajax({
                    url: api,
                    data: {article: data},
                    type: 'post'
                })
                .done(function(res) {
                    if(res.success) {
                        location.href = snow.apiUrl + '/admin/list.do';
                    } else {
                        pop.init({
                            content: '保存失败，请重试！',
                            time: 1
                        });
                    }
                })
                .fail(function() {

                });
            });
        },
        addHandler: function() {
            $('#publish,#draft').on('click', function(event) {
                var target = $('#form-add-article');
                if(!target.doValidate()) {
                    return false;
                }
                if(!ue.getContent()) {
                    pop.alert('文章内容不能为空！');
                    return false;
                }
                var attribute = '', category = '', create = '';
                $('.category input:checked').each(function() {
                    category += this.value + ',';
                });
                var data = {
                    title: $('#title').val(),
                    content: ue.getContent(),
                    category: category.substring(0, category.length - 1),
                    attribute: $('.attribute input:checked').val(),
                    tags: $('#tags').val(),
                    read: 0,
                    commit: 0,
                    status: $(this).data('value'),
                    date: $.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    author: $('#author').val(),
                    create: $('.create input:checked').val()
                };
                var api = snow.apiUrl + '/essay/add.json';
                $.ajax({
                    url: api,
                    data: {article: data},
                    type: 'post'
                })
                .done(function(res) {
                    if(res.success) {
                        location.href = snow.apiUrl + '/admin/list.do';
                    } else {
                        pop.init({
                            content: '保存失败，请重试！',
                            time: 1
                        });
                    }
                })
                .fail(function() {

                });
            });
        },
        deleteHandler: function() {
            $('.delete-article').on('click', function() {
                var _id = $(this).data('id')
                pop.confirm('确认删除？', function() {
                    var api = snow.apiUrl + '/articles/delete/' + _id;
                    $.ajax({
                        url: api,
                        type: 'post'
                    })
                    .done(function(res) {
                        if(res.success) {
                            pop.init({
                                content: '删除成功！',
                                time: 1
                            });
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        } else {
                            pop.init({
                                content: '删除失败！',
                                time: 1
                            });
                        }
                    });
                });
            });
        },
        categoryAdd: function() {
            $('#add-category').on('click', function() {
                var target = $('#form-add-category');
                if(!target.doValidate()) {
                    return false;
                }
                var api = snow.apiUrl + '/category/add.json';
                $.ajax({
                    url: api,
                    type: 'post',
                    data: target.serialize()
                })
                .done(function(res) {
                    if(res.success) {
                        pop.init({
                            content: '添加成功！',
                            time: 1
                        });
                        setTimeout(function() {
                            location.reload()
                        }, 1000);
                    } else {
                        pop.init({
                            content: res.info || '添加失败！',
                            time: 1
                        });
                    }
                });
            });
        },
        categoryEdit: function() {

            $('.category-edit').on('click', function() {
                var parent = $(this).parents('tr:first');
                var attribute = JSON.parse(parent.attr('data-attribute'));
                var templates = '<div class="category-template"><form action="" id="form-edit-category"><div>Title</div><input type="text" name="title" id="title" value="${name}"><div>Description</div><textarea name="description" id="" cols="30" rows="5">${description}</textarea><p><span class="btn add-edit">Save</span><span class="btn edit-cancel">cancel</span></p><input type="hidden" name="_id" value="${_id}" /></form></div>';
                $.template("category", templates);
                parent.after($.tmpl("category", attribute));
            });

            $(document).on('click', '.add-edit', function() {
                var target = $('#form-edit-category');
                if(!target.doValidate()) {
                    return false;
                }
                var api = snow.apiUrl + '/category/edit.json';
                $.ajax({
                    url: api,
                    type: 'post',
                    data: target.serialize()
                })
                .done(function(res) {
                    if(res.success) {
                        pop.init({
                            content: '修改成功！',
                            time: 1
                        });
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    } else {
                        pop.init({
                            content: '修改失败！',
                            time: 1
                        });
                    }
                });
            })
            .on('click', '.edit-cancel', function() {
                $(this).parents('.category-template').remove();
            });
        },
        categoryDelete: function() {
            $('.category-delete').on('click', function() {
                var id = $(this).parents('tr:first').data('id');
                pop.confirm('此分类下的文章也将会被删除，确认删除？', function() {
                    $.ajax({
                        url: snow.apiUrl + '/category/delete/'+id,
                        type: 'post'
                    })
                    .done(function(res) {
                        if(res.success) {
                            pop.init({
                                content: '删除成功！',
                                time: 1
                            });
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        } else {
                            pop.init({
                                content: '删除失败！',
                                time: 1
                            });
                        }
                    });
                });
            });
        },
        main: function() {
            this.init();
            this.editHandler();
            this.addHandler();
            this.deleteHandler();

            this.categoryAdd();
            this.categoryEdit();
            this.categoryDelete();
        }
    };
    list.main();
});
