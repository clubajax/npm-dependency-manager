const nodeCmd = require('node-cmd');
const util = require('util');
const cmd = util.promisify(nodeCmd.get);

module.exports = {
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
