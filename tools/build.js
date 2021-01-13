const { writeFileSync, readFileSync, copyFileSync } = require('fs');
const { resolve } = require('path');

const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json')).toString());

delete packageJson.devDependencies;
delete packageJson.scripts;

writeFileSync(resolve(__dirname, '../dist/package.json'), JSON.stringify(packageJson, null, '\t'));

const copyingFiles = ['LICENSE', 'README.md'];

for (const cf of copyingFiles) {
	copyFileSync(resolve(__dirname, `../${cf}`), resolve(__dirname, `../dist/${cf}`));
}
