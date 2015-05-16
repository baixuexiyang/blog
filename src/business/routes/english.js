module.exports = function (app) {
    "use strict";

    app.get('/english.do', function(req, res) {
        res.render('english/index.html');
    });


};
