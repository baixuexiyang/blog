module.exports = function (app) {
    
    //@formatter:off
    'use strict';
    //@formatter:on

    app.get('/', function(req, res) {
        res.render('main/index.html');
    });

    app.get('/admin', function(req, res) {
        res.render('main/login.html');
    });

    app.post('/user', function(req, res) {
        res.set('Content-type', 'application/json');
        res.send({
            code: 0
        });
        res.render('list.html');
    });
};