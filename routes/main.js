module.exports = function (app) {

    //@formatter:off
    'use strict';
    //@formatter:on

    // 根路由
    app.get('/', function(req, res) {
        res.render('main/index.html');
        res.end();
    });

    // 首页路由
    app.get('/handlerbook.html', function(req, res) {
        res.render('handlerbook.html');
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