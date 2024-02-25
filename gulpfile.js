const gulp = require('gulp');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const pump = require('pump');

// Lint Task
gulp.task('lint', function() {
	return gulp.src('src/match-media-light.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Minify Task
gulp.task('minify', function(cb) {
	pump([
		gulp.src('src/match-media-light.js'),
		uglify(),
		rename({ suffix: '.min' }),
		gulp.dest('dist')
	],
		cb
	);
});

// Default Task
gulp.task('default', gulp.series('lint', 'minify'));
