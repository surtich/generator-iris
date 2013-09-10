var path = require('path');

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:iris.json>',
        meta: {
        },
        concat: {
            dist: {
                src: ['<banner:meta.banner>', '<file_strip_banner:src/generator-iris.js>'],
                dest: 'dist/generator-iris.js'
            }
        },
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest: 'dist/generator-iris.min.js'
            }
        },
        qunit: {
            files: ['www/test/**/*.html']
        },
        jshint: {
            uses_defaults: ['grunt.js', 'www/app/**/*.js', 'test/**/*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    iris: true,
                    $: true,
                    model: true
                }
            }
        },
        uglify: {},
        express: {
          server: {
            options: {
              port: 8080,
              bases: 'www',
              hostname: 'localhost',
              serverreload: true,
              server: path.resolve('./express-server.js')
            }
        }
  }
    });

    // Default task.    
    grunt.registerTask('default', ['jshint', 'express']);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');

  };