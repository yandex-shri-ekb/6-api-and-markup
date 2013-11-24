module.exports = function (grunt) {
    grunt.initConfig({
        requirejs: {
            dist: {
                options: {
                    baseUrl: 'src/scripts',
                    mainConfigFile: 'src/scripts/boot.js',
                    name: 'boot',
                    out: 'dist/scripts/gallery.build.js',
                    preserveLicenseComments: false,
                    paths: {
                        requireLib: 'vendors/require/require'
                    },
                    include: 'requireLib'
                }
            }
        },

        cssmin: {
            dist: {
                files: {
                    'dist/styles/build.css': 'src/styles/all.css'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('default', ['cssmin', 'requirejs']);
};
