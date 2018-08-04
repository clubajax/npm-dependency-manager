const path = require('path');
const config = require('../config');
const args = require('minimist')(process.argv.slice(2));
const homedir = require('os').homedir();

const name = args.r || args.repo;

if (!name) {
	console.log(`repo is required. ex:
node index -r my-repo
`);
	process.exit(0);
}

console.dir(args);
console.log('here', process.cwd(), __dirname);


const nav = {
	repo () {
		const repo = path.join(homedir, config.root, name);
		process.chdir(repo);
		return repo;
	},
	pkg () {
		const pkg = path.resolve(this.repo(), 'package.json');
		const json = require(pkg);
		const rel = path.relative(__dirname, pkg);
		console.log(name, 'version:', json.version);
		return json;
	}
};

module.exports = nav;
