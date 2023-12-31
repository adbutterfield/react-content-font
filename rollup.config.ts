import typescript from '@rollup/plugin-typescript';
import banner2 from 'rollup-plugin-banner2';
import pkg from './package.json' assert { type: 'json' };

export function getConfig({
  tsconfig = './tsconfig.json',
  output = [
    {
      file: `dist/${pkg.name}.js`,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: `dist/${pkg.name}.es.js`,
      format: 'esm',
    },
    {
      name: 'react-content-font',
      file: `dist/${pkg.name}.umd.js`,
      format: 'umd',
      globals: {
        react: 'React',
      },
    },
  ],
  plugins = [],
} = {}) {
  return {
    input: 'src/index.ts',
    external: ['react', 'react-dom'],
    plugins: [
      typescript({
        tsconfig,
      }),
      banner2(() => `'use client';\n`),
      ...plugins,
    ],
    output,
  };
}

export default getConfig();
