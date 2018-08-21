const config = require('./config');

const help = `
Usage: deps <command>

where <command> is:
    config

deps config root -p: 			path to the folder that contains your git repos

deps config ignore
	List of folder names that will be ignored
	They will not be crawled and stored in memory
	If they are a parent of an updated repo, they will not be updated
	
deps config ignore -f: 		folder names would you like to ignore (comma delineated; "none" for no ignores)
deps config ignore add -f: 	folder names to add to ignores
deps config ignore remove -f:	folder names to remove from ignores

deps config noPublish
	List of folder names that will not be published to npm
	Use "all" to not publish any repos
	
deps config noCommit
	List of folder names that will not be committed or pushed to their git repo
	Use "all" to not commit any repos

deps config noPush
	List of folder names that will not be pushed to their git repo
	Use "all" to not push any repos
		
config json file:
    ${config.path}

with no <command>:

deps:
	Updates the given repo with a new version number,
	recursively updates parents (and parents' parents) 
	pushes all changes to their respective got repositories
	publishes all changed repositories
      
    save options:
    -r	folder name of the repo to save
    -m	git commit message
    -v	type of version update:
    	M:	major update (1.1.1 to 2.0.0)
    	m: minor update (1.1.1 to 1.2.0)
    	p: patch update  (1.1.1 to 1.1.2) default
    	semantic string: the version to use
`;

console.log(help);