const path = require('path');
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
	pkg () {
		const pkg = path.resolve(this.repo(), 'package.json');
		const json = require(pkg);
		const rel = path.relative(__dirname, pkg);
		console.log(name, 'version:', json.version);
		return json;
	},
	getRepos () {
		repos = repos || util.getRepoStructure(path.join(homedir, config.root));
		return repos;
	}
};

module.exports = nav;
