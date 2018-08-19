const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Configstore = require('configstore');
const homedir = require('os').homedir();

const config = new Configstore('pkg-mgr');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});




function requestRoot (callback) {
	rl._prompt = 'What is the path to your repo root? ';
	rl.prompt();

	function done () {
		rl.removeListener('line', onLine);
		callback();
	}

	function onLine (line) {
		console.log(`Received root: ${line}`);
		const root = path.join(homedir, line.trim());
		if (fs.existsSync(root)) {
			console.log('root set:', root);
			config.set('root', root);
			done();
		} else {
			throw new Error(`Cannot find path ${root}`);
		}
	}
	rl.on('line', onLine);
}

function requestIgnores (callback) {
	rl._prompt = 'What folder names would you like to ignore (comma delineated; "none" for no ignores)? ';
	rl.prompt();

	function done () {
		rl.removeListener('line', onLine);
		callback();
	}

	function onLine (line) {
		line = line.trim();
		console.log(`Received ignores: ${line}`);

		if (!line) {
			throw new Error(`Unexpected input. Expecting folder names - ${line}`);
		}

		config.set('ignore', line.split(',').map(w => w.trim()).join(','));
		console.log('ignores set:', config.get('ignore'));
		done();
	}

	rl.on('line', onLine);
}

function checkSettings (callback) {
	function checkIgnores () {
		if (!config.get('ignore')) {
			requestIgnores(callback);
		} else {
			console.log('ignores set:', config.get('ignore'));
			callback();
		}
	}

	function checkRoot () {
		if (!config.get('root')) {
			requestRoot(checkIgnores)
		} else {
			console.log('root path set:', config.get('root'));
			checkIgnores();
		}
	}

	checkRoot();

}

module.exports = {
	init (callback) {
		checkSettings(callback);
	},

	get root () {
		return config.get('root');
	},

	get ignore () {
		return config.get('ignore');
	}
};
