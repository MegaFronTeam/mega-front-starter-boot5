"use strict";

const paths = {
	publicDir: "public",
	sourceDir: "source",
	libsDir: "public/libs",
	cssDir: "public/css",
	jsDir: "public/js",
	spritePublicDir: "public/img/svg",
	pugPages: "source/pug/pages/**/*.pug",
	pugData: "source/pug/content.json",
	sassMainEntry: "source/sass/main.scss",
	sassBootstrapEntry: "source/sass/custom-bootstrap.scss",
	sassWatch: [
		"source/sass/**/*.css",
		"source/sass/**/*.scss",
		"source/sass/**/*.sass",
		"source/pug/blocks/**/*.scss",
	],
	jsWatch: "source/js/**/*.js",
	svgSource: "source/svg/*.svg",
	spriteTemplate: "source/sass/templates/_sprite_template.scss",
	spriteScssDest: "../_sprite.scss",
	spriteSource: "source/sass/sprite.svg",
};

const shouldMinifyCss =
	process.env.NODE_ENV === "production" ||
	process.env.GULP_MINIFY_CSS === "true";
const usePolling = process.env.GULP_USE_POLLING === "true";

import pkg from "gulp";
const {src, dest, parallel, series, watch, lastRun} = pkg;

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
import plumber from "gulp-plumber";
import data from "gulp-data";
import fs from "fs";

const readPugData = () => JSON.parse(fs.readFileSync(paths.pugData, "utf8"));
const createCssProcessors = () => {
	const processors = [autoprefixer(), nested(), gcmq()];
	if (shouldMinifyCss) {
		processors.push(cssnano());
	}
	return processors;
};

class BuildTasks {
	static serve() {
		browserSync.init({
			server: {
				baseDir: `./${paths.publicDir}`,
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

	static compilePug() {
		const pageData = readPugData();
		return (
			src([paths.pugPages])
				.pipe(
					data(function () {
						return pageData;
					})
				)
				.pipe(
					pug({
						pretty: true,
						cache: true,
						// locals: pageData || {}
					}).on("error", notify.onError())
				)
				.pipe(tabify(2, true))
				// .pipe( urlBuilder() )
				.pipe(dest(paths.publicDir))
				.on("end", browserSync.reload)
		);
	}

	static cleanVendorLibs() {
		return deleteAsync([paths.libsDir]);
	}

	static copyVendorLibs() {
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
			.pipe(dest(paths.libsDir));
	}

	static ensureVendorLibs(done) {
		const hasLibs =
			fs.existsSync(paths.libsDir) && fs.readdirSync(paths.libsDir).length > 0;
		if (hasLibs) {
			done();
			return;
		}

		return BuildTasks.copyVendorLibs();
	}

	static compileMainStyles() {
		const processors = createCssProcessors();
		return src(paths.sassMainEntry)
			.pipe(sassGlob())
			.pipe(sass.sync().on("error", sass.logError))
			.pipe(postcss(processors))
			.pipe(rename({suffix: ".min", prefix: ""}))
			.pipe(dest(paths.cssDir))
			.pipe(browserSync.stream());
	}

	static compileBootstrapStyles() {
		const processors = createCssProcessors();
		return src(paths.sassBootstrapEntry)
			.pipe(sass.sync().on("error", sass.logError))
			.pipe(postcss(processors))
			.pipe(rename({suffix: ".min", prefix: ""}))
			.pipe(dest(paths.cssDir))
			.pipe(browserSync.stream());
	}

	static copyScripts() {
		return (
			src(
				[
					paths.jsWatch,
					// source + '/pug/**/*.js',
				],
				{since: lastRun(BuildTasks.copyScripts)}
			)
				// .pipe(babel())
				// .pipe(tabify(2, true))
				.pipe(dest(paths.jsDir))
				.pipe(browserSync.stream())
		);
	}

	static buildSvgSprite() {
		return src(paths.svgSource)
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
									template: `./${paths.spriteTemplate}`,
									dest: paths.spriteScssDest,
								},
							},
						},
					},
				})
			)

			.pipe(dest(`${paths.sourceDir}/sass/`));
	}

	static copySvgSprite() {
		return src(paths.spriteSource)
			.pipe(plumber())
			.pipe(dest(paths.spritePublicDir));
	}

	static watchFiles() {
		const watchOptions = {usePolling};
		const stylesTask = parallel(
			BuildTasks.compileMainStyles,
			BuildTasks.compileBootstrapStyles
		);

		watch(paths.sassWatch, watchOptions, stylesTask);
		watch(
			[`${paths.sourceDir}/pug/**/*.pug`, paths.pugData],
			watchOptions,
			BuildTasks.compilePug
		);
		watch(
			paths.svgSource,
			watchOptions,
			series(BuildTasks.buildSvgSprite, BuildTasks.copySvgSprite)
		);
		watch(paths.jsWatch, watchOptions, BuildTasks.copyScripts);
	}
}

export const libs = series(
	BuildTasks.cleanVendorLibs,
	BuildTasks.copyVendorLibs
);
export const sprite = series(
	BuildTasks.buildSvgSprite,
	BuildTasks.copySvgSprite
);
export const styles = parallel(
	BuildTasks.compileBootstrapStyles,
	BuildTasks.compileMainStyles
);

export const build = series(
	BuildTasks.copyScripts,
	libs,
	styles,
	sprite,
	BuildTasks.compilePug
);

export const dev = series(
	BuildTasks.copyScripts,
	BuildTasks.ensureVendorLibs,
	styles,
	sprite,
	BuildTasks.compilePug,
	parallel(BuildTasks.serve, BuildTasks.watchFiles)
);

export default dev;
