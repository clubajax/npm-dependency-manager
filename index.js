const nav = require('./lib/nav');
const git = require('./lib/git');
const util = require('./lib/util');
const config = require('./lib/config');
const DEFAULT_PKG_MESSAGE = 'update version';
const DEFAULT_PRN_MESSAGE = 'update dependencies';

const reposToSave = {};

function save (path, options) {
	process.chdir(path);
	console.log('save', path);
	return git.save(options);
}

async function saveRepos (callback) {

	function sendSave () {
		const path = Object.keys(reposToSave)[0];
		if (!path) {
			callback();
		}
		const options = reposToSave[path];
		console.log('options', options);
		delete reposToSave[path];
		save(path, options).then(() => {
			console.log('done! save next...');
		});
	}
	sendSave();

	// await Promise.all(Object.keys(reposToSave).map(async (path) => {
	// 	const options = reposToSave[path];
	// 	return save(path, options);
	// }));

	//console.log(reposToSave);
	// callback();
}

function saveLater (repoPath, options) {
	// collect all paths, including base repo, for saving later
	if (!Object.keys(reposToSave).find(path => path === repoPath)) {
		reposToSave[repoPath] = options;
	}
}

function isToBeSaved (path) {
	return !!Object.keys(reposToSave).find(repoPath => repoPath === path);
}

function updateParents (repo) {
	// console.log('repo', repo.name);
	if (!repo.parents) {
		return;
	}
	repo.parents.forEach((parentPath) => {
		// update dependency
		const parentRepo = nav.getRepo(parentPath);
		// console.log('    parent', parentRepo.name);
		const deps = parentRepo.pkg.dependencies[repo.name] ? parentRepo.pkg.dependencies : parentRepo.pkg.devDependencies;
		deps[repo.name] = repo.pkg.version;

		updateRepo({
			name: parentRepo.name,
			updateType: 'patch',
			message: DEFAULT_PRN_MESSAGE
		});
	});
}

function updateRepo (options) {

	const { name, updateType } = options;

	const repo = nav.getRepo(name);


	// if (!isToBeSaved(repo.path)) {
	options.version = nav.updateVersion(repo, updateType);
	// } else {
	// 	console.log('    no update needed', repo.name);
	// }

	updateParents(repo, updateType);

	// don't save until later
	// everything can be sync until using git
	saveLater(repo.path, options);

}

function testRepos () {
	const repos = nav.getRepos();
	util.log(repos, true);
}

module.exports = (options) => {
	config.init(() => {
		options.message = options.message || DEFAULT_PKG_MESSAGE;
		updateRepo(options);
		saveRepos(() => {
			process.exit(0);
		});
	});
};


