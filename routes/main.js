var ueditor = require('ueditor'),
    path    = require('path');
module.exports = function (app) {

    //@formatter:off
    'use strict';
    //@formatter:on

    // 根路由
    app.get('/', function(req, res) {
        res.render('index.html');
        res.end();
    });

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
    app.get('/blog/essays.do', function(req, res) {
        res.render('blog/blog.html');
        res.end();
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

    // 博客路由
    app.get('/detail/:id', function(req, res) {
        res.render('blog/detail.html', {title: 'zhangsan'});
        res.end();
    });

    app.get('/blog/article.do', function(req, res) {
        res.render('blog/article.html');
        res.end();
    });

    app.get('/blog/diary.do', function(req, res) {
        res.render('blog/diary.html');
        res.end();
    });

    app.get('/blog/news.do', function(req, res) {
        res.render('blog/news.html');
        res.end();
    });

    // 后台管理路由
    app.get('/admin', function(req, res) {
        res.render('admin/login.html');
        res.end();
    });

    app.post('/admin', function(req, res) {
        res.set('Content-type', 'application/json');
        res.send({
            code: 0,
            success: true
        });
    });

    app.get('/admin/list.do', function(req, res) {
        res.render('admin/list.html',{id:123});
        res.end();
    });

    app.get('/edit/:id', function(req, res) {
        res.render('admin/edit.html');
        res.end();
    });

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

};