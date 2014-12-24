/*jslint nomen:true*/
/*global console,process*/
/*global __dirname*/
/**
 * 主控制器
 * @author luoweiping
 * @version 1.4.0(2014-04-27)
 * @since 1.0.0(2014-04-05)
 */
//@formatter:off
var redisCfg = require('../config/redis'),
    buildCfg = require('../config/build'),
    cp = require('child_process'),
    iconv = require('iconv-lite'),
    path = require('path'),
    RedisStore = require('socket.io/lib/stores/redis'),
    redis = require('redis'),
    pub = redis.createClient(redisCfg.port, redisCfg.host),
    sub = redis.createClient(redisCfg.port, redisCfg.host),
    client = redis.createClient(redisCfg.port, redisCfg.host);
//@formatter:on

pub.auth(redisCfg.passwd, function (err) {
    //@formatter:off
    'use strict';
    //@formatter:on
    if (err) {
        // throw err;
        console.log(err);
    }
});
sub.auth(redisCfg.passwd, function (err) {
    //@formatter:off
    'use strict';
    //@formatter:on
    if (err) {
        // throw err;
        console.log(err);
    }
});
client.auth(redisCfg.passwd, function (err) {
    //@formatter:off
    'use strict';
    //@formatter:on
    if (err) {
        // throw err;
        console.log(err);
    }
});

/**
 * 直接发送json数据
 * @param {Object} socket socket对象
 * @param {String} task 待构建的任务名
 * @return {void}
 * @author luoweiping
 * @version 1.4.0(2014-04-27)
 * @since 1.0.0(2014-04-05)
 */
function doBuild (socket, task) {
    //@formatter:off
    'use strict';
    //@formatter:on
    var updateProc;
    if (process.platform === 'win32') {
        updateProc = cp.spawn('cmd.exe', ['/s', '/C', 'grunt', task || 'default', '--gruntfile', path.join(__dirname, '..', 'autobuild', 'Gruntfile.js'), '--force']);
    } else {
        updateProc = cp.spawn('grunt', [task || 'default', '--gruntfile', path.join(__dirname, '..', 'autobuild', 'Gruntfile.js'), '--force']);
    }

    socket.emit('ready', 'Going to building...<br/>');

    updateProc.stdout.on('data', function (data) {
        data = iconv.decode(data, 'utf8');
        console.log(data);
        socket.emit('log', data);
    });
    updateProc.stderr.on('data', function (data) {
        data = iconv.decode(data, 'utf8');
        console.log(data);
        socket.emit('failure', data);
    });
    updateProc.on('close', function (code) {
        console.log('Build finished with code ' + code);
        socket.emit('finish', 'Build finished with code ' + code);
    });
}

/**
 * 初始化socket.io
 * @param {Object} io socket.io对象
 * @return {void}
 * @author luoweiping
 * @version 1.4.0(2014-04-27)
 * @since 1.0.0(2014-04-05)
 */
exports.initSocket = function (io) {
    //@formatter:off
    'use strict';
    //@formatter:on
    // NODE_ENV=production node index
    if (buildCfg.env === 'development') {
        io.configure(function () {//'development'
            io.set('transports', ['websocket', 'flashsocket', 'xhr-polling']);
        });
    } else {
        io.configure(function () {//'production'
            io.enable('browser client minification');
            io.enable('browser client etag');
            io.enable('browser client gzip');
            io.set('log level', 1);
            io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
        });
    }

    io.set('store', new RedisStore ({
        redis: redis,
        redisPub: pub,
        redisSub: sub,
        redisClient: client
    }));

    io.sockets.on('connection', function (socket) {
        socket.emit('ready', buildCfg.welcomeMsg);

        socket.on('doBuild', function (data) {
            doBuild(socket, data);
        });
        socket.on('disconnect', function () {
            console.log('client ' + socket.id + ' is disconnect.');
        });
    });
};
