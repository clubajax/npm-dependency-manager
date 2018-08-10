const fs = require('fs');
const path = require('path');
const config = require('../config');

const configIgnores = (config.ignore || '').split(',').map(m => m.trim()).join('|');
const ignoreStr = `node_modules|^\\.|${configIgnores}`; // will this work if ignores are empty?
const ignore = new RegExp(ignoreStr);
let count = 100;
const MAX_DEPTH = 1;

function getRepoStructure (dir) {
	const list = getList(dir);
	const map = list.reduce((map, item, i) => {
		map[item.name] = i;
		return map;
	}, {});

	// console.log('list:\n', map);

	list.forEach((item) => {
		getDeps(item).forEach((dep) => {
			if (map[dep] !== undefined) {
				list[map[dep]].parents = list[map[dep]].parents || [];
				list[map[dep]].parents.push(item.path);
			}
			// else if (!/babel|grunt|react|webpack|loader/.test(dep)) {
			// 	console.log('not found', dep);
			// }
		});
	});
	// log(list);
	return list;
}

function getDeps (item) {
	let deps = [];
	if (item.pkg && item.pkg.dependencies) {
		deps = [...deps, ...Object.keys(item.pkg.dependencies)];
	}
	if (item.pkg && item.pkg.devDependencies) {
		deps = [...deps, ...Object.keys(item.pkg.devDependencies)];
	}
	return deps;
}
function getList (dir, files = [], depth = 0) {
	if (count-- < 0) {
		return files;
	}
	if (depth > MAX_DEPTH) {
		return files;
	}

	fs.readdirSync(dir).forEach(file => {
		if (!ignore.test(file)) {
			const filePath = path.join(dir, file);
			const isDir = fs.statSync(filePath).isDirectory();
			if (isDir) {
				const pkg = getPackage(filePath);
				if (pkg) {
					depth = 0;
					// console.log('filez', files);
					files.push({
						name: pkg.name,
						pkg: pkg,
						path: filePath,
						dir: filePath.split('/')[filePath.split('/').length - 1]
					});
				} else {
					files = getList(filePath, files, depth + 1);
				}
			}
		}
		else {
			// console.log('ignore', file);
		}
	});
	return files;
}

function getPackage (filePath) {
	const pkgPath = path.join(filePath, 'package.json');
	if (fs.existsSync(pkgPath)) {
		return require(pkgPath);
	}
	return false;
}

// const isClubajax = /@clubajax/;
const isClubajax = /grand|father|mother/;
function log (list, all) {
	list.forEach((item) => {
		if (isClubajax.test(item.name)) {
			console.log('');
			console.log(item.name);
			console.log(item.parents);
		}
	});
}

module.exports = {
	getRepoStructure,
	log
};
