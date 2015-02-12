
var child = require('child_process'),
    iconv = require('iconv-lite'),
    path = require('path');
exports.init = function(config) {

    // 只用于本地开发
    if (process.platform !== 'win32') {
        return;
    }
    var task = config.liveReload ? 'watch' : 'watch:baseModules';
    var childProc = child.spawn('cmd.exe', ['/s', '/C', 'grunt', task, '--gruntfile', path.join(__dirname, '..', 'autobuild', 'Gruntfile.js'), '--force']);

    childProc.stdout.on('data', function(data) {
        data = iconv.decode(data, 'utf8');
        console.log(data);
    });
    childProc.stderr.on('data', function(data) {
        data = iconv.decode(data, 'utf8');
        console.log(data);
    });
    childProc.on('close', function(code) {
        console.log('Watching finished');
    });
};