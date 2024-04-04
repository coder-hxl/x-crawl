import tsPlugin from 'rollup-plugin-typescript2'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

export default {
  input: 'packages/index.ts',
  output: {
    file: 'publish/dist/x-crawl.js',
    format: 'es',
    compact: true
  },
  treeshake: {
    tryCatchDeoptimization: false,
    unknownGlobalSideEffects: false
  },
  plugins: [
    tsPlugin(),
    getBabelOutputPlugin({
      presets: [['@babel/preset-env', { bugfixes: true }]]
    })
  ]
}
