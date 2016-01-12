module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				options: {
					reload: true
				}
			},
			scripts: {
				files: ['./js/**/*.js', '!./js/bundle.js'],
				tasks: ['webpack'],
			},
			scss: {
				files: ['./scss/**/*.scss'],
				tasks: ['sass'],	
			},
		},
		sass: {
			options: {
				style: 'expanded'
			},
			dist: {
				files: [{
					expand: true,
					cwd: './scss',
					src: ['style.scss'],
					dest: './css',
					ext: '.css'
				}]
			}
		},
		webpack: {
			someName: {
				entry: "./js/app.js",
				output: {
					path: "./js",
					filename: "bundle.js",
				},
				
				stats: {
					colors: true,
					modules: true,
					reasons: true
				},

				devtool: "source-map",
				progress: true, 
				failOnError: true,
				watch: false,
				keepalive: false,
				inline: false,
				hot: false,
			}
		}
	});

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.registerTask('default', ['sass', 'webpack', 'watch']);
};
