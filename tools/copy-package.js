const fs = require('fs');
let packageJson = JSON.parse(fs.readFileSync('package.json').toString());

delete packageJson.dependencies;
delete packageJson.devDependencies;
delete packageJson.scripts;

fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));
