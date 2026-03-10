module.exports = function () {

	// Your "watch" task
	$.gulp.task('watch', function () {
		$.gulp.watch([$.source + '/sass/**/*.css', $.source + '/pug/blocks/**/*.scss', $.source + '/sass/**/*.scss', $.source + '/sass/**/*.sass'], { usePolling: true }, $.gulp.series('sass'));
		$.gulp.watch($.source + '/pug/**/*.pug', { usePolling: true },  $.gulp.series('pug'));
		$.gulp.watch($.source + '/svg/*.svg', { usePolling: true }, $.gulp.series('svg'));
		// $.gulp.watch([$.source + '/js/libs.js'], { usePolling: true }, $.gulp.series('scripts'));
		$.gulp.watch($.source + '/sass/*.svg', { usePolling: true }, $.gulp.series('svgCopy'));

		$.gulp.watch([$.source + '/js/common.js'], { usePolling: true }, $.gulp.series('scripts:common'));
		$.gulp.watch($.source + '/img', { usePolling: true }, $.gulp.series('img-responsive'));
	});

}