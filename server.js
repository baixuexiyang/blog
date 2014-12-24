/**
 * 描述: Node 服务监控
 * 作者: 李洪波
 * 时间：2014年5月
 */

var forever = require('forever-monitor'),
    child = new(forever.Monitor)('index.js', {
        'max': 3,
        'silent': false,
        // 'pidFile': 'pids/app.pid',
        /*'killTree': true,
        'spawnWith': {
            customFds: [-1, -1, -1], // that forever spawns.
            setsid: false
        },*/
        'watch': true,
        'watchDirectory': '.', // Top-level directory to watch from.
        'watchIgnoreDotFiles': true, // whether to ignore dot files
        'watchIgnorePatterns': [
            'autobuild/**',
            'logs/**',
            'mockup/**',
            'node_mobules/**',
            'public/**',
            'views/**'
        ], // array of glob patterns to ignore, merged with contents of watchDirectory + '/.foreverignore' file
        'logFile': 'logs/forever.log',
        'outFile': 'logs/forever.out',
        'errFile': 'logs/forever.err'
    });

child.on('watch:restart', function(info) {
    console.error('Restaring script because ' + info.file + ' changed');
});

child.on('restart', function() {
    console.error('Forever restarting script for ' + child.times + ' time');
});

child.on('exit:code', function(code) {
    console.error('Forever detected script exited with code ' + code);
});

child.start();