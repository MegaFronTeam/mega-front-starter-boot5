
// // module.exports = function () {

// // 	const source2 = $.source + '/img';
// // 	const path = $.public + '/img';
// // 	let src = source2 + "/*.{png,jpg,jpeg,webp,raw}";
// // 	let src2 = source2 + "/*.{png,jpg}";

// // 	// Clean @*x IMG's
// // 	$.gulp.task('cleanimg', function () {
// // 		return $.del([path + '/@*'], { force: true })
// // 	});
// // 	$.gulp.task('img-responsive', async function () {
// // 		return $.gulp.src(src)
// // 			// .pipe($.gp.newer(path + '/@1x'))
// // 			.pipe($.responsive({
// // 				'*': [{
// // 					// Produce @2x images
// // 					quality: 75, progressive: true, rename: { prefix: '@2x/', },
// // 				},
// // 				{
// // 					webp: { quality: 100 }, progressive: true, rename: { prefix: '@2x/webp/', extname: '.webp' },
// // 				},
// // 					{
// // 						// Produce @2x images
// // 						resize: {width: '50%'},
// // 						quality: 75, progressive: true, rename: { prefix: '@1x/', },
// // 					},
// // 					{
// // 						resize: {width: '50%'},
// // 						webp: { quality: 100 }, progressive: true, rename: { prefix: '@1x/webp/', extname: '.webp' },
// // 					}
// // 			]
// // 			}))
			
// // 			.on('error', function () { console.log('No matching images found') })
// // 			.pipe($.rename(function (path) { path.extname = path.extname.replace('jpeg', 'jpg') }))
// // 			// .pipe($.gp.vinylFlow())
// // 			.pipe($.gulp.dest(path))
// // 	});

// // 	$.gulp.task('img1x', function () { 
// // 	});
// // }
// const { src, dest } = require("gulp");
// // const sharpResponsive = require("sharp-responsive");

// const source2 = $.source + '/img';
// const path = $.public + '/img';
// let srci = source2 + "/*.{png,jpg,jpeg,webp,raw}";
// let src2 = source2 + "/*.{png,jpg}";

// let x2 = { dirname: '@2x/' }
// let x1 = { dirname: '@1x/' }
// // module.exports = function () {



// const img = () => src(srci)
// 	.pipe(sharpResponsive({
// 		formats: [
// 			{ width: (metadata) => metadata.width * 1, format: "webp" },
// 			{ width: (metadata) => metadata.width * 1, format: "avif" },
// 		]
// 	}))

// 	.pipe(dest(path))

// module.exports = {
// 	img,
// };