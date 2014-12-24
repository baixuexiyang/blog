var pkgCfg = require('../package.json');
module.exports = {
    debug: true,
    name: 'xiyangbaixue',
    description: 'xiyangbaixue blog',
    version: pkgCfg.version,
    sessionSecret: 'xiyangbaixue',
    authCookieName: 'xiyangbaixue',
    liveReload: false,
    host: '127.0.0.1',
    port: 3001
};
