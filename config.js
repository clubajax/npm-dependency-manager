const path = require('path');

// ignores/status
// never use
// never commit (but make package changes)
// never publish (but commit and push)

module.exports = {
	root: '/sites',
	repos: {
		'test': {
			'./github/undo-stack': {
				'./github/foo': { './github/foo-child': {} },
				'./github/bar': {
					'./github/bar-child': {
						'./github/bar-grand-child': {}
					}
				},
				'./github/proxify': { './github/foo-child': {} },
			}
		}
	}
};
