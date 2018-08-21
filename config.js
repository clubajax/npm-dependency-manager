const path = require('path');

// ignores/status
// never use
// never commit (but make package changes)
// never publish (but commit and push)

const perm = 'smartar,ui-shared,rancor,aer-ui,ben-glowacki,samplify-design,surveytool-ui,babel-test,common-css,pptxgenjs,ADimension,c3,advanced-react,redux-demo,@researchnow/reno';
const temp = 'smartar,ui-shared,rancor,aer-ui';
module.exports = {
	root: '/sites/github/npm-package-manager/test-repos',
	ignore: `${perm},${temp}`
};
