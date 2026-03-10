module.exports = () => {
	$.gulp.task('sass', () => {
		const processors = [  
			$.autoprefixer(),
			$.nested(),
			$.cssnano(),
			$.gcmq(),
		];
		return $.gulp.src($.source + '/sass/main.scss')
			.pipe($.sassGlob())
			.pipe($.sass({ outputStyle: 'compressed', indentedSyntax: false, errLogToConsole: true }))
			.pipe($.postcss(processors, { syntax: $.syntax }))
			// .pipe($.gcmq())
			.pipe($.rename({ suffix: '.min', prefix: '' }))
			.pipe($.gulp.dest($.public + '/css'))
			.pipe($.browserSync.stream());
	});

}