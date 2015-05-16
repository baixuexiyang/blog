/**
 * 通用路由
 * @author xiyangbaixue
 * @since 2015-1-21
 */
module.exports = function (app) {
    'use strict';
    app.get(/jqueryHandler.html/, function(req,res,next) {
        res.render('jquery.html');
        res.end();
    });
    app.get(/javascriptHandler.html/, function(req,res,next) {
        res.render('javascript.html');
        res.end();
    });

    //错误路由:404
    app.use(function (req, res, next) {
        var err = new Error ('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function (err, req, res, next) {
        if (req.xhr) {
            res.status(err.status || 404).set('Content-type', 'application/json');
            res.send({
                status: err.status || 404,
                code: 1,
                message: err.message || 'Not Found'
            });
        } else {
            res.status(err.status || 404).set('Content-type', 'text/html');
            res.render('main/error.html', {
                status: err.status || 404,
                message: err.message || 'Not Found'
            });
        }
    });
};
