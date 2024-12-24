"use strict";
let publicPath = "public",
	source = "sourse",
	destSprite = "../_sprite.scss",
	destSpriteC = "../_spriteC.scss";

import pkg from "gulp";
const {gulp, src, dest, parallel, series, watch} = pkg;

import {deleteAsync} from "del";
import pug from "gulp-pug";
import notify from "gulp-notify";
import svgmin from "gulp-svgmin";
import cheerio from "gulp-cheerio";
import replace from "gulp-replace";
import svgSprite from "gulp-svg-sprite";
import npmDist from "gulp-npm-dist";
import rename from "gulp-rename";
import gulpSass from "gulp-sass";
import sassGlob from "gulp-sass-glob";
import * as dartSass from "sass";
const sass = gulpSass(dartSass);
import tabify from "gulp-tabify";
import gcmq from "postcss-sort-media-queries";
import browserSync from "browser-sync";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import nested from "postcss-nested";
import pscss from "postcss-scss";
// )({ scss: 'postcss-scss'}),
import plumber from "gulp-plumber";
import sharpResponsive from "gulp-sharp-responsive";
import data from "gulp-data";
import fs from "fs";

const dataFromFile = JSON.parse(fs.readFileSync(source + "/pug/content.json"));
class gs {
	static browsersync() {
		browserSync.init({
			server: {
				baseDir: "./" + publicPath,
				// middleware: bssi({ baseDir: './' + publicPath, ext: '.html' })б
				serveStaticOptions: {
					extensions: ["html"],
				},
			},
			// ghostMode: { clicks: false },
			// notify: false,
			// online: true,
			// tunnel: 'layouts', // Attempt to use the URL https://layouts.loca.lt
		});
	}

	static pugFiles() {
		return (
			src([source + "/pug/pages/**/*.pug"])
				.pipe(
					data(function (file) {
						return JSON.parse(fs.readFileSync(source + "/pug/content.json"));
					})
				)
				.pipe(
					pug({
						pretty: true,
						cache: true,
						// locals: dataFromFile || {}
					}).on("error", notify.onError())
				)
				.pipe(tabify(2, true))
				// .pipe( urlBuilder() )
				.pipe(dest(publicPath))
				.on("end", browserSync.reload)
		);
	}

	static cleanLibs() {
		return deleteAsync([publicPath + "/libs"]);
	}

	static copyLibs() {
		return src(
			npmDist({
				copyUnminified: true,
				excludes: [
					// '*.map',
					"src/**/*",
					"./@babel/*",
					"animate.css/source/",
					"inputmask/inputmask/",
					"inputmask/bindings",
					"source",
					"./babel*/*",
					"./gulp*",
					"swiper/components",
					"swiper/angular",
					"swiper/react",
					"swiper/svelte",
					"swiper/cjs",
					"swiper/bundle",
					"swiper/vue",
					// '*.mjs',
					"swiper/modules",
					"swiper/shared",
					"swiper/types",
					"examples",
					"example",
					"node_modules",
					"core",
					"demo/**/*",
					"spec/**/*",
					"docs/**/*",
					"tests/**/*",
					"test/**/*",
					"Gruntfile.js",
					"gulpfile.js",
					"package.json",
					"package-lock.json",
					"bower.json",
					"composer.json",
					"yarn.lock",
					"webpack.config.js",
					"README",
					"LICENSE",
					"CHANGELOG",
					"*.yml",
					"*.md",
					"*.coffee",
					"*.ts",
					"*.less",
				],
			}),
			{base: "./node_modules"}
		)
			.pipe(
				rename(function (path) {
					path.dirname = path.dirname
						.replace(/\/dist/, "")
						.replace(/\\dist/, "");
				})
			)
			.pipe(dest(publicPath + "/libs"));
	}

	static watchStyle(file) {
		const processors = [autoprefixer(), nested(), cssnano(), gcmq()];
		return (
			src(source + `/sass/${file}.scss`)
				.pipe(sassGlob())
				.pipe(sass.sync().on("error", sass.logError))
				// .pipe(postcss(processors, { syntax: syntax }))
				.pipe(postcss(processors, {syntax: pscss}))
				// .pipe(gcmq())
				.pipe(rename({suffix: ".min", prefix: ""}))
				.pipe(dest(publicPath + "/css"))
				.pipe(browserSync.stream())
		);
	}
	static styles() {
		const processors = [autoprefixer(), nested(), cssnano(), gcmq()];
		return src(source + `/sass/main.scss`)
			.pipe(sassGlob())
			.pipe(sass.sync().on("error", sass.logError))
			.pipe(postcss(processors, {syntax: pscss}))
			.pipe(rename({suffix: ".min", prefix: ""}))
			.pipe(dest(publicPath + "/css"))
			.pipe(browserSync.stream());
	}

	static bootstrapStyles() {
		const processors = [autoprefixer(), nested(), cssnano(), gcmq()];
		return src(source + `/sass/custom-bootstrap.scss`)
			.pipe(sass.sync().on("error", sass.logError))
			.pipe(postcss(processors, {syntax: pscss}))
			.pipe(rename({suffix: ".min", prefix: ""}))
			.pipe(dest(publicPath + "/css"))
			.pipe(browserSync.stream());
	}

