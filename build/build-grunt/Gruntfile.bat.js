/**
 * 实时编译less文件
 * @since 2015-02-10
 * @author xiyangbaixue
 */

/*module.exports = function (grunt) {

    "use strict";*/

    /*grunt.initConfig({

        watch: {
            options: {
                spawn: false,
                livereload: true,
            },
            scripts: {
                tasks: [ 'less']
            }
          },
    });*/

    /*grunt.initConfig({
        less: {
            admin: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: {
                    "/public/less/all.css": "/public/less/all.less"
                }
            }
        },
        watch: {
            options: {
              livereload: true,
            },
            css: {
              files: ['public/less/*.less'],
              tasks: ['less']
            },
        }
    });

    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('connect-livereload');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');



    grunt.registerTask('w',['watch:css']);*/


    module.exports = function(grunt) {

    // 1. 所有的配置将在这里进行
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            options: {
                port: 3001,
                hostname: '127.0.0.1',
                livereload: 35729
            },
            server: {
                options: {
                    open: true,
                    base: [
                        '../'
                    ]
                }
            }
        },
        less: {
            development: {
                options: {

                },
                files: {
                    "public/all.css": "public/all.less"
                }
            }
        },
        watch: {
            livereload: {
                options: {
                    livereload: '<%=connect.options.livereload%>'
                },
                files: [
                    'public/less/*'
                ]
            }
        }

    });

    // 3. 我们在这里告诉grunt我们将使用插件
    //grunt.loadNpmTasks('grunt-contrib-concat');

    //grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('serve', ['connect:server','less:development','watch']);





};
