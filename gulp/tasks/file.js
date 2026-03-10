module.exports = function (){

	
	$.gulp.task('file', function () {
 
		return 	$.gulp.src([$.source + '/libs/**']).pipe($.gulp.dest($.public + '/libs')).on('end',$.browserSync.reload);
});

}