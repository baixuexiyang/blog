/**
 * [gulp autobuild]
 * @since [2015-2-11]
 * @author xiyangbaixue
 */

var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css');

gulp.task('build-less', function(){
  gulp.src('../public/less/all.less')
    .pipe(less({ compress: true }))
    .on('error', function(e){console.log(e);} )
    .pipe(gulp.dest('../public/css/'));

});

// 合并、压缩、重命名css
gulp.task('min-styles',['build-less'], function() {
  gulp.src(['../public/css/all.css'])
    .pipe(gulp.dest('../public/css/')) // 输出all.css文件
    .pipe(rename({ suffix: '.min' })) // 重命名all.css为 all.min.css
    .pipe(minifycss()) // 压缩css文件
    .pipe(gulp.dest('../public/css/')); // 输出all.min.css
});

gulp.task('develop', function() {
    gulp.watch('../public/less/*.less', ['build-less', 'min-styles']);
});