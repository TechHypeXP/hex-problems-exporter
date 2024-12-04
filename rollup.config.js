import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/extension.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true
  },
  external: ['vscode'],
  plugins: [
    typescript(),
    resolve({
      preferBuiltins: true
    }),
    commonjs()
  ]
};
