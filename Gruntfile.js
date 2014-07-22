var LIVERELOAD_PORT = 35729;

var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    var siteConfig = {
        dev: './',
        prod: 'prod'
    };
    
    grunt.initConfig({
        site: siteConfig,

        watch: {
            options: {
                livereload: true
            },
            css: {
                files: '<%= site.dev %>/less/*.less',
                tasks: ['less', 'autoprefixer'],
            },
            jsx: {
                files: '<%= site.dev %>/js/*.jsx.js',
                tasks: ['react']
            },
            // js: {
            //     files: '<%= site.dev %>/src/js/*.js',
            //     tasks: 'uglify'
            // },
            livereload: {
                livereload: true,
                files: [
                    'app.js',
                    '<%= site.dev %>/*.html',
                    '<%= site.dev %>/css/*.css',
                    '<%= site.dev %>/img/{,*/}*.{png, jpg, jpeg, gif}',
                    '<%= site.dev %>/js/{,*/}*.js',
                    '<%= site.dev %>/js/{,*/}*.jsx.js'
                ]
            }
        },

        react: {
            target: {
                files: {
                    '<%= site.dev %>js/app.js' : '<%= site.dev %>js/app.jsx.js'
                }
            }
        },

        autoprefixer: {
            options: {
                browsers:['last 2 versions', 'ie 8', 'ie 7']
            },
            target: {
                src: '<%= site.dev %>/css/style.css',
                dest: '<%= site.dev %>/css/style.css'
            }
        },

        imagemin: {
            target: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: '<%= site.prod %>/img',
                    src: '*.{png,jpg,jpeg}',
                    dest: '<%= site.prod %>/img'
                }]
            }
        },

        useminPrepare: {
            options: {
                root: '<%= site.dev %>',
                dest: '<%= site.prod %>'
            },
            html: '<%= site.dev %>/index.html'
        },

        usemin: {
            options: {
                assetsDirs: ['<%= site.prod %>']
            },
            html: ['<%= site.prod %>/{,*/}*.html'],
            css: ['<%= site.prod %>/css/{,*/}*.css']
        },

        less: {
            options: {
                syncImport: true,
            },
            dev: {
                files: {
                    '<%= site.dev %>/css/style.css': '<%= site.dev %>/less/style.less'
                }
            }
        },

        connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function ( connect ) {
                        return [
                        mountFolder(connect, '.tmp'),
                        mountFolder(connect, '')
                        ];
                    }
                }
            }
        },

        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },

        rsync: {
            options: {
                args: ["--verbose"],
                exclude: ["src", "*~", "*.swp", ".*", "prod", "node_modules", "Gruntfile.js", "package.json"],
                recursive: true
            },
            dist: {
                options: {
                    src: "<%= site.dev %>/",
                    dest: "<%= site.prod %>"
                }
            }
        }
    });

    // load plugins
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // default task(s)
    grunt.registerTask('default', function() {
        grunt.task.run([
            'connect:livereload',
            'open',
            'watch'
        ]);
    });
    
    grunt.registerTask('build', function() {
        grunt.task.run([
            'rsync',
            'useminPrepare',
            'concat',
            'cssmin',
            'uglify',
            'usemin',
            'imagemin:target'
        ]);
    });
};
