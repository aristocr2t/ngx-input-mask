import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import angular from 'rollup-plugin-angular';
import typescript from 'rollup-plugin-typescript';
import sass from 'node-sass';

import { ModuleName, SkipCodes } from './config.js';

export default {
  entry: `index.ts`,
  format: 'es',
  moduleName: ModuleName,
  sourceMap: true,
  external: [
    '@angular/core',
    '@angular/forms',
    'rxjs',
  ],
  dest: `dist/bundles/${ModuleName}.esm.js`,
  plugins: [
    angular({
      preprocessors: {
        template: (template) => template,
        style: (scss) => scss ? sass.renderSync({ data: scss }).css.toString() : ''
      }
    }),
    typescript({
       typescript: require('typescript')
    }),
    resolve({
       module: true,
       main: true
    }),
    commonjs({
       include: 'node_modules/**',
    })
  ],
  onwarn: (warning) => {
    if (!SkipCodes.includes(warning.code)) {
      console.error(warning);
    }
  }
}
