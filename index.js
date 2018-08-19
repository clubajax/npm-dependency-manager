const nav = require('./lib/nav');
const git = require('./lib/git');
const util = require('./lib/util');
const config = require('./lib/config');
const DEFAULT_PKG_MESSAGE = 'update version';
const DEFAULT_PRN_MESSAGE = 'update dependencies';

const reposToSave = [];

function save () {
	git.save(msg || DEFAULT_PKG_MESSAGE, version).then(() => {

	});
}

function saveLater (repoPath, options) {
	// collect all paths, including base repo, for saving later
	if (!reposToSave.find(r => Object.keys(r)[0] === repoPath)) {
		reposToSave.push({
			[repoPath]: options
		});
	}
}

function updateParents (repo) {
	console.log('repo', repo.name);
	if (!repo.parents) {
		return;
	}
	repo.parents.forEach((parentPath) => {
		// update dependency
		const parentRepo = nav.getRepo(parentPath);
		console.log('    parent', parentRepo.name);
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


	if (reposToSave.indexOf(repo.path) === -1) {
		nav.updateVersion(repo, updateType);
	} else {
		console.log('    no update needed', repo.name);
	}

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
	});
};


