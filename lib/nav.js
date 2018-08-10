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

	getPkg () {
		const pkg = path.resolve(this.setRepo(), 'package.json');
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
		fs.writeFileSync(path.resolve(this.setRepo(), 'package.json'), JSON.stringify(pkg, null, 2));
		return pkg.version;
	},
	updateParent (parentPath, depName, version) {
		this.setRepo(parentPath);
		const pkg = this.getPkg();


	},
	setRepo (repoPath) {
		repoPath = repoPath || path.join(homedir, config.root, current);
		console.log('repoPath', repoPath);
		process.chdir(repoPath);
		return repoPath;
	},
	getRepos () {
		// name: pkg.name,
		// pkg: pkg,
		// path: filePath
		// parents

		repos = repos || util.getRepoStructure(path.join(homedir, config.root));
		return repos;
	},
	getRepo (name = current) {
		name = name.split('/')[name.split('/').length - 1];
		const repos = this.getRepos();
		console.log('find::', name);
		// console.log('repos', repos);
		return repos.find(r => r.name === name || r.path.indexOf(name) > -1);
	}
};

module.exports = nav;
