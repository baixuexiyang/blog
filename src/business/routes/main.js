var ueditor = require('ueditor'),
    path    = require('path'),
    querystring = require('querystring'),
    db = require('../dao/todoDao');
    var articleSize = require('../../config/page').articleSize;
    var adminSize = require('../../config/page').adminSize;
    var ObjectID = require('mongodb').ObjectID;
    var logger = require('../../config/log/app').helper;
    var Promise = require("bluebird");
    var def = Promise.defer();
    // querystring.stringify(obj[, sep][, eq][, options])
    // querystring.parse(str[, sep][, eq][, options])
    // querystring.escape
    // querystring.unescape


    /*var Promise = require("bluebird");
    var mongoskin = require("mongoskin");
    Object.keys(mongoskin).forEach(function(key) {
      var value = mongoskin[key];
      if (typeof value === "function") {
        Promise.promisifyAll(value);
        Promise.promisifyAll(value.prototype);
      }
    });
    Promise.promisifyAll(db);*/

function islogin(ck) {
    if(!ck) {
        return false;
    }
    return true;
};


module.exports = function (app) {

    //@formatter:off
    'use strict';
    //@formatter:on

    // 根路由
    app.get('/', function(req, res) {
        res.render('index.html');
        res.end();
    });


    /************************************************************************************************/
    /**
     * 首页路由
     * @param {/blog/essays.do} 博客
     * @param {/questions.do} 问答
     * @param {/tools/index.do} 在线工具
     * @param {/handlerbook.do} 手册
     * @param {/plugin.do} jQuery插件
     * @param {/games.do} 游戏
     * @param {/infor.do} 关于我
     */
    app.get('/blog/blog.do', function(req, res) {
        var total = 0, categorys, read, commit;
        Promise.resolve(db.article.total({}, function(err, results) {
            total = results.length;
        }))
        .then(db.category.list(function (err, results, next) {
                if(err) {
                    return next(err);
                }
                categorys = results;
        }))
        .then(db.article.searcher({}, {"read": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            read = results;
        }))
        .then(db.article.searcher({}, {"commit": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            commit = results;
        }))
        .then(db.article.list({status: '1'}, articleSize, function (err, results) {
            if(err) throw err;
            for(var i = 0, l = results.length; i < l; i++) {
                results[i].content = results[i].content.substr(0,800).replace(/<\/?[^>]*>/g, "");
            }
            res.render('blog/blog.html', {
                articles: results,
                categorys: categorys,
                title: '博客',
                dest: '/blog/page.do?page=',
                size: Math.ceil(total / articleSize),
                current: 1,
                read: read,
                commit: commit
            });
        }));
    });


    app.get('/blog/page.do', function(req, res) {
        var page = parseInt(req.query.page, 10);
        var total = 0, categorys, read, commit;
        Promise.resolve(db.article.total({}, function(err, results) {
            total = results.length;
        }))
        .then(db.category.list(function (err, results) {
                if(err) {
                    return next(err);
                }
                categorys = results;
        }))
        .then(db.article.searcher({}, {"read": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            read = results;
        }))
        .then(db.article.searcher({}, {"commit": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            commit = results;
        }))
        .then(db.article.pagination({}, articleSize, page - 1, function(err, results) {
            if(err) throw err;
            for(var i = 0, l = results.length; i < l; i++) {
                results[i].content = results[i].content.substr(0,800).replace(/<\/?[^>]*>/g, "");
            }
            res.render('blog/blog.html', {
                articles: results,
                categorys: categorys,
                title: '博客',
                dest: '/blog/page.do?page=',
                size: Math.ceil(total / articleSize),
                current: page,
                read: read,
                commit: commit
            });
        }));
    });





    app.get('/questions.do', function(req, res) {
        res.render('questions.html');
        res.end();
    });

    app.get('/tools/index.do', function(req, res) {
        res.render('tools/index.html');
        res.end();
    });

    app.get('/handlerbook.do', function(req, res) {
        res.render('handlerbook.html');
        res.end();
    });

    app.get('/plugin.do', function(req, res) {
        res.render('plugin/index.html');
        res.end();
    });

    app.get('/games.do', function(req, res) {
        res.render('games/index.html');
        res.end();
    });

    app.get('/infor.do', function(req, res) {
        res.render('infor.html');
        res.end();
    });


    /************************************************************************************************/
    // 博客路由
    app.get('/detail/:id', function(req, res) {
        var id = req.params.id;
        var obj_id = new ObjectID(req.params.id);
        var nexts, prevs, article, attribute = '', date = '', commit = '';
        if(req.cookies[id]) {
            db.article.detail(obj_id, function (err, results) {
                if(err) {
                    throw err;
                }
                attribute = results.attribute;
                date = results.date;
                article = results;
                if(attribute) {
                    Promise.resolve(db.article.next(date, attribute, function (err, nextRead) {
                        if(err) {
                            throw err;
                        }
                        nexts = nextRead;
                    }))
                    .then(db.article.prev(date, attribute, function(err, prevRead) {
                        if(err) {
                            throw err;
                        }
                        prevs = prevRead;
                        res.render('blog/detail.html', {
                            title: article.title,
                            article: article,
                            next: nexts[0] || [],
                            prev: prevs[0] || [],
                            commit: article.commit
                        });
                    }));
                }
            });

        } else {
            db.article.detail(obj_id, function (err, results, next) {
                if(err) {
                    return next(err);
                }
                attribute = results.attribute;
                date = results.date;
                article = results;
                if(attribute) {
                    Promise.resolve(db.article.next(date, attribute, function (err, nextRead, next) {
                        if(err) {
                            return next(err);
                        }
                        nexts = nextRead;
                    }))
                    .then(db.article.updateRead(obj_id, function(err, results, next) {
                        if(err) {
                            return next(err);
                        }
                        res.cookie(id, id, {maxAge: 365*24*60*60*1000});
                    }))
                    .then(db.article.prev(date, attribute, function(err, prevRead) {
                        if(err) {
                            throw err;
                        }
                        prevs = prevRead;
                        res.render('blog/detail.html', {
                            title: article.title,
                            article: article,
                            next: nexts[0] || [],
                            prev: prevs[0] || [],
                            commit: article.commit
                        });
                    }));
                }
            });
        }
    });

    // 提交评论
    app.post('/commit/add.json', function(req, res) {
        var data = querystring.parse(req.body.info);
        data.date = req.body.date;
        data.content = req.body.content;
        var obj_id = new ObjectID(data.article_id);
        db.article.updateCommit(obj_id, data, function(err, results) {
            if(err) {
                res.send({
                    code: 0,
                    success: false
                });
                return;
            }
            res.send({
                code: 0,
                success: true
            });
        });
    });

    // 随笔
    app.get('/blog/essays.do', function(req, res) {
        var total = 0, read, commit, categorys;
        Promise.resolve(db.article.total({"attribute": "essays"}, function(err, results) {
            total = results.length;
        }))
        .then(db.category.list(function (err, results, next) {
            if(err) {
                return next(err);
            }
            categorys = results;
        }))
        .then(db.article.searcher({}, {"read": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            read = results;
        }))
        .then(db.article.searcher({}, {"commit": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            commit = results;
        }))
        .then(db.article.list({attribute: {$regex: 'essays', $options: 'i'}, status: '1'}, articleSize, function (err, results) {
            if(err) throw err;
            for(var i = 0, l = results.length; i < l; i++) {
                results[i].content = results[i].content.substr(0,800).replace(/<\/?[^>]*>/g, "");
            }
            res.render('blog/blog.html', {
                articles: results,
                categorys: categorys,
                title: '随笔',
                dest: '/essays/page.do?page=',
                size: Math.ceil(total / articleSize),
                current: 1,
                read: read,
                commit: commit
            });
        }));
    });

    app.get('/essays/page.do', function(req, res) {
        var page = parseInt(req.query.page, 10);
        var total = 0, read, commit, categorys;
        Promise.resolve(db.article.total({"attribute": "essays"}, function(err, results) {
            total = results.length;
        }))
        .then(db.category.list(function (err, results, next) {
            if(err) {
                return next(err);
            }
            categorys = results;
        }))
        .then(db.article.searcher({}, {"read": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            read = results;
        }))
        .then(db.article.searcher({}, {"commit": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            commit = results;
        }))
        .then(db.article.pagination({"attribute": "essays"}, articleSize, page - 1, function(err, results) {
            if(err) throw err;
            for(var i = 0, l = results.length; i < l; i++) {
                results[i].content = results[i].content.substr(0,800).replace(/<\/?[^>]*>/g, "");
            }
            res.render('blog/blog.html', {
                articles: results,
                categorys: categorys,
                title: '随笔',
                dest: '/essays/page.do?page=',
                size: Math.ceil(total / articleSize),
                current: page,
                read: read,
                commit: commit
            });
        }));
    });

    // 文章
    app.get('/blog/article.do', function(req, res) {
        var total = 0, read, commit, categorys;
        Promise.resolve(db.article.total({"attribute": "article"}, function(err, results) {
            total = results.length;
        }))
        .then(db.category.list(function (err, results, next) {
            if(err) {
                return next(err);
            }
            categorys = results;
        }))
        .then(db.article.searcher({}, {"read": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            read = results;
        }))
        .then(db.article.searcher({}, {"commit": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            commit = results;
        }))
        .then(db.article.list({attribute: {$regex: 'article', $options: 'i'}, status: '1'}, articleSize, function (err, results) {
            if(err) throw err;
            for(var i = 0, l = results.length; i < l; i++) {
                results[i].content = results[i].content.substr(0,800).replace(/<\/?[^>]*>/g, "");
            }
            res.render('blog/blog.html', {
                articles: results,
                categorys: categorys,
                title: '文章',
                dest: '/article/page.do?page=',
                size: Math.ceil(total / articleSize),
                current: 1,
                read: read,
                commit: commit
            });
        }));
    });


    app.get('/article/page.do', function(req, res) {
        var page = parseInt(req.query.page, 10);
        var total = 0, read, commit, categorys;
        Promise.resolve(db.article.total({"attribute": "article"}, function(err, results) {
            total = results.length;
        }))
        .then(db.category.list(function (err, results, next) {
            if(err) {
                return next(err);
            }
            categorys = results;
        }))
        .then(db.article.searcher({}, {"read": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            read = results;
        }))
        .then(db.article.searcher({}, {"commit": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            commit = results;
        }))
        .then(db.article.pagination({"attribute": "article"}, articleSize, page - 1, function(err, results) {
            if(err) throw err;
            for(var i = 0, l = results.length; i < l; i++) {
                results[i].content = results[i].content.substr(0,800).replace(/<\/?[^>]*>/g, "");
            }
            res.render('blog/blog.html', {
                articles: results,
                categorys: categorys,
                title: '文章',
                dest: '/article/page.do?page=',
                size: Math.ceil(total / articleSize),
                current: page,
                read: read,
                commit: commit
            });
        }));
    });

    // 日记
    app.get('/blog/diary.do', function(req, res) {
        var total = 0, read, commit, categorys;
        Promise.resolve(db.article.total({"attribute": "diary"}, function(err, results) {
            total = results.length;
        }))
        .then(db.category.list(function (err, results, next) {
            if(err) {
                return next(err);
            }
            categorys = results;
        }))
        .then(db.article.searcher({}, {"read": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            read = results;
        }))
        .then(db.article.searcher({}, {"commit": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            commit = results;
        }))
        .then(db.article.list({attribute: {$regex: 'diary', $options: 'i'}, status: '1'}, articleSize, function (err, results) {
            if(err) throw err;
            for(var i = 0, l = results.length; i < l; i++) {
                results[i].content = results[i].content.substr(0,800).replace(/<\/?[^>]*>/g, "");
            }
            res.render('blog/blog.html', {
                articles: results,
                categorys: categorys,
                title: '日记',
                dest: '/diary/page.do?page=',
                size: Math.ceil(total / articleSize),
                current: 1,
                read: read,
                commit: commit
            });
        }));
    });


    app.get('/diary/page.do', function(req, res) {
        var page = parseInt(req.query.page, 10);
        var total = 0, read, commit, categorys;
        Promise.resolve(db.article.total({"attribute": "diary"}, function(err, results) {
            total = results.length;
        }))
        .then(db.category.list(function (err, results, next) {
            if(err) {
                return next(err);
            }
            categorys = results;
        }))
        .then(db.article.searcher({}, {"read": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            read = results;
        }))
        .then(db.article.searcher({}, {"commit": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            commit = results;
        }))
        .then(db.article.pagination({"attribute": "diary"}, articleSize, page - 1, function(err, results) {
            if(err) throw err;
            for(var i = 0, l = results.length; i < l; i++) {
                results[i].content = results[i].content.substr(0,800).replace(/<\/?[^>]*>/g, "");
            }
            res.render('blog/blog.html', {
                articles: results,
                categorys: categorys,
                title: '日记',
                dest: '/diary/page.do?page=',
                size: Math.ceil(total / articleSize),
                current: page,
                read: read,
                commit: commit
            });
        }));
    });

    // 新闻
    app.get('/blog/news.do', function(req, res) {
        var total = 0, read, commit, categorys;
        Promise.resolve(db.article.total({"attribute": "news"}, function(err, results) {
            total = results.length;
        }))
        .then(db.category.list(function (err, results, next) {
            if(err) {
                return next(err);
            }
            categorys = results;
        }))
        .then(db.article.searcher({}, {"read": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            read = results;
        }))
        .then(db.article.searcher({}, {"commit": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            commit = results;
        }))
        .then(db.article.list({attribute: {$regex: 'news', $options: 'i'}, status: '1'}, articleSize, function (err, results) {
            if(err) throw err;
            for(var i = 0, l = results.length; i < l; i++) {
                results[i].content = results[i].content.substr(0,800).replace(/<\/?[^>]*>/g, "");
            }
            res.render('blog/blog.html', {
                articles: results,
                categorys: categorys,
                title: '新闻',
                dest: '/news/page.do?page=',
                size: Math.ceil(total / articleSize),
                current: 1,
                read: read,
                commit: commit
            });
        }));
    });


    app.get('/news/page.do', function(req, res) {
        var page = parseInt(req.query.page, 10);
        var total = 0, read, commit, categorys;
        Promise.resolve(db.article.total({"attribute": "news"}, function(err, results) {
            total = results.length;
        }))
        .then(db.category.list(function (err, results, next) {
            if(err) {
                return next(err);
            }
            categorys = results;
        }))
        .then(db.article.searcher({}, {"read": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            read = results;
        }))
        .then(db.article.searcher({}, {"commit": -1, date: -1}, 5, function (err, results) {
            if(err) throw err;
            commit = results;
        }))
        .then(db.article.pagination({"attribute": "news"}, articleSize, page - 1, function(err, results) {
            if(err) throw err;
            for(var i = 0, l = results.length; i < l; i++) {
                results[i].content = results[i].content.substr(0,800).replace(/<\/?[^>]*>/g, "");
            }
            res.render('blog/blog.html', {
                articles: results,
                categorys: categorys,
                title: '新闻',
                dest: '/news/page.do?page=',
                size: Math.ceil(total / articleSize),
                current: page,
                read: read,
                commit: commit
            });
        }));
    });


    /***********************************************************************************************************/
    // 后台管理路由
    app.get('/admin', function(req, res) {
        if(req.cookies['login']) {
            var articles, categorys;
            var total = 0;
            Promise.resolve(db.article.total('', function (err, results, next) {
                total = results.length;
            }))
            .then(db.article.list({}, adminSize, function (err, results, next) {
                if (err) {
                    return next(err);
                }
                articles = results;
            }))
            .then(db.category.list(function (err, results, next) {
                if(err) {
                    return next(err);
                }
                categorys = results;
                res.render('admin/list.html', {
                    articles: articles || [],
                    categorys: categorys,
                    title: '后台管理',
                    dest: '/admin/page.do?page=',
                    size: Math.ceil(total / adminSize),
                    current: 1
                });
            }));
        } else {
            res.render('admin/login.html');
        }
    });

    app.post('/admin/login.json', function(req, res) {
        var blogname       = req.body.username,
            blogpassword   = req.body.password,
            reblogpassword = req.body.repassword;
        if(!blogname) {
            res.send({
                code: 0,
                success: false,
                info: '请输入用户名'
            });
            return;
        }
        if(!blogpassword) {
            res.send({
                code: 0,
                success: false,
                info: '请输入密码'
            });
            return;
        }
        if(blogpassword !== reblogpassword) {
            res.send({
                code: 0,
                success: false,
                info: '两次输入的密码不一致'
            });
            return;
        }
        db.bloguser.searcher({blogname: blogname, blogpassword: blogpassword}, function(err, results) {
            if(err) throw err;
            if(!results) {
                res.send({
                    code: 0,
                    success: false,
                    info: '用户不存在'
                });
            } else {
                res.cookie('login', true, {maxAge: 60*60*1000});
                res.send({
                    code: 0,
                    success: true
                });
            }
        });

    });

    app.get('/admin/list.do', function(req, res) {
        if(!islogin(req.cookies['login'])) {
            res.render('admin/login.html');
            return;
        }
        var articles, categorys;
        var total = 0;
        Promise.resolve(db.article.total('', function(err, results) {
            total = results.length;
        }))
        .then(db.category.list(function (err, results) {
            if(err) {
                return next(err);
            }
            categorys = results;

        }))
        .then(db.article.list({}, adminSize, function (err, results) {
            if (err) {
                return next(err);
            }
            articles = results;
            res.render('admin/list.html', {
                articles: articles,
                categorys: categorys,
                title: '后台管理',
                dest: '/admin/page.do?page=',
                size: Math.ceil(total / adminSize),
                current: 1
            });
        }));
    });


    app.get('/admin/page.do', function(req, res) {
        var page = parseInt(req.query.page, 10);
        var total = 0, categorys;
        Promise.resolve(db.category.list(function (err, results) {
            if(err) throw err;
            categorys = results;
        }))
        .then(db.article.total('', function(err, results) {
            total = results.length;
        }))
        .then(db.article.pagination({}, adminSize, page - 1, function (err, results) {
            if(err) throw err;
            res.render('admin/list.html', {
                articles: results,
                categorys: categorys,
                title: '后台管理',
                dest: '/admin/page.do?page=',
                size: Math.ceil(total / adminSize),
                current: page
            });
        }));
    });


    // 根据分类显示列表
    app.get('/category/:id', function(req, res) {
        var articles, categorys, attr;
        var total = 0, name = '';
        var obj_id = new ObjectID(req.params.id);
        Promise.resolve(db.article.total({category: {$regex: req.params.id, $options: 'i'}}, function(err, results) {
            if(err) throw err;
            total = results.length;
        }))
        .then(db.article.searcher({category: {$regex: req.params.id, $options: 'i'}}, {date: -1}, adminSize, function (err, results) {
            if(err) throw err;
            articles = results;
        }))
        .then(db.category.findName({"_id": obj_id}, function(err, results) {
            if(err) throw err;
            attr = results[0];
        }))
        .then(db.category.list(function (err, results) {
            if(err) throw err;
            categorys = results;
            res.render('admin/list.html', {
                articles: articles,
                categorys: categorys,
                title: attr.name,
                dest: '/category/'+attr._id.toString()+'/page.do?page=',
                size: Math.ceil(total / adminSize),
                current: 1
            });
        }));
    });

    app.get('/category/:id/page.do', function(req, res) {
        var page = parseInt(req.query.page, 10);
        var obj_id = new ObjectID(req.params.id);
        var total = 0, categorys, category;
        Promise.resolve(db.category.list(function (err, results) {
            if(err) throw err;
            categorys = results;
        }))
        .then(db.category.findName({"_id": obj_id}, function(err, results) {
            if(err) throw err;
            category = results[0];
        }))
        .then(db.article.total({category: {$regex: req.params.id, $options: 'i'}}, function(err, results) {
            total = results.length;
        }))
        .then(db.article.pagination({category: {$regex: req.params.id, $options: 'i'}}, adminSize, page - 1, function (err, results) {
            if(err) throw err;
            res.render('admin/list.html', {
                articles: results,
                categorys: categorys,
                title: category.name,
                dest: '/category/'+category._id.toString()+'/page.do?page=',
                size: Math.ceil(total / adminSize),
                current: page
            });
        }));
    });

    app.get('/articles/edit/:id', function(req, res) {
        var obj_id = new ObjectID(req.params.id);
        db.article.detail(obj_id, function(err, articles) {
            if(err) {
                return next(err);
            }
            db.category.list(function (err, results) {
                if(err) {
                    return next(err);
                }
                res.render('admin/edit.html', {
                    _id: req.params.id,
                    categorys: results,
                    article: articles,
                    title: articles.title
                });
            });
        });
    });

    app.post('/articles/edit/:id', function(req, res) {
        var obj_id = new ObjectID(req.params.id);
        db.article.detail(obj_id, function(err, results) {
            if(err) {
                res.send({
                    code: 0,
                    success: false
                });
            } else {
                res.send({
                    code: 0,
                    success: true,
                    data: results
                })
            }
        });
    });

    app.post('/articles/update/:id', function(req, res) {
        var obj_id = new ObjectID(req.params.id);
        db.article.update(obj_id, req.body.article, function(err, results) {
            if(err) {
                res.send({
                    code: 0,
                    success: false
                });
                return next(err);
            }
            res.send({
                code: 0,
                success: true
            });
        });
    });

    app.post('/articles/delete/:id', function(req, res) {
        var obj_id = new ObjectID(req.params.id);
        db.article.deleted({'_id': obj_id}, function(err, results) {
            if(err) {
                return next(err);
            }
            res.send({
                code: 0,
                success: true
            });
        });
    });


    app.get('/essay/add.html', function(req, res) {
        db.category.list(function (err, results) {
            if(err) {
                return next(err);
            }
            res.render('admin/add.html', {
                categorys: results,
                title: "新增随笔"
            });
        });
    });

    app.post('/essay/add.json', function(req, res) {
        req.body.article.read = parseInt(req.body.article.read, 10);
        req.body.article.commit = [];
        db.article.add(req.body.article, function (err) {
            if(err) {
                res.send({
                    code: 0,
                    success: false
                });
            } else {
                res.send({
                    code: 0,
                    success: true
                })
            }
        });
    });



    // 后台管理-分类
    app.get('/category.do', function(req, res) {
        db.category.list(function (err, results) {
            if(err) {
                throw err;
            }
            res.render('admin/category.html', {
                categorys: results,
                title: "随笔分类"
            });
        });
    });

    app.post('/category/add.json', function(req, res) {
        var data = {
            name: req.body.title,
            description: req.body.description
        }
        db.category.findName({name: req.body.title}, function(err, results) {
            if(results[0]) {
                res.send({
                    code: 0,
                    success: false,
                    info: '类别已经存在'
                });
                return;
            }
            db.category.add(data, function(err, results) {
                if(err) {
                    res.send({
                        code: 0,
                        success: false
                    });
                } else {
                    res.send({
                        code: 0,
                        success: true
                    });
                }
            });
        })
    });

    app.post('/category/edit.json', function(req, res) {
        var obj_id = new ObjectID(req.body._id);
        var data = {
            "name": req.body.title,
            "description": req.body.description
        };
        db.category.update(obj_id, data, function(err, results) {
            if(err) {
                res.send({
                    code: 0,
                    success: false
                });
            } else {
                res.send({
                    code: 0,
                    success: true
                })
            }
        });
    });

    app.post('/category/delete/:id', function(req, res) {
        var obj_id = new ObjectID(req.params.id);
        Promise.resolve(db.article.deleted({"category": req.params.id}, function(err, results, next) {
            if(err) {
                return next(err);
            }
        }))
        .then(db.category.deleted(obj_id, function(err, results) {
            if(err) {
                res.send({
                    code: 0,
                    success: false
                });
            } else {
                res.send({
                    code: 0,
                    success: true
                });
            }
        }));
    });








    /****************************************************************************************************/
    // 在线工具路由
    app.get('/tools/json.do', function(req, res) {
        res.render('json/index.html');
        res.end();
    });

    app.get('/tools/json_download.do', function(req, res) {
        res.render('json/download.html');
        res.end();
    });

    app.get('/tools/json_upload.do', function(req, res) {
        res.render('json/upload.html');
        res.end();
    });



    /*****************************************************************************************************/
    // JSON数据请求
    app.post(/.*\.json/i, function(req, res) {
        'use strict';
        var info = req.body.info;
        info = querystring.parse(info);
        var content = req.body['content'];
        console.log(info.name+'==='+content);
        res.set('Content-type', 'application/json');
        res.sendfile(path.join('.', req.path));
    });
    app.get(/.*\.json/i, function(req, res) {
        'use strict';
        res.set('Content-type', 'application/json');
        res.sendfile(path.join('.', req.path));
    });


    /**************************************************************************************************/
    // 素材路由
    app.get(/\/plugin\/.*/, function(req, res) {
        res.render(req.url.substr(1));
        res.end();
    });

};

