const nav = require('./lib/nav');
const git = require('./lib/git');

nav.pkg();
nav.parent();
nav.pkg();
nav.parent();
nav.pkg();

// git.commit('test commit').then(git.push);