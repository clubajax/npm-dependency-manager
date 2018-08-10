const nav = require('./lib/nav');
const git = require('./lib/git');

// update and publish repo, return version
// update repo's parents
// recursively update parent's parents
// commit, tag, and publish all parents

// nav.getRepos();
nav.repo();
// nav.pkg();

// git.commit('test commit').then(git.push);

git.status().then((status) => {
	console.log('git.status::', status);
});