	static commonJs() {
		return (
			src([
				source + "/js/**/*.js",
				// sourse + '/pug/**/*.js',
			])
				// .pipe(babel())
				// .pipe(tabify(2, true))
				.pipe(dest(publicPath + "/js"))
				.pipe(browserSync.stream())
		);
	}
	static svg() {
		return src("./" + source + "/svg/*.svg")
			.pipe(
				svgmin({
					js2svg: {
						pretty: true,
					},
				})
			)
			.pipe(
				cheerio({
					run: function ($) {
						$("[fill]").removeAttr("fill");
						$("[stroke]").removeAttr("stroke");
						$("[style]").removeAttr("style");
						$("[opacity]").removeAttr("opacity");
					},
					parserOptions: {xmlMode: true},
				})
			)
			.pipe(replace("&gt;", ">"))
			.pipe(
				svgSprite({
					shape: {
						dimension: {
							// Set maximum dimensions
							maxWidth: 500,
							maxHeight: 500,
						},
						spacing: {
							// Add padding
							padding: 0,
						},
					},
					mode: {
						symbol: {
							sprite: "../sprite.svg",
							render: {
								scss: {
									template:
										"./" + source + "/sass/templates/_sprite_template.scss",
									dest: destSprite,
								},
							},
						},
					},
				})
			)

			.pipe(dest(`${source}/sass/`));
	}

	static svgCopy() {
		return src(`${source}/sass/sprite.svg`)
			.pipe(plumber())
			.pipe(dest(`${publicPath}/img/svg/`));
	}

	static cleanImg() {
		const path = publicPath + "/img";
		return deleteAsync([path + "/@*"]);
	}

	static img() {
		const path1 = `${publicPath}/img/@1x/`;
		const path2 = `${publicPath}/img/@2x/`;
		const w50 = metadata => Math.ceil(metadata.width * 0.5);
		return src(`${source}/img/*.{png,jpg,jpeg,webp,raw}`)
			.pipe(
				sharpResponsive({
					formats: [
						// 2x
						{
							pngOptions: {quality: 90, progressive: true},
							rename: {dirname: path2},
						},
						{
							jpegOptions: {quality: 90, progressive: true},
							rename: {dirname: path2},
						},
						{
							format: "webp",
							webpOptions: {quality: 100, progressive: true},
							rename: {dirname: `${path2}webp/`},
						},
						// { format: "avif", avifOptions: { quality: 100, progressive: true }, rename: { dirname: `${path2}avif/` } },

						// 1x
						// { width: w50, pngOptions: { quality: 80, progressive: true }, rename: { dirname: path1 } },
						// { width: w50, jpegOptions: { quality: 80, progressive: true }, rename: { dirname: path1 } },
						// {width: w50, webpOptions: { quality: 100, progressive: true }, format: "webp", rename: { dirname: `${path1}webp/` } },
						// { width: w50, avifOptions: { quality: 100, progressive: true }, format: "avif", rename: { dirname: `${path1}avif/` } },
					],
				})
			)
			.pipe(dest(publicPath + "/img"));
	}
	static startwatch() {
		watch(
			[
				source + "/sass/**/*.css",
				source + "/sass/**/*.scss",
				`!${source}/sass/custom-bootstrap.scss`,
				source + "/sass/**/*.sass",
				`${source}/pug/blocks/**/*.scss`,
			],
			{usePolling: true},
			gs.styles
		);
		watch(
			[
				source + "/sass/**/*.css",
				source + "/sass/**/*.scss",
				`!${source}/sass/_base.scss`,
				`!${source}/sass/_root.scss`,
				`!${source}/sass/_fonts.scss`,
				source + "/sass/**/*.sass",
			],
			{usePolling: true},
			gs.bootstrapStyles
		);
		watch(
			[source + "/pug/**/*.pug", source + "/pug/content.json"],
			{usePolling: true},
			gs.pugFiles
		);
		watch(source + "/svg/*.svg", {usePolling: true}, gs.svg);
		// watch([sourse + '/js/libs.js'], { usePolling: true }, gs.scripts);
		watch(source + "/sass/*.svg", {usePolling: true}, gs.svgCopy);

		// watch(source + "/svgC/*.svg", {usePolling: true}, gs.svgC);
		// watch(source + "/sass/*.svg", {usePolling: true}, gs.svgCopyC);

		watch([source + "/js/*.js"], {usePolling: true}, gs.commonJs);
		// watch(sourse + '/img', { usePolling: true }, gs.img);
	}
}
export let imgAll = series(gs.cleanImg, gs.img);
export let libs = series(gs.cleanLibs, gs.copyLibs);
export let sprite = series(gs.svg, gs.svgCopy);
// export let sprite2 = series(gs.svgC, gs.svgCopyC);
export let styles = parallel(gs.bootstrapStyles, gs.styles);

export default series(
	gs.commonJs,
	libs,
	styles,
	// imgAll,
	parallel(sprite),
	gs.pugFiles,
	parallel(gs.browsersync, gs.startwatch)
);
