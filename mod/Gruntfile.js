module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			src: ['src/*.js'],
			options: {
			    jshintrc: '.jshintrc'
			}
		},
		smash: {
		    bundle: {
		      src: 'src/build.aviation.js',
		      dest: '.build/aviation.js'
		    },
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				//mangleProperties: true,
				//reserveDOMCache: true,
				mangle : true,
				compress : true
			},
			build: {
				files: {
					'.build/aviation.min.js' : ['.build/aviation.js']
				}
			}
		}
	});
	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
  	grunt.loadNpmTasks('grunt-contrib-uglify');
  	grunt.loadNpmTasks('grunt-smash');

  	// Default task(s).
  	grunt.registerTask('default', ['jshint', 'smash','uglify']);
}