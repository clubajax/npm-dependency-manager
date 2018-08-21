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
		files: args.f || args.files,
		path: args.p || args.path
	});
	process.exit(0);
}

const repo = args.r || args.repo;
const updateType = args.v === 'M' ? 'major' : args.v === 'm' ? 'minor' : !args.v ? 'patch' : args.v;
const message = args.msg || args.message;

const deps = require('./index');
deps({
	name: repo,
	command,
	updateType,
	message
});