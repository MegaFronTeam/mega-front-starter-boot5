module.exports = function () {
    let dest = '../_sprite.scss'
    $.gulp.task('svg', () => {
        return $.gulp.src('./' + $.source + '/svg/*.svg')
            .pipe($.svgmin({
                js2svg: {
                    pretty: true
                }
            }))
            .pipe($.cheerio({
                run: function ($) {
                    $('[fill]').removeAttr('fill');
                    $('[stroke]').removeAttr('stroke');
                    $('[style]').removeAttr('style');
                    $('[opacity]').removeAttr('opacity');
                },
                parserOptions: { xmlMode: true }
            }))
            .pipe($.replace('&gt;', '>'))
            .pipe($.svgSprite({
                shape: {
                    dimension: {         // Set maximum dimensions
                        maxWidth: 500,
                        maxHeight: 500
                    },
                    spacing: {         // Add padding
                        padding: 0
                    }
                },
                mode: {
                    symbol: {
                        sprite: "../sprite.svg",
                        render: {
                            scss: {
                                template: './' + $.source + '/sass/templates/_sprite_template.scss',
                                dest: dest,
                            }
                        }
                    }
                }

            }))

            .pipe($.gulp.dest(`${$.source}/sass/`));
    });
    $.gulp.task('svgCopy', function () {
        return  $.gulp.src(`${$.source}/sass/sprite.svg`) 
                .pipe($.plumber())
                .pipe($.gulp.dest(`${$.public}/img/svg/`))
          
    });
};
