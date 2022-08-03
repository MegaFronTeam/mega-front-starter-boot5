'use strict';
let  publicPath = 'public',
    sourse = 'sourse',
    destSprite = '../_sprite.scss'

import pkg from 'gulp'
const { gulp, src, dest, parallel, series, watch } = pkg

import del  from 'del' 
import pug  from 'gulp-pug'
import notify  from 'gulp-notify' 
import svgmin  from 'gulp-svgmin'
import cheerio  from 'gulp-cheerio'
import replace  from 'gulp-replace'
import svgSprite  from 'gulp-svg-sprite' 
import npmDist  from 'gulp-npm-dist'
import rename  from 'gulp-rename'  
import gulpSass      from 'gulp-sass'
import sassGlob  from 'gulp-sass-glob'
import dartSass      from 'sass'
const  sass          = gulpSass(dartSass)
import tabify  from 'gulp-tabify' 
import gcmq  from 'postcss-sort-media-queries'  
import browserSync  from 'browser-sync'
import postcss  from 'gulp-postcss'
import autoprefixer  from 'autoprefixer'
import cssnano  from 'cssnano' 
import nested  from 'postcss-nested'
import pscss  from 'postcss-scss'
// )({ scss: 'postcss-scss'}),
import plumber  from 'gulp-plumber'
import sharpResponsive from "gulp-sharp-responsive"; 
import data from "gulp-data"; 
import  fs from 'fs';

const dataFromFile = JSON.parse(fs.readFileSync(sourse + '/pug/content.json'))

function browsersync() {
    browserSync.init({
        server: {
            baseDir: './' + publicPath,
            // middleware: bssi({ baseDir: './' + publicPath, ext: '.html' })
        },
        // ghostMode: { clicks: false },
        // notify: false,
        // online: true,
        // tunnel: 'layouts', // Attempt to use the URL https://layouts.loca.lt
    })
}

 
function pugFiles() {
    return  src([sourse + '/pug/pages/*.pug'])
    .pipe(data(function(file) {
        return JSON.parse(fs.readFileSync(sourse + '/pug/content.json'))
    }))
    .pipe(pug({ 
        pretty: true,
        cache: true, 
        // locals: dataFromFile || {}
    }).on("error", notify.onError())) 
    .pipe(tabify(2, true))
    // .pipe( urlBuilder() )
    .pipe(dest(publicPath))
    .on('end', browserSync.reload); 
}

function cleanlibs() {
    return del([publicPath + '/libs'], { force: true })
}

function copyLibs() {
    return src(npmDist({
        // copyUnminified: true, 
        excludes: [
            // '*.map',
            'src/**/*',
            './@babel/*',
            'animate.css/source/',
            'inputmask/inputmask/',
            'source',
            './babel*/*',
            './gulp*',
            'swiper/components',
            'swiper/angular',
            'swiper/react',
            'swiper/svelte',
            'swiper/cjs',
            'swiper/bundle',
            'swiper/vue',
            'swiper/**/*',
            'examples',
            'example',
            'node_modules',
            'core',
            'demo/**/*',
            'spec/**/*',
            'docs/**/*',
            'tests/**/*',
            'test/**/*',
            'Gruntfile.js',
            'gulpfile.js',
            'package.json',
            'package-lock.json',
            'bower.json',
            'composer.json',
            'yarn.lock',
            'webpack.config.js',
            'README',
            'LICENSE',
            'CHANGELOG',
            '*.yml',
            '*.md',
            '*.coffee',
            '*.ts',
            '*.scss',
            '*.sass',
            '*.less']
    }), { base: './node_modules' })
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
        }))
        .pipe(dest(publicPath + '/libs'));
}

