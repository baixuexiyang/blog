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

    // 首页路由
    app.get('/handlerbook.html', function(req, res) {
        res.render('handlerbook.html');
        res.end();
    });

    app.get('/blog/essays.do', function(req, res) {
        res.render('blog/blog.html');
        res.end();
    });

    app.get('/infor.html', function(req, res) {
        res.render('infor.html');
        res.end();
    });

    app.get('/tools/index.html', function(req, res) {
        res.render('tools/index.html');
        res.end();
    });

    // 博客路由
    app.get('/detail/:id', function(req, res) {
        res.render('blog/detail.html');
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

    app.get('/list', function(req, res) {
        res.render('admin/list.html',{id:123});
        res.end();
    });

    app.get('/edit/:id', function(req, res) {
        res.render('admin/edit.html');
        res.end();
    });

};