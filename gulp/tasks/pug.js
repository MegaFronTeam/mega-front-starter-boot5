module.exports = function () {


	$.gulp.task('pug', function () {

		return $.gulp.src($.source + '/pug/pages/*.pug')
			.pipe($.pug({ pretty: true }).on("error", $.notify.onError()))
			.pipe($.tabify(2, true))
			.pipe($.gulp.dest($.public))
			.on('end', $.browserSync.reload);
	});
}