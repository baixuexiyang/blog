var mongo = require('mongoskin');
var Db = mongo.Db;
var Server = mongo.Server;
var MongoClient = mongo.MongoClient;
var ReplSetServers = mongo.ReplSetServers;
var dburl = require('../../config/db.js').db;//数据库地址
var logger = require('../../config/log/app').helper;
var blog = MongoClient.connect(dburl);


exports.article = {
    list: function(condition, size, callback) {
        // blog.collection('article').find({attribute: {$regex: attribute, $options: 'i'}, status: '1'}).sort({date: -1}).limit(size).toArray(callback);
        blog.collection('article').find(condition).sort({date: -1}).limit(size).toArray(callback);
    },
    add: function(data, callback) {
        blog.collection('article').insert(data, callback);
    },
    detail: function(id, callback) {
        blog.collection('article').findOne({'_id': id}, callback);
    },
    next: function(date, attribute, callback) {
        blog.collection('article').find({attribute: {$regex: attribute, $options: 'i'}, date: {$lt: date}}).sort({date: -1}).limit(1).toArray(callback);
    },
    prev: function(date, attribute, callback) {
        blog.collection('article').find({attribute: {$regex: attribute, $options: 'i'}, date: {$gt: date}}).sort({date: 1}).limit(1).toArray(callback);
    },
    deleted: function(condition, callback) {
        blog.collection('article').remove(condition, callback);
    },
    update: function(id, data, callback) {
        blog.collection('article').update({"_id": id}, {$set: data}, callback);
    },
    searcher: function(condition, sort, limit, callback) {
        blog.collection('article').find(condition).sort(sort).limit(limit).toArray(callback);
    },
    total: function(condition, callback) {
        blog.collection('article').find(condition).toArray(callback);
    },
    pagination: function(condition, pagesize, page, callback) {
        blog.collection('article').find(condition).sort({date: -1}).limit(pagesize).skip(pagesize*page).toArray(callback);
    },
    updateRead: function(id, callback) {
        blog.collection('article').update({'_id': id}, {$inc: {read: 1}}, callback);
    },
    updateCommit: function(id, data, callback) {
        blog.collection('article').update({'_id': id}, {"$push":{"commit": data}}, callback);
    }
};

exports.category = {
    add: function(data, callback) {
        blog.collection('category').insert(data, callback);
    },
    list: function(callback) {
        blog.collection('category').find().toArray(callback);
    },
    deleted: function(id, callback) {
        blog.collection('category').remove({'_id': id}, callback);
    },
    update: function(id, data, callback) {
        blog.collection('category').update({"_id": id}, data, callback);
    },
    findName: function(condition, callback) {
        blog.collection('category').find(condition).toArray(callback);
    }
};

exports.bloguser = {
    searcher: function(condition, callback) {
        blog.collection('blogUser').findOne(condition, callback);
    }
};


// exports.forAll = function(doEach, done) {
//     Todo.find({}, function(err, docs) {
//         if (err) {
//             util.log('FATAL '+ err);
//             done(err, null);
//         }
//         docs.forEach(function(doc) {
//             doEach(null, doc);
//         });
//         done(null);
//     });
// }

// var util = require('util');
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var dburl = require('../config/db.js').db;//数据库地址

// exports.connect = function(callback) {
//     mongoose.connect(dburl);
// }

// exports.disconnect = function(callback) {
//     mongoose.disconnect(callback);
// }

// exports.setup = function(callback) { callback(null); }

// //定义todo对象模型
// var TodoScheme = new Schema({
//     title:String
//     ,finished:{type:Boolean,default:false}

//     ,post_date:{type:Date,default:Date.now}
// });

// //访问todo对象模型
// mongoose.model('Todo', TodoScheme);
// var Todo = mongoose.model('Todo');

// //exports.emptyNote = { "_id": "", author: "", note: "" };

// exports.list = function(category) {

// };


// exports.add = function(title,callback) {
//     var newTodo = new Todo();
//     newTodo.title = title;
//     newTodo.save(function(err){
//         if(err){
//             util.log("FATAL"+err);
//             callback(err);
//         }else{
//             callback(null);
//         }
//     });

// }

// exports.delete = function(id, callback) {
//     exports.findTodoById(id, function(err, doc) {
//         if (err)
//             callback(err);
//         else {
//             util.log(util.inspect(doc));
//             doc.remove();
//             callback(null);
//         }
//     });
// }

// exports.editTitle = function(id, title, callback) {
//     exports.findTodoById(id, function(err, doc) {
//         if (err)
//             callback(err);
//         else {
//             doc.post_date = new Date();
//             doc.title = title;
//             doc.save(function(err) {
//                 if (err) {
//                     util.log('FATAL '+ err);
//                     callback(err);
//                 } else
//                     callback(null);
//             });
//         }
//     });
// }
// exports.editFinished = function(id, finished, callback) {
//     exports.findTodoById(id, function(err, doc) {
//         if (err)
//             callback(err);
//         else {
//             doc.post_date = new Date();
//             doc.finished = finished;
//             doc.save(function(err) {
//                 if (err) {
//                     util.log('FATAL '+ err);
//                     callback(err);
//                 } else
//                     callback(null);
//             });
//         }
//     });
// }

// exports.allTodos = function(callback) {
//     Todo.find({}, callback);
// }

// exports.forAll = function(doEach, done) {
//     Todo.find({}, function(err, docs) {
//         if (err) {
//             util.log('FATAL '+ err);
//             done(err, null);
//         }
//         docs.forEach(function(doc) {
//             doEach(null, doc);
//         });
//         done(null);
//     });
// }

// var findTodoById = exports.findTodoById = function(id,callback){
//     Todo.findOne({_id:id},function(err,doc){
//         if (err) {
//             util.log('FATAL '+ err);
//             callback(err, null);
//         }
//         callback(null, doc);
//     });
// }


