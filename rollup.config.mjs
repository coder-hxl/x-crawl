import tsPlugin from 'rollup-plugin-typescript2'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

const outputMap = [
  {
    file: 'publish/dist/index.mjs',
    format: 'es'
  },
  {
    file: 'publish/dist/index.js',
    format: 'cjs'
  }
].map((item) => {
  return { ...item, compact: true }
})

console.log(outputMap)

export default {
  input: 'src/index.ts',
  output: outputMap,
  plugins: [
    tsPlugin(),
    getBabelOutputPlugin({
      presets: [['@babel/preset-env', { bugfixes: true }]]
    })
  ]
}
