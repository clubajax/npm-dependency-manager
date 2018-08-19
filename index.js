const nav = require('./lib/nav');
const git = require('./lib/git');
const util = require('./lib/util');
const config = require('./lib/config');
const args = require('minimist')(process.argv.slice(2));
const DEFAULT_PKG_MESSAGE = 'update version';
const DEFAULT_PRN_MESSAGE = 'update dependencies';



// console.log('ARGS', args);
// update and publish repo, return version
// update repo's parents
// recursively update parent's parents
// commit, tag, and publish all parents

// nav.getRepos();
// nav.setRepo();
// nav.getPkg();

// git.commit('test commit').then(git.push);

//git.status().then((status) => { console.log('git.status::', status); });

const reposToSave = [];

function save () {
	git.save(msg || DEFAULT_PKG_MESSAGE, version).then(() => {

	});
}

function saveLater (repoPath) {
	// collect all paths, including base repo, for saving later
	if (reposToSave.indexOf(repoPath) === -1) {
		reposToSave.push(repoPath);
	}
}

function updateParents (repo) {
	const msg = args.msg || args.message;
	const updateType = 'patch';
	const version = repo.pkg.version;
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

		// continue
		updateRepo(parentRepo.name);
	});
}

function updateRepo (name, updateType = 'patch') {
	const msg = args.msg || args.message;
	const repo = nav.getRepo(name);


	if (reposToSave.indexOf(repo.path) === -1) {
		nav.updateVersion(repo, updateType);
	} else {
		console.log('    no update needed', repo.name);
	}

	updateParents(repo);

	// don't save until later
	// everything can be sync until using git
	saveLater(repo.path);

}

function testRepos () {
	const repos = nav.getRepos();
	util.log(repos, true);
}

// testRepos();

const repoName = args.r || args.repo;
const updateType = args.M ? 'major' : args.m ? 'minor' : 'patch';
// updateRepo(repoName, updateType);
// console.log('to save:', reposToSave);

config.init(() => {
	console.log('done!');
	process.exit(0);
});


