import tsPlugin from 'rollup-plugin-typescript2'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

// const outputMap = [
//   {
//     file: 'publish/dist/index.mjs',
//     format: 'es'
//   },
//   {
//     file: 'publish/dist/index.js',
//     format: 'cjs'
//   }
// ].map((item) => {
//   return { ...item, compact: true }
// })

// console.log(outputMap)

export default {
  input: 'src/index.ts',
  output: {
    file: 'publish/dist/x-crawl.cjs.js',
    format: 'cjs',
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
