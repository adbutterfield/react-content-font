import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };

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
