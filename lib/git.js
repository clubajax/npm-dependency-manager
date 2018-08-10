const nodeCmd = require('node-cmd');
const util = require('util');
const cmd = util.promisify(nodeCmd.get);

module.exports = {
	status () {
		return new Promise((resolve) => {
			cmd('git status').then((status) => {
				resolve(/git\sadd/.test(status) ? 'add' : /git\spush/.test(status) ? 'push' : 'clean');
			});
		});
	},
	commit (msg) {
		if (!msg) {
			console.log('cannot commit without a message');
			process.exit(0);
		}
		return cmd(`
		git add .
		git commit -m "${msg}"
		`);
	},
	pull () {
		return cmd(`git pull`);
	},
	push () {
		return cmd(`git push`);
	},
	tag (version) {
		if (!version) {
			console.log('cannot tag without a version');
			process.exit(0);
		}
		return cmd(`
		git tag ${version}
		git push --tag`);
	},
	save (msg, version) {
		return this.commit(msg).then(() => {
			return this.push().then(() => {
				return this.tag(version);
			});
		});
	}
};

// don't really need the status, because the package needs its version changed anyway
// clean:::
// status On branch master
// Your branch is up-to-date with 'origin/master'.
// nothing to commit, working tree clean
//
// needs add:::
// On branch master
// Your branch is up-to-date with 'origin/master'.
// 	Changes not staged for commit:
// (use "git add <file>..." to update what will be committed)
// (use "git checkout -- <file>..." to discard changes in working directory)
// modified:   tests/test.html
// no changes added to commit (use "git add" and/or "git commit -a")
//
// needs push:::
// On branch master
// Your branch is ahead of 'origin/master' by 1 commit.
// (use "git push" to publish your local commits)
// nothing to commit, working tree clean