module.exports = function(grunt)
{
	// js-files to use
	// we store an array here because it is used by both 'concat' and 'watch'
	var js_files = [
		// libraries we use
		"./assets/bower_components/jquery/dist/jquery.js",
		"./assets/bower_components/handlebars/handlebars.js",
		"./assets/bower_components/underscore/underscore.js",
		"./assets/bower_components/backbone/backbone.js",
		"./assets/bower_components/foundation/js/foundation.js",
		"./assets/bower_components/foundation/js/foundation/foundation.reveal.js",
		"./assets/bower_components/foundation/js/foundation/foundation.abide.js",
		"./assets/bower_components/typeahead.js/dist/typeahead.bundle.js",
		"./assets/bower_components/moment/moment.js",

		// our own files
		"./assets/js/handlebars.helpers.js",

		// the main app, must load before views etc
		"./assets/js/app.shifty.js",

		// models and views
		"./assets/js/models/**/*.js",
		"./assets/js/views/**/*.js",
		
		// handlebars-templates generated by 'handlebars'
		"./assets/js/handlebars-autogenerated.js",
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// 'concat' merges javascript-files to one file
		concat: {
			options: {
				separator: ";\n"
			},
			dist: {
				src: js_files,
				dest: "shifty/static/js/dist.js"
			}
		},

		// 'uglify' makes a minified verson of our js-file
		//
		// 'concat' must be run before
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'shifty/static/js/dist.min.js': 'shifty/static/js/dist.js'
				}
			}
		},

		// 'sass' generates css from scss-files
		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					"shifty/static/css/shifty.css": "assets/scss/shifty.scss"
				}
			},
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					"shifty/static/css/shifty.css": "assets/scss/shifty.scss"
				}
			}
		},

		// 'handlebars' generates precompiled handlebar-templates from .hbs
		// run before 'concat'
		handlebars: {
			compile: {
				options: {
					processName: function(filePath) {
						var name = filePath.replace(/.*\/([^\/]+)\.hbs/, '$1')
						return name;
					},
					namespace: function(filename) {
						var names = "Handlebars/templates/";
						names += filename.replace(/shifty\/static\/handlebars(\/.*)?\/[^\/]+\.hbs/, '$1');
						names = names.replace(/\/$/, '');
						return names.split('/').join('.');
					}
				},
				files: {
					'assets/js/handlebars-autogenerated.js': 'shifty/static/handlebars/**/*.hbs'
				}
			}
		},

		// 'watch' runs 'concat', 'uglify' and 'sass' on changes
		watch: {
			js: {
				files: js_files,
				tasks: [
					'concat'//,
					//'uglify'
				]
			},
			sass: {
				files: './assets/scss/**/*.scss',
				tasks: ["sass:dev"]
			},
			handlebars: {
				files: 'shifty/static/handlebars/**/*.hbs',
				tasks: [
					'handlebars'//,
					//'concat' (we don't need this as the watcher will run it)
				]
			}
		}
	});

	// load plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-handlebars');

	// default task (run with 'grunt')
	grunt.registerTask('default', [
		'sass:dev',
		'handlebars',
		'concat',
		//'uglify',
		'watch'
	]);
};