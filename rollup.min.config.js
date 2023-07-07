import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  plugins: [typescript(), terser()],
  external: ['react', 'react-dom'],
  output: [
    {
      file: `dist/${pkg.name}.min.es.js`,
      format: 'es',
    },
  ],
};
