const path = require('path');

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

// module.exports = {
// 	root: '/sites/github',
// 	repos: {
// 		'undo-stack': {
// 			'foo': { 'foo-child': {} },
// 			'bar': {
// 				'bar-child': {
// 					'bar-grand-child': {}
// 				}
// 			},
// 			'proxify': { 'foo-child': {} },
// 		}
// 	}
// };
//
