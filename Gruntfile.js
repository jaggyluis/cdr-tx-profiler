module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			src: [
				'js/*.js',
				'js/var/**/*.js',
				'js/lib/aviation.*.js']
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files: [{
					expand: true,
					src: 'js/**/*.js',
					dest: '.build'
				}]
			}
		},
		obfuscator_node: {
	        default_options: {
	            options: {
	                strings: true,
	                compressor : {
	                    conditionals: true,
	                    evaluate: true,
	                    booleans: true,
	                    loops: true,
	                    unused: false,
	                    hoist_funs: false
	                }
	            },
	            files: [{
	                cwd: '.',
	                src: ['.build/js/lib/aviation.core.js'],
	                dest: '',
	                expand: true,
	                cache : false
	            }]
	        }
	    }
	});
	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
  	grunt.loadNpmTasks('grunt-contrib-uglify');
  	grunt.loadNpmTasks('grunt-obfuscator-node');

  	// Default task(s).
  	grunt.registerTask('default', [/*'jshint',*/ 'uglify', 'obfuscator_node']);
}