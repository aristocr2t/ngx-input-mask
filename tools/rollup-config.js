import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import angular from 'rollup-plugin-angular';
import typescript from 'rollup-plugin-typescript2';

import { ModuleName, SkipCodes } from './config';

function rollupConfig(format) {
	return {
		input: `src/index.ts`,
		output: {
			format,
			name: ModuleName,
			file: `dist/${ModuleName}.${format}.js`,
		},
		external: [
			'@angular/core',
			'@angular/forms',
			'rxjs',
		],
		plugins: [
			angular({
				preprocessors: {
					template: (template) => template,
				},
			}),
			typescript({
				tsconfig: 'tsconfig.json',
			}),
			resolve({}),
			commonjs({
				include: 'node_modules/**',
			}),
		],
		onwarn: (warn) => {
			if (!SkipCodes.includes(warn.code)) {
				console.error(warn);
			}
		},
	};
}

export default [
	rollupConfig('esm'),
	rollupConfig('umd'),
];