function styles() {
    const processors = [
        autoprefixer(),
        nested(),
        cssnano(),
        gcmq(),
    ];
    return src(sourse + '/sass/main.scss')
        .pipe(sassGlob())
        .pipe(
            sass.sync()
                .on('error', sass.logError)
        )
        // .pipe(postcss(processors, { syntax: syntax }))
        .pipe(postcss(processors, { syntax: pscss }))
        // .pipe(gcmq())
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(dest(publicPath + '/css'))
        .pipe(browserSync.stream());

}
function common() {
    return src(
        [
            sourse + '/js/common.js',
            // sourse + '/pug/**/*.js',
        ])
        // .pipe(babel())
        // .pipe(tabify(2, true))
        .pipe(dest(publicPath + '/js'))
        .pipe(browserSync.stream());
}
function svg() {
        return src('./' + sourse + '/svg/*.svg')
            .pipe(svgmin({
                js2svg: {
                    pretty: true
                }
            }))
            .pipe(cheerio({
                run: function ($) {
                    $('[fill]').removeAttr('fill');
                    $('[stroke]').removeAttr('stroke');
                    $('[style]').removeAttr('style');
                    $('[opacity]').removeAttr('opacity');
                },
                parserOptions: { xmlMode: true }
            }))
            .pipe(replace('&gt;', '>'))
            .pipe(svgSprite({
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
                                template: './' + sourse + '/sass/templates/_sprite_template.scss',
                                dest: destSprite,
                            }
                        }
                    }
                }

            }))

            .pipe(dest(`${sourse}/sass/`)); 
}

function svgCopy() {
    return src(`${sourse}/sass/sprite.svg`)
        .pipe(plumber())
        .pipe(dest(`${publicPath}/img/svg/`))
    
}

function cleanimg() {
    const path = publicPath + '/img';
    return del([path + '/@*'], { force: true })
}

const path2 = `${publicPath}/img/@2x/`;
const path1 = `${publicPath}/img/@1x/`;
const w50 = metadata => Math.ceil(metadata.width * 0.5)

function img() {
    return src(`${sourse}/img/*.{png,jpg,jpeg,webp,raw}`)
        .pipe(sharpResponsive({
            formats: [
                // 2x
                { pngOptions: { quality: 90, progressive: true }, rename: { dirname: path2 } },
                { jpegOptions: { quality: 90, progressive: true }, rename: { dirname: path2 } },
                { format: "webp", webpOptions: { quality: 100, progressive: true }, rename: { dirname: `${path2}webp/` } },
                // { format: "avif", avifOptions: { quality: 100, progressive: true }, rename: { dirname: `${path2}avif/` } },

                // 1x
                // { width: w50, pngOptions: { quality: 80, progressive: true }, rename: { dirname: path1 } },
                // { width: w50, jpegOptions: { quality: 80, progressive: true }, rename: { dirname: path1 } },
                // {width: w50, webpOptions: { quality: 100, progressive: true }, format: "webp", rename: { dirname: `${path1}webp/` } },
                // { width: w50, avifOptions: { quality: 100, progressive: true }, format: "avif", rename: { dirname: `${path1}avif/` } },
                
            ]
        }))
        .pipe(dest(publicPath + '/img')) 
}
function startwatch() {
    watch([sourse + '/sass/**/*.css', sourse + '/pug/blocks/**/*.scss', sourse + '/sass/**/*.scss', sourse + '/sass/**/*.sass'], { usePolling: true }, styles);
    watch([sourse + '/pug/**/*.pug', sourse + '/pug/content.json'], { usePolling: true }, pugFiles);
    watch(sourse + '/svg/*.svg', { usePolling: true }, svg);
    // watch([sourse + '/js/libs.js'], { usePolling: true }, scripts);
    watch(sourse + '/sass/*.svg', { usePolling: true }, svgCopy);

    watch([sourse + '/js/common.js'], { usePolling: true }, common);
    watch(sourse + '/img', { usePolling: true }, img);
}

export let imgAll = series(cleanimg, img) 
export let libs = series(cleanlibs, copyLibs)
export let sprite = series(svg, svgCopy)



export default series(common, libs, styles, imgAll, sprite, pugFiles, parallel(browsersync, startwatch))