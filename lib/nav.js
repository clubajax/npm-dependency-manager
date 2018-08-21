const path = require('path');
const fs = require('fs');
const util = require('./util');
const config = require('./config');
const homedir = require('os').homedir();
const args = require('minimist')(process.argv.slice(2));
const name = args.r || args.repo;

if (!name) {
	console.log(`repo is required. ex:
node index -r my-repo
`);
	process.exit(0);
}


let repos;
// let current = name;
const nav = {

	getRepos () {
		// name: pkg.name,
		// pkg: pkg,
		// path: filePath
		// parents

		repos = repos || util.getRepoStructure(path.join(config.root));
		return repos;
	},

	getRepo (name) {
		name = name.split('/')[name.split('/').length - 1];
		const repos = this.getRepos();
		return repos.find(r => r.name === name || r.path.indexOf(name) > -1);
	},

	updateVersion (repo, semver) {
		const r = /\d+/g;
		const pkg = repo.pkg;
		const version = pkg.version;
		// console.log('version', pkg.version);
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
		// zero out remainder (minor: 1.1.0)
		if (digits[index + 1]) {
			digits[index + 1] = 0;
		}
		if (digits[index + 2]) {
			digits[index + 2] = 0;
		}
		pkg.version = digits.join('.');
		fs.writeFileSync(path.resolve(repo.path, 'package.json'), JSON.stringify(pkg, null, 2));
		return pkg.version;
	}
};

module.exports = nav;
