#!/usr/bin/env node

const args = require('minimist')(process.argv.slice(2));

// console.log('args', args);

if (args._.includes('man') || args._.includes('help')) {
	require('./lib/help');
	process.exit(0);
}

const command = args._.join(' ');

if (args._.includes('config')) {
	const config = require('./lib/config');
	config.set({
		command,
		files: args.f,
		path: args.p
	});
	process.exit(0);
}

const repo = args.r || args.repo;
let updateType;
switch (args.v) {
	case 'M':
	case 'major':
		updateType = 'major';
		break;
	case 'm':
	case 'minor':
		updateType = 'minor';
		break;
	case '':
	case 'p':
	case 'patch':
		updateType = 'patch';
		break;
	default:
		updateType = args.v || 'patch';
}
const message = args.msg || args.message;

console.log(' -------------------- ', updateType);
const deps = require('./index');
deps({
	name: repo,
	command,
	updateType,
	message
});