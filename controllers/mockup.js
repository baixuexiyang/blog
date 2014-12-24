/**
 * 模拟数据输出
 * @author luoweiping
 * @version 1.4.0(2014-05-06)
 * @since 0.1.0(2014-03-12)
 */
var path = require('path');

/**
 * 直接发送json数据
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 1.4.0(2014-05-06)
 * @since 0.1.0(2014-03-12)
 */
module.exports.sendData = function (req, res, next) {
    //@formatter:off
    'use strict';
    var query = req.query,
        method = query.q,
        code = query.code || '',
        message = query.message || '',
        page = parseInt(req.body.page || req.body.pageNo || query.page || 1, 10),
        outputData = {};
    //@formatter:on

    switch(method) {
        case 'getDiseaseMatchData':
            page = page > 9 ? 9 : page;
            outputData = {
                "status": 0,
                "message": "",
                "result": {
                    "title": "医保匹配信息[3300101, 口腔溃疡]匹配信息[未匹配]",
                    "param": {
                        "hisName": "1",
                        "icdCode": "1",
                        "matchId": "1"
                    },
                    "data": [{
                        "itemNo": "item" + ((page - 1) * 10 + 1),
                        "diseaseCode": "1234567890",
                        "diseaseName": "头孢拉定胶囊12345678",
                        "spellCode": "1234567890",
                        "hurtUseFlag": "1234567890",
                        "bearUseFlag": "1234567890",
                        "diseaseClass": "1234567890",
                        "startTime": 1399379843121,
                        "stopTime": 1399379843121,
                        "recordId": "1234567890"
                    }, {
                        "itemNo": "item" + ((page - 1) * 10 + 1),
                        "diseaseCode": "2",
                        "diseaseName": "头孢拉定胶囊12345",
                        "spellCode": "2",
                        "hurtUseFlag": "2",
                        "bearUseFlag": "2",
                        "diseaseClass": "2",
                        "startTime": 1399379843121,
                        "stopTime": 1399379843121,
                        "recordId": "2"
                    }],
                    "paginator": {
                        "pageIndex": page,
                        "lower": page > 7 ? 5 : page > 2 ? page - 2 : 1,
                        "higher": page < 4 ? 5 : page < 8 ? page + 2 : 9,
                        "pageSize": 10,
                        "totalPages": 9,
                        "totalRecords": 83
                    }
                }
            };
            break;
        case 'getMedicineMatchData':
            page = page > 9 ? 9 : page;
            outputData = {
                "status": 0,
                "message": "",
                "result": {
                    "title": "医保匹配信息[3300101, 头孢拉定胶囊, 50mg*12] 匹配信息[未匹配]",
                    "param": {
                        "hisMedicineName": "1",
                        "matchId": "1"
                    },
                    "data": [{
                        "recordId": (page - 1) * 10 + 1,
                        "medicineCode": "1234567890",
                        "medicineName": "头孢拉定胶囊12345678",
                        "dosageForm": "50mg1234567890",
                        "remark": "1234567890",
                        "medicareType": "1234567890",
                        "medicinePlace": "1234567890",
                        "specification": "1234567890",
                        "unitName": "1234567890",
                        "selfPayScale": "1234567890",
                        "startDate": "2014-04-30",
                        "hisMedicineCode": "1234567890",
                        "hisMedicineName": "头孢拉定胶囊"
                    }, {
                        "recordId": (page - 1) * 10 + 2,
                        "medicineCode": "2",
                        "medicineName": "头孢拉定胶囊12345",
                        "dosageForm": "50mg",
                        "remark": "2",
                        "medicareType": "2",
                        "medicinePlace": "2",
                        "specification": "2",
                        "unitName": "2",
                        "selfPayScale": "2",
                        "startDate": "2014-04-30",
                        "hisMedicineCode": "2",
                        "hisMedicineName": "头孢拉定胶囊"
                    }],
                    "paginator": {
                        "pageIndex": page,
                        "lower": page > 7 ? 5 : page > 2 ? page - 2 : 1,
                        "higher": page < 4 ? 5 : page < 8 ? page + 2 : 9,
                        "pageSize": 10,
                        "totalPages": 9,
                        "totalRecords": 83
                    }
                }
            };
            break;
        case 'getChargeMatchData':
            page = page > 9 ? 9 : page;
            outputData = {
                "status": 0,
                "message": "",
                "result": {
                    "title": "医保匹配信息[3300101, 头孢拉定胶囊, 50mg*12] 匹配信息[未匹配]",
                    "param": {
                        "code": "1",
                        "id": "1",
                        "hisName": '1'
                    },
                    "data": [{
                        "catalogId": (page - 1) * 10 + 1,
                        "insuranceCode": "1234567890",
                        "insuranceName": "头孢拉定胶囊12345678",
                        "medicareType": "1234567890",
                        "medicareTypeName": "1234567890",
                        "chargeTypeName": "1234567890",
                        "medicineUnit": "1234567890",
                        "selfPayScale": "1234567890",
                        "startDate": "2014-04-30",
                        "limit": "1234567890",
                        "insuranceSource": "1234567890"
                    }, {
                        "catalogId": (page - 1) * 10 + 2,
                        "insuranceCode": "2",
                        "insuranceName": "头孢拉定胶囊12345",
                        "medicareType": "2",
                        "medicareTypeName": "1234567890",
                        "chargeTypeName": "2",
                        "medicineUnit": "2",
                        "selfPayScale": "2",
                        "startDate": "2014-04-30",
                        "limit": "2",
                        "insuranceSource": "2"
                    }],
                    "paginator": {
                        "pageIndex": page,
                        "lower": page > 7 ? 5 : page > 2 ? page - 2 : 1,
                        "higher": page < 4 ? 5 : page < 8 ? page + 2 : 9,
                        "pageSize": 10,
                        "totalPages": 9,
                        "totalRecords": 83
                    }
                }
            };
            break;
        case 'getMedicineQueryData':
            page = page > 9 ? 9 : page;
            outputData = {
                "status": 0,
                "message": "",
                "result": {
                    "title": "医保详细比例信息",
                    "medicineCode": "1234567890",
                    "data": [{
                        "recordId": (page - 1) * 10 + 1,
                        "medicineItemCode": "1234567890",
                        "medicineName": "头孢拉定胶囊12345678",
                        "medicareType": "1234567890",
                        "selfPayScale": "1234567890",
                        "thirdJLimitPrice": "1234567890",
                        "startDate": "2014-04-30",
                        "stopDate": "2014-04-30",
                        "medicineCode": "头孢拉定胶囊12345678"
                    }, {
                        "recordId": (page - 1) * 10 + 2,
                        "medicineItemCode": "1234567890",
                        "medicineName": "头孢拉定胶囊12345",
                        "medicareType": "1234567890",
                        "selfPayScale": "1234567890",
                        "thirdJLimitPrice": "1234567890",
                        "startDate": "2014-04-30",
                        "stopDate": "2014-04-30",
                        "medicineCode": "头孢拉定胶囊12345"
                    }],
                    "paginator": {
                        "pageIndex": page,
                        "lower": page > 7 ? 5 : page > 2 ? page - 2 : 1,
                        "higher": page < 4 ? 5 : page < 8 ? page + 2 : 9,
                        "pageSize": 10,
                        "totalPages": 9,
                        "totalRecords": 83
                    }
                }
            };
            break;
        default:
            outputData = {
                "status": 0,
                "message": "无匹配数据"
            };
    }
    res.set('Content-type', 'application/json');
    res.send(outputData);
};

/**
 * 发送json文件，分mockup根目录和json子目录
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Object} next 路由对象
 * @return {void}
 * @author luoweiping
 * @version 0.1.1(2014-03-19)
 * @since 0.1.0(2014-03-12)
 */
module.exports.sendJson = function (req, res, next) {
    //@formatter:off
    'use strict';
    //@formatter:on
    var jsonDir = req.params[0], jsonName = req.params[1];
    res.set('Content-type', 'application/json');
    res.sendfile(path.join('.', 'mockup', jsonDir ? 'json' : '', jsonName || jsonDir));
};
