'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        dirs: {
            dest: 'dist',
            src: 'src',
            tmp: '.tmp'
        },

        staticinline: {
            dist: {
                options: {
                    basepath: '<%= dirs.tmp %>/'
                },
                files: [{
                  expand: true,
                  cwd: '<%= dirs.dest %>/',
                  src: '**/*.html',
                  dest: '<%= dirs.dest %>/'
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    dest: '<%= dirs.dest %>/',
                    src: '*',
                    filter: 'isFile',
                    expand: true,
                    cwd: '<%= dirs.src %>/'
                }]
            }
        },

        concat: {
            css: {
                src: [
                    '<%= dirs.src %>/css/bootstrap.css',
                    '<%= dirs.src %>/css/style.css'
                ],
                dest: '<%= dirs.tmp %>/css/pack.css'
            }
        },

        autoprefixer: {
            options: {
                browsers: [
                    'last 2 version',
                    '> 1%',
                    'Edge >= 12',
                    'Explorer >= 9',
                    'Firefox ESR',
                    'Opera 12.1'
                ]
            },
            pack: {
                src: '<%= concat.css.dest %>',
                dest: '<%= concat.css.dest %>'
            }
        },

        uncss: {
            options: {
                htmlroot: '<%= dirs.tmp %>',
                ignoreSheets: [/fonts.googleapis/, /www.google.com/],
                stylesheets: ['/css/pack.css']
            },
            dist: {
                src: '<%= dirs.dest %>/**/*.html',
                dest: '<%= concat.css.dest %>'
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    conservativeCollapse: false,
                    decodeEntities: true,
                    ignoreCustomComments: [/^\s*google(off|on):\s/],
                    minifyCSS: {
                        compatibility: 'ie9',
                        keepSpecialComments: 0
                    },
                    minifyJS: true,
                    minifyURLs: false,
                    processConditionalComments: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeOptionalAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    removeTagWhitespace: false,
                    sortAttributes: true,
                    sortClassName: true
                },
                expand: true,
                cwd: '<%= dirs.dest %>',
                dest: '<%= dirs.dest %>',
                src: ['**/*.html', '!404.html']
            }
        },

        connect: {
            options: {
                hostname: 'localhost',
                livereload: 35729,
                port: 8001
            },
            livereload: {
                 options: {
                    base: '<%= dirs.dest %>/',
                    open: true  // Automatically open the webpage in the default browser
                 }
             }
        },

        watch: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            dev: {
                files: ['<%= dirs.src %>/**', 'Gruntfile.js'],
                tasks: 'dev'
            },
            build: {
                files: ['<%= dirs.src %>/**', 'Gruntfile.js'],
                tasks: 'build'
            }
        },

        htmllint: {
            src: '<%= dirs.dest %>/**/*.html'
        },

        bootlint: {
            options: {
                relaxerror: ['W001', 'W002', 'W003', 'W005']
            },
            files: ['<%= dirs.dest %>/**/*.html', '!<%= dirs.dest %>/404.html']
        },

		'gh-pages': {
			options: {
				base: '<%= dirs.dest %>'
			},
			src: ['**']
		},

        clean: {
            dist: [
                '<%= dirs.dest %>/',
                '<%= dirs.tmp %>/'
            ]
        }

    });

    // Load any grunt plugins found in package.json.
    require('load-grunt-tasks')(grunt, { scope: 'dependencies' });
    require('time-grunt')(grunt);

    grunt.registerTask('dev', [
        'clean',
        'copy',
        'concat',
        'autoprefixer',
        'staticinline'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'concat',
        'autoprefixer',
        'uncss',
        'staticinline',
        'htmlmin'
    ]);

    grunt.registerTask('test', [
        'build',
        'bootlint',
        'htmllint'
    ]);

    grunt.registerTask('server', [
        'build',
        'connect',
        'watch:build'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'gh-pages'
    ]);

    grunt.registerTask('default', [
        'dev',
        'connect',
        'watch:dev'
    ]);

};
