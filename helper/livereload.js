module.exports = function livereload(port) {

    var Util = {
        prepend: function(w, s) {
            return s + w;
        },
        append: function(w, s) {
            return w + s;
        },
        _html: function(str) {
            if (!str) {
                return false;
            }
            return /<[:_-\w\s\!\/\=\"\']+>/i.test(str);
        },
        exists: function(body) {
            if (!body) {
                return false;
            }
            return regex.test(body);
        },
        snip: function(body) {
            if (!body) {
                return false;
            }
            return (~body.lastIndexOf("/livereload.js"));
        },
        snap: function(body) {
            var _body = body;
            rules.some(function(rule) {
                if (rule.match.test(body)) {
                    _body = body.replace(rule.match, function(w) {
                        return rule.fn(w, snippet);
                    });
                    return true;
                }
                return false;
            });
            return _body;
        },
        accept: function(req) {
            var ha = req.headers["accept"];
            if (!ha) {
                return false;
            }
            return (~ha.indexOf("html"));
        },
        check: function(str, arr) {
            if (!str) {
                return true;
            }
            return arr.some(function(item) {
                if ((item.test && item.test(str)) || ~str.indexOf(item)) {
                    return true;
                }
                return false;
            });
        }
    };

    port = port || 35729;
    var ignore = [/\.js$/, /\.json$/, /\.css$/, /\.svg$/, /\.ico$/, /\.woff$/, /\.png$/, /\.jpg$/, /\.jpeg$/];
    var include = [/.*/];
    var html = Util._html;
    var rules = [{
        match: /<\/body>(?![\s\S]*<\/body>)/,
        fn: Util.prepend
    }, {
        match: /<\/html>(?![\s\S]*<\/html>)/,
        fn: Util.prepend
    }, {
        match: /<\!DOCTYPE.+>/,
        fn: Util.append
    }];
    var src = "' + (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + port + "/livereload.js?snipver=1";
    var snippet = "\n<script type=\"text/javascript\">//<![CDATA[\ndocument.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')\n//]]></script>\n";

    // helper functions
    var regex = (function() {
        var matches = rules.map(function(item) {
            return item.match.source;
        }).join('|');

        return new RegExp(matches);
    })();

    // middleware
    return function livereload(req, res, next) {
        if(req.url === "/build") {
            // 如果是构建页面则不需要实时刷新功能
            return next();
        }
        if (res._livereload) {
            return next();
        }
        res._livereload = true;

        var writeHead = res.writeHead;
        var write = res.write;
        var end = res.end;

        if (!Util.accept(req) || !Util.check(req.url, include) || Util.check(req.url, ignore)) {
            return next();
        }

        function restore() {
            res.writeHead = writeHead;
            res.write = write;
            res.end = end;
        }

        res.push = function(chunk) {
            res.data = (res.data || '') + chunk;
        };

        res.inject = res.write = function(string, encoding) {
            if (string !== undefined) {
                var body = string instanceof Buffer ? string.toString(encoding) : string;
                if (Util.exists(body) && !Util.snip(res.data)) {
                    res.push(Util.snap(body));
                    return true;
                } else if (html(body) || html(res.data)) {
                    res.push(body);
                    return true;
                } else {
                    restore();
                    return write.call(res, string, encoding);
                }
            }
            return true;
        };

        res.writeHead = function() {
            var headers = arguments[arguments.length - 1];
            if (headers && typeof headers === 'object') {
                for (var name in headers) {
                    if (/content-length/i.test(name)) {
                        delete headers[name];
                    }
                }
            }

            var header = res.getHeader('content-length');
            if (header) {
                res.removeHeader('content-length');
            }

            writeHead.apply(res, arguments);
        };

        res.end = function(string, encoding) {
            restore();
            var result = res.inject(string, encoding);
            if (!result) {
                return end.call(res, string, encoding);
            }
            if (res.data !== undefined && !res._header) {
                res.setHeader('content-length', Buffer.byteLength(res.data, encoding));
            }
            res.end(res.data, encoding);
        };
        next();
    };

};