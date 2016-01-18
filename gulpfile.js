var gulp = require('gulp');
var browserify = require('browserify');
var vueify = require('vueify');
var source = require('vinyl-source-stream');
var livereload = require('gulp-livereload');


gulp.task('build-js',function () {
	return browserify({
		entries: './vueku.js',
		debug: true
	})
	.transform(vueify)
	.bundle()
	.pipe(source('build.js'))
	.pipe(gulp.dest('./'))
	.pipe(livereload());
});

gulp.task('dev', function () {
	livereload.listen();
	gulp.watch(['./*.vue','./vueku.js','./*.html'],['build-js']);
});

gulp.task('default', ['dev']);
