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

function setIgnores (files) {
	config.set('ignore', files.split(',').map(w => w.trim()).join(','));
}

function addIgnores (files) {
	files = files.split(',').map(w => w.trim());
	config.set('ignore', config.get('ignore').split(',').concat(files).join(','));
}

function removeIgnores (files) {
	files = files.split(',').map(w => w.trim());
	const ignores = config.get('ignore').split(',');
	files.forEach((file) => {
		const index = ignores.findIndex(file);
		ignores.splice(index, 1);
	});
	config.set('ignore', ignores.join(','));
}

module.exports = {
	init (callback) {
		checkSettings(callback);
	},

	set (options) {
		if (/root/.test(options.command)) {
			config.set('root', options.path);

		} else if (/ignore/.test(options.command)) {
			if (/add/.test(options.command)) {
				addIgnores(options.files);

			} else if (/remove/.test(options.command)) {
				removeIgnores(options.files);

			} else {
				setIgnores(options.files);

			}
		} else {
			console.log(config.path);
			console.log(config.all);
		}
	},

	get root () {
		return config.get('root');
	},

	get ignore () {
		return config.get('ignore');
	},

	get path () {
		return config.path;
	}
};
