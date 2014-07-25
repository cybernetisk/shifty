module.exports = function(grunt)
{
	// js-files to use
	// we store an array here because it is used by both 'concat' and 'watch'
	var js_files = [
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
		"./shifty/static/js/handlebars.helpers.js",

		// the main app, must load before views etc
		"./shifty/static/js/app.shifty.js",
		
		// models
		"./shifty/static/js/models/event.js",
		"./shifty/static/js/models/user.js",

		// views
		"./shifty/static/js/views/datepicker.js",
		"./shifty/static/js/views/dropdown.js",
		"./shifty/static/js/views/popout.js",
		"./shifty/static/js/views/adminmenu.js",
		"./shifty/static/js/views/events.js",
		"./shifty/static/js/views/event.js",
		"./shifty/static/js/views/index.js"
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
			}
		}
	});

	// load plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// default task (run with 'grunt')
	grunt.registerTask('default', [
		'sass:dev',
		'concat',
		//'uglify',
		'watch'
	]);
};