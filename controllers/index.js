var fs = require('fs'), path = require('path'), iconv = require('iconv-lite'), shownTypes = ['html', 'shtml'];
require('../business/main');
/**
 * 获取部分文件名
 * @param {Array} cats 目录数据
 * @param {Number} catIdx 目录索引
 * @return {Object} 目录树
 * @author luoweiping
 * @version 1.3.0(2014-04-22)
 * @since 1.3.0(2014-04-22)
 */
function getFilePartName (cats, catIdx) {
    //@formatter:off
    'use strict';
    //@formatter:on
    var i, partName = [];
    for ( i = 0; i <= catIdx; i += 1) {
        partName.push(cats[i]);
    }
    return partName.join('-');
}

/**
 * 生成目录树
 * @param {String} fileName 当前文件名
 * @param {Array} cats 目录数据
 * @param {Number} catIdx 目录索引
 * @param {Object} fileTree 生成的目录树
 * @return {Object} 目录树
 * @author luoweiping
 * @version 1.3.0(2014-04-22)
 * @since 0.1.1(2014-03-28)
 */
function getFileTree (fileName, cats, catIdx, fileTree) {
    //@formatter:off
    'use strict';
    //@formatter:on
    if (catIdx < cats.length) {
        if (!fileTree[cats[catIdx]]) {
            fileTree[cats[catIdx]] = {
                catName: cats[catIdx],
                fileName: fileName,
                fileNum: 1,
                level: catIdx + 1,
                children: {},
                parent: null
            };
        } else {
            fileTree[cats[catIdx]].fileNum += 1;
        }
        if (catIdx > 0) {
            fileTree[cats[catIdx]].parent = cats[catIdx - 1];
        }
        if (getFilePartName(cats, catIdx) === fileName) {
            fileTree[cats[catIdx]].children.leafPage = {
                catName: 'leafPage',
                fileName: fileName,
                fileNum: 1,
                level: catIdx + 1,
                children: {},
                parent: cats[catIdx]
            };
        } else {
            getFileTree(fileName, cats, catIdx + 1, fileTree[cats[catIdx]].children);
        }
    }
    return fileTree;
}

/**
 * 遍历目录树，生成树状HTML
 * @param {Array} fileTree 目录树
 * @param {Array} outFiles 输出HTML
 * @return {Array} 目录树HTML
 * @author luoweiping
 * @version 1.3.0(2014-04-20)
 * @since 0.1.1(2014-03-28)
 */
function iterateFiles (fileTree, outFiles) {
    //@formatter:off
    'use strict';
    //@formatter:on
    var fileIdx;
    outFiles.push('<li>');
    outFiles.push('<ul>');
    for (fileIdx in fileTree) {
        if (fileTree.hasOwnProperty(fileIdx)) {
            if (fileTree[fileIdx].fileNum < 2) {
                outFiles.push('<li><a href="' + fileTree[fileIdx].fileName + '">' + fileTree[fileIdx].fileName + '</a></li>');
            } else {
                outFiles.push('<li class="isFolder" level="' + fileTree[fileIdx].level + '"><span class="foldingChild collapseChild">↑</span><span class="foldingThis">-</span><span class="nodeText">' + fileTree[fileIdx].catName + '</span></li>');
                iterateFiles(fileTree[fileIdx].children, outFiles);
            }
        }
    }
    outFiles.push('</ul>');
    outFiles.push('</li>');
    return outFiles;
}

/**
 * 首页文件列表页面
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 1.3.0(2014-04-20)
 * @since 0.1.0(2014-03-11)
 */
exports.listFiles = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    fs.readdir('./views', function (err, files) {
        if (err) {
            console.log(err);
        }
        var outFiles = [], fileIdx, fileExt = '', curFile, typeIdx, shownFlag, fileTree = {}, fileTreeNodes = [], showLevel;
        //排序花费时间，转为拼音约需800-850ms，按GBK约需30ms
        files = files.sort(function (a, b) {
            a = iconv.decode(iconv.encode(a, 'gbk'), 'binary');
            b = iconv.decode(iconv.encode(b, 'gbk'), 'binary');
            return a > b ? 1 : -1;
        });
        for (fileIdx in files) {
            if (files.hasOwnProperty(fileIdx)) {
                shownFlag = false;
                curFile = files[fileIdx].split('.');
                fileExt = curFile[curFile.length - 1];
                curFile.pop();
                curFile = curFile.join('.');
                for ( typeIdx = 0; typeIdx < shownTypes.length; typeIdx += 1) {
                    if (fileExt === shownTypes[typeIdx] && curFile !== 'index') {
                        shownFlag = true;
                        break;
                    }
                }
                if (shownFlag) {
                    outFiles.push({
                        path: files[fileIdx],
                        name: curFile
                    });
                }
            }
        }
        for ( fileIdx = 0; fileIdx < outFiles.length; fileIdx += 1) {
            getFileTree(outFiles[fileIdx].name, outFiles[fileIdx].name.split('-'), 0, fileTree);
        }
        fileTreeNodes = iterateFiles(fileTree, []);
        fileTreeNodes.pop();
        fileTreeNodes.shift();

        showLevel = parseInt(req.query.level, 10) || req.cookies.level || 2;

        res.cookie('level', showLevel, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: '/',
            secure: false
        });
        res.render('main/index.html', {
            files: outFiles,
            fileTree: fileTreeNodes.join(''),
            level: showLevel
        });
    });
};

/**
 * 静态HTML/SHTML文件请求处理
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 0.1.0(2014-03-11)
 * @since 0.1.0(2014-03-11)
 */
exports.getHtml = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    var recursive = function (typeIdx) {
        var filename = req.params[1] ? req.params[0] + req.params[1] : req.params[0] + '.' + shownTypes[typeIdx], filepath = path.join('.', 'views', filename);
        if (typeIdx < shownTypes.length) {
            fs.exists(filepath, function (exists) {
                if (exists) {
                    res.render(filename, {
                        title: req.params[0]
                    });
                } else {
                    recursive(typeIdx + 1);
                }
            });
        } else {
            next();
        }
    };
    recursive(0);
};

/**
 * 静态PHP文件请求处理
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 0.1.0(2014-03-11)
 * @since 0.1.0(2014-03-11)
 */
exports.getPhp = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    fs.exists(path.join('.', 'views', req.params[0]), function (exists) {
        if (exists) {
            res.render(req.params[0]);
        } else {
            next();
        }
    });
};

/**
 * 压缩包文件列表页面
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 1.0.0(2014-04-22)
 * @since 1.0.0(2014-04-22)
 */
exports.listZip = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    fs.readdir('./public/zipped', function (err, files) {
        if (err) {
            console.log(err);
        }
        var outFiles = [], fileIdx, fileExt = '', curFile, fileType;
        for (fileIdx in files) {
            if (files.hasOwnProperty(fileIdx)) {
                curFile = files[fileIdx].split('.');
                fileExt = curFile[curFile.length - 1];
                fileType = curFile.pop();
                curFile = curFile.join('.');
                if (fileType === 'zip' || fileType === 'rar') {
                    outFiles.push({
                        path: '/archive/' + files[fileIdx],
                        name: files[fileIdx]
                    });
                }
            }
        }
        res.render('main/ziplist.html', {
            files: outFiles
        });
    });
};

/**
 * 压缩包文件下载页面
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 1.0.0(2014-04-05)
 * @since 1.0.0(2014-04-05)
 */
exports.downloadZip = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    var zipfile = path.join('.', 'public', 'zipped', req.params.zipfile);
    fs.exists(zipfile, function (exists) {
        if (exists) {
            res.sendfile(zipfile);
        } else {
            next();
        }
    });
};

/**
 * 构建平台页面
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 1.0.0(2014-04-05)
 * @since 1.0.0(2014-04-05)
 */
exports.build = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    res.render('main/build.html');
};

/**
 * JSLint页面
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 1.4.0(2014-04-28)
 * @since 1.0.0(2014-04-06)
 */
exports.jslint = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    res.render('main/jslint.html');
};

/**
 * JSLint结果JSON文件
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 1.0.0(2014-04-06)
 * @since 1.0.0(2014-04-06)
 */
exports.jslintErrors = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    res.setHeader('Content-type', 'application/json');
    fs.readFile(path.join('.', 'public', 'jslint', 'data', 'errors', req.params.jsonfile), function (err, data) {
        if (err) {
            next();
        } else {
            res.end(data);
        }
    });
};

/**
 * JSLint源代码文件
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 1.0.0(2014-04-06)
 * @since 1.0.0(2014-04-06)
 */
exports.jslintSource = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    res.setHeader('Content-type', 'application/javascript');
    fs.readFile(path.join('.', 'public', 'jslint', 'data', 'source', req.params.jsfile), function (err, data) {
        if (err) {
            next();
        } else {
            res.end(data);
        }
    });
};

/**
 * 代码统计列表
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 1.2.0(2014-04-18)
 * @since 1.2.0(2014-04-18)
 */
exports.listSloc = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    fs.readdir('./public/sloc', function (err, files) {
        if (err) {
            console.log(err);
        }
        var outFiles = [], fileIdx, curFile, versions = {};
        for (fileIdx in files) {
            if (files.hasOwnProperty(fileIdx)) {
                curFile = files[fileIdx].split('-');
                if (!versions[curFile[1]]) {
                    versions[curFile[1]] = {
                        link: '/stat/' + curFile[1],
                        name: curFile[1]
                    };
                    outFiles.push(versions[curFile[1]]);
                }
            }
        }
        res.render('main/slocList.html', {
            files: outFiles
        });
    });
};

/**
 * 解析代码统计数据
 * @param {Object} sloc 统计数据
 * @return {void}
 * @author luoweiping
 * @version 1.2.0(2014-04-18)
 * @since 1.2.0(2014-04-18)
 */
function parseSloc (sloc) {
    //@formatter:off
    'use strict';
    //@formatter:on
    var output = [], slocIdx, curSloc;
    try {
        if ( typeof sloc === 'string') {
            sloc = JSON.parse(sloc);
        }
        for (slocIdx in sloc) {
            if (sloc.hasOwnProperty(slocIdx)) {
                curSloc = sloc[slocIdx];
                if (Object.prototype.toString.call(sloc[slocIdx]) === '[object Object]' && curSloc.loc) {
                    output.push({
                        type: slocIdx,
                        loc: curSloc.loc,
                        sloc: curSloc.sloc,
                        cloc: curSloc.cloc,
                        scloc: curSloc.scloc,
                        mcloc: curSloc.mcloc,
                        nloc: curSloc.nloc,
                        file: curSloc.file
                    });
                }
            }
        }
        output.push({
            type: 'Total',
            loc: sloc.loc,
            sloc: sloc.sloc,
            cloc: sloc.cloc,
            scloc: sloc.scloc,
            mcloc: sloc.mcloc,
            nloc: sloc.nloc,
            file: sloc.file
        });
    } catch(e) {

    }
    return output;
}

/**
 * 代码统计数据页面
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 1.3.0(2014-04-21)
 * @since 1.2.0(2014-04-18)
 */
exports.showSloc = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    var slocArr = [];
    if (!req.params.version || !/^v[\d\.]+$/i.test(req.params.version)) {
        res.render('main/sloc.html', {
            success: false,
            code: 404,
            message: 'The requested version [' + req.param.version + '] is invalid~!'
        });
    }
    try {
        slocArr.lib = fs.readFileSync('./public/sloc/sloc-' + req.params.version + '-lib.json', {
            encoding: 'utf8'
        });
        // slocArr.front = fs.readFileSync('./public/sloc/sloc-' + req.params.version + '-front.json', {
            // encoding: 'utf8'
        // });
        slocArr.admin = fs.readFileSync('./public/sloc/sloc-' + req.params.version + '-admin.json', {
            encoding: 'utf8'
        });
        slocArr.less = fs.readFileSync('./public/sloc/sloc-' + req.params.version + '-less.json', {
            encoding: 'utf8'
        });
        slocArr.total = fs.readFileSync('./public/sloc/sloc-' + req.params.version + '-total.json', {
            encoding: 'utf8'
        });
    } catch(e) {
        res.render('main/sloc.html', {
            success: false,
            code: 404,
            message: e.message
        });
    }

    slocArr.push({
        title: 'JS库',
        data: parseSloc(slocArr.lib)
    });
    // slocArr.push({
        // title: '前台',
        // data: parseSloc(slocArr.front)
    // });
    slocArr.push({
        title: '后台',
        data: parseSloc(slocArr.admin)
    });
    slocArr.push({
        title: '样式',
        data: parseSloc(slocArr.less)
    });
    slocArr.push({
        title: '总计',
        data: parseSloc(slocArr.total)
    });

    res.render('main/sloc.html', {
        success: true,
        code: 200,
        slocData: slocArr,
        version: req.params.version
    });
};
