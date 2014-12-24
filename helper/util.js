/*jslint nomen:true*/
module.exports = {
    getRemoteIp:function(req){
        //@formatter:off
        'use strict';
        //@formatter:on
        return req.ip || 
            req._remoteAddress || 
            req.headers['x-real-ip'] || 
            req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress || 
            req.connection.socket.remoteAddress;
    }
};
