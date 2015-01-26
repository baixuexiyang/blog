module.exports = function (app) {

    //@formatter:off
    'use strict';
    //@formatter:on

    app.get('/', function(req, res) {
        res.render('main/index.html');
        res.end();

    });

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
        res.render('admin/list.html');
        res.end();
    });

};