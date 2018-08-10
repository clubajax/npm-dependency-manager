const nav = require('./lib/nav');
const git = require('./lib/git');
const args = require('minimist')(process.argv.slice(2));
const DEFAULT_PKG_MESSAGE = 'update version';
const DEFAULT_PRN_MESSAGE = 'update dependencies';

console.log('ARGS', args);
// update and publish repo, return version
// update repo's parents
// recursively update parent's parents
// commit, tag, and publish all parents

// nav.getRepos();
// nav.setRepo();
// nav.pkg();

// git.commit('test commit').then(git.push);

//git.status().then((status) => { console.log('git.status::', status); });

console.log('repo', nav.getRepo());

function testUpdateParent () {
	const msg = args.msg || args.message;
	const updateType = args.M ? 'major' : args.m ? 'minor' : 'patch';
	const version = nav.updateVersion(updateType);
	const repo = nav.getRepo();
	console.log('repo', repo);
	repo.parents.forEach((parentPath) => {
		nav.setRepo(parentPath);
		const parentRepo = nav.getRepo(parentPath);
		console.log('PARENT\n', parentRepo);

		const deps = parentRepo.pkg.dependencies[repo.name] ? parentRepo.pkg.dependencies : parentRepo.pkg.devDependencies;
		deps[repo.name] = repo.pkg.version;
		console.log('PARENT\n', parentRepo);
	});
}

function updateRepo () {
	const msg = args.msg || args.message;
	const updateType = args.M ? 'major' : args.m ? 'minor' : 'patch';
	const version = nav.updateVersion(updateType);
	git.save(msg || DEFAULT_PKG_MESSAGE, version).then(() => {

	});
}

testUpdateParent();