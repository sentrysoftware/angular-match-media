const gulp = require('gulp');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
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
		sourcemaps.init(),
		uglify(),
		rename({ suffix: '.min' }),
		sourcemaps.write('./'),
		gulp.dest('dist')
	],
		cb
	);
});

// Default Task
gulp.task('default', gulp.series('lint', 'minify'));
