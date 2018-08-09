const nav = require('./lib/nav');
const git = require('./lib/git');

// update and publish repo, return version
// update repo's parents
// recursively update parent's parents
// commit, tag, and publish all parents

nav.getRepos();
// nav.pkg();
// nav.parent();
// nav.pkg();
// nav.parent();
// nav.pkg();

// git.commit('test commit').then(git.push);