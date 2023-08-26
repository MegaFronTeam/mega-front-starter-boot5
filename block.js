'use strict';

import  fs from 'fs'
import  colors from 'colors'
import  readline from 'readline'
// import { fileURLToPath } from 'url'
import path  from 'path'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const rl = readline.createInterface(process.stdin, process.stdout);

// folder with all blocks
const BLOCKS_DIR = path.join('sourse/pug/blocks');

//////////////////////////////////////////////////////////////////////////////////////////////////

// default content for files in new block
const fileSources = {
	pug: `mixin {blockName}(data)
	// start {blockName}
	+b.SECTION.{blockName}.section#{blockName}&attributes(attributes)
		.container
			+b.section-title.text-center
				h2 {blockName}
				
			+e.row.row
	// end {blockName}`,
	scss: `// start .{blockName}
.{blockName} \{
	// --sPT: #{rem()};
	// --sPB: #{rem()};
	// --sTPB: #{rem()};
	
	&__row{
		// --bs-gutter-x: #{rem()};
		// --bs-gutter-y: #{rem()};
	}
	.section-title{
		
	}
	&__col{
		
	}
	&__item{
		
	}

	@include media-breakpoint-up(xl) {}
	@include media-breakpoint-up(lg) {}
	@include media-breakpoint-up(md) {}
	@include media-breakpoint-up(sm) {}
	@include media-breakpoint-between(md, xl) {}
	@include media-breakpoint-only(xl) {}
	@include media-breakpoint-down(xl) {}
} // end.{blockName}`
	,
	// js: `let {blockName}Vue = new Vue({
	// 	el: '#{blockName}',
	// 	data: {
	// 		imgSRc: 'img/',
	// 	},
	// 	methods: { 
	// 	},
	// 	 created: function () { 
	// 	},
	// 	computed: {

	// 	},
	// })`
};

function validateBlockName(blockName) {
	return new Promise((resolve, reject) => {
		const isValid = /^(\d|\w|-)+$/.test(blockName);

		if (isValid) {
			resolve(isValid);
		} else {
			const errMsg = (
				`ERR>>> An incorrect block name '${blockName}'\n` +
				`ERR>>> A block name must include letters, numbers & the minus symbol.`
			);
			reject(errMsg);
		}
	});
}

function directoryExist(blockPath, blockName) {
	return new Promise((resolve, reject) => {
		fs.stat(blockPath, notExist => {
			if (notExist) {
				resolve();
			} else {
				reject(`ERR>>> The block '${blockName}' already exists.`.red);
			}
		});
	});
}

function createDir(dirPath) {
	return new Promise((resolve, reject) => {
		fs.mkdir(dirPath, err => {
			if (err) {
				reject(`ERR>>> Failed to create a folder '${dirPath}'`.red);
			} else {
				resolve();
			}
		});
	});
}

function createFiles(blocksPath, blockName) {
	const promises = [];
	Object.keys(fileSources).forEach(ext => {
		const fileSource = fileSources[ext].replace(/\{blockName}/g, blockName);
		const filename = `_${blockName}.${ext}`;
		const filePath = path.join(blocksPath, filename);

		promises.push(
			new Promise((resolve, reject) => {
				fs.writeFile(filePath, fileSource, 'utf8', err => {
					if (err) {
						reject(`ERR>>> Failed to create a file '${filePath}'`.red);
					} else {
						resolve();
					}
				});
			})
		);
	});

	return Promise.all(promises);
}

function getFiles(blockPath) {
	return new Promise((resolve, reject) => {
		fs.readdir(blockPath, (err, files) => {
			if (err) {
				reject(`ERR>>> Failed to get a file list from a folder '${blockPath}'`);
			} else {
				resolve(files);
			}
		});
	});
}

function printErrorMessage(errText) {
	console.log(errText);
	rl.close();
}

// //////////////////////////////////////////////////////////////////////////

function initMakeBlock(blockName) {
	const blockPath = path.join(BLOCKS_DIR, blockName);

	return validateBlockName(blockName)
		.then(() => directoryExist(blockPath, blockName))
		.then(() => createDir(blockPath))
		.then(() => createFiles(blockPath, blockName))
		.then(() => getFiles(blockPath))
		.then(files => {
			const line = '-'.repeat(48 + blockName.length);
			console.log(line);
			console.log(`The block has just been created in 'sourse/pug/blocks/${blockName}'`);
			console.log(line);

			// Displays a list of files created
			files.forEach(file => console.log(file.yellow));

			rl.close();
		});
}


// //////////////////////////////////////////////////////////////////////////
//
// Start here
//

// Command line arguments
const blockNameFromCli = process.argv
	.slice(2)
	// join all arguments to one string (to simplify the capture user input errors)
	.join(' ');


// If the user pass the name of the block in the command-line options
// that create a block. Otherwise - activates interactive mode
if (blockNameFromCli !== '') {
	initMakeBlock(blockNameFromCli).catch(printErrorMessage);
}
else {
	rl.setPrompt('Block name: '.magenta);
	rl.prompt();
	rl.on('line', (line) => {
		const blockName = line.trim();
		initMakeBlock(blockName).catch(printErrorMessage);
	});
}