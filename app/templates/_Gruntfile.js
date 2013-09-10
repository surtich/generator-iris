var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:iris.json>',
        meta: {
        },
        concat: {
            dist: {
                src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        qunit: {
            files: ['www/test/**/*.html']
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'lint qunit'
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
        connect: {
          options: {
            port: 8080,
            livereload: true
          },
          livereload: {
            options: {
              middleware: function (connect) {
                return [
                  lrSnippet,
                  mountFolder(connect, '.')
                ];
              }
            }
          }
        }
    });

    // Default task.    
    grunt.registerTask('default', ['jshint', 'connect:livereload', 'watch']);

    grunt.registerTask('test', ['jshint', 'qunit']);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');

  };