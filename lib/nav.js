const path = require('path');
const fs = require('fs');
const util = require('./util');
const config = require('../config');
const homedir = require('os').homedir();
const args = require('minimist')(process.argv.slice(2));
//console.dir(args);

const name = args.r || args.repo;

if (!name) {
	console.log(`repo is required. ex:
node index -r my-repo
`);
	process.exit(0);
}


let repos;
let current = name;
const nav = {
	repo () {
		const repo = path.join(homedir, config.root, current);
		console.log('repo', repo);
		process.chdir(repo);
		return repo;
	},
	getPkg () {
		const pkg = path.resolve(this.repo(), 'package.json');
		return require(pkg);
	},
	pkg () {
		const json = this.getPkg();
		console.log(name, 'version:', json.version);
		return json;
	},
	updateVersion (semver) {
		const r = /\d+/g;
		const pkg = this.pkg();
		const version = pkg.version;
		console.log('version', pkg.version);
		const digits = version.match(r);
		let index;
		switch (semver) {
			case 'major':
				index = 0;
				break;
			case 'minor':
				index = 1;
				break;
			default:
				index = 2;
		}
		digits[index] = parseInt(digits[index]) + 1;
		pkg.version = digits.join('.');
		console.log(pkg);
		fs.writeFileSync(path.resolve(this.repo(), 'package.json'), JSON.stringify(pkg, null, 2));
	},
	getRepos () {
		repos = repos || util.getRepoStructure(path.join(homedir, config.root));
		return repos;
	}
};

module.exports = nav;
