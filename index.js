const nav = require('./lib/nav');
const git = require('./lib/git');

nav.pkg();
git.commit('test commit').then(git.push);