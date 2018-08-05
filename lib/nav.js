const path = require('path');
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
	parent () {
		const parent = find(config.repos, current);
		if (parent) {
			console.log('new repo', parent);
			current = parent;
		}
		return parent;
	}
};

function find (map, match, parent) {
	// console.log('\nparent/match', fix(parent), fix(match));
	const keys = Object.keys(map);
	for (let k = 0; k < keys.length; k++) {
		const name = keys[k];
		// console.log('    name', fix(name));
		if (name === match) {
			// console.log(' --- found, parent', parent);
			return parent;
		}
		const result = find(map[name], match, name);
		if (result) {
			return result;
		}
	}
}

function fix (name) {
	return name ? name.replace('./github/', '') : '*';
}

// {
// 	'undo-stack': {
// 	'foo': { 'foo-child': {} },
// 	'bar': {
// 		'bar-child': {
// 			'bar-grand-child': {}
// 		}
// 	},
// 	'proxify': { 'foo-child': {} },
// }
// }

// {
// 	'undo-stack': [
// 	{
// 		'foo': [
// 			{
// 				'foo-child': []
// 			}
// 		],
// 		'bar': [
// 			{
// 				'bar-child': []
// 			}
// 		]
// 	},
// 	{
// 		'proxify': []
// 	}
// ]
// }

module.exports = nav;
