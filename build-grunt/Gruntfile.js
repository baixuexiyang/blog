/**
 * 实时编译less文件
 * @since 2015-02-10
 * @author xiyangbaixue
 */

module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readJSON('config.json'),
        less: {
            admin: {
                options: {
                    compress: true,
                    cleancss: true,
                    report: 'gzip'
                },
                files: {
                    "<%= config.path.dest.css %>/<%= config.path.dest.finalCssFileName %>.css": "<%= config.path.dest.less %>/<%= config.path.dest.finalCssFileName %>.less"
                }
            }
        },
        //压缩 css
        cssmin: {
            options: {
                keepSpecialComments: 0,
                banner: '/** \n' +
                    '* Project : <%= config.banner.name %> \n' +
                    '* Author : <%= config.banner.author %> \n' +
                    '* Updated : <%= grunt.template.today() %> \n' +
                    '*/ \n'
            },
            compress: {
                files: {
                    "<%= config.path.dest.css %>/<%= config.path.dest.finalCssFileName %>.min.css": [
                        "<%= config.path.dest.css %>/<%= config.path.dest.finalCssFileName %>.css"
                    ]
                }
            }
        },
        //监听变化 默认grunt watch 监测所有开发文件变化
        watch: {
            options: {
                livereload: true
            },
            html: {
                files: ['<%= config.path.dest.views %>/**/*.html']
            },
            less: {
                files: ['<%= config.path.dest.less %>/*.less'],
                tasks: ['less:admin', 'cssmin']
            },
            css: {
                files: '<%= config.path.dest.css %>/*.css',
                tasks: ['cssmin']
            },
            js: {
                files: ['<%= config.path.dest.public %>/**/*.js']
            },
            // Gruntfile有修改则重启watch任务
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        }
    });


    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-zip");
    grunt.loadNpmTasks("grunt-contrib-cssmin");

    grunt.registerTask("default", ["less", "cssmin"]);

};