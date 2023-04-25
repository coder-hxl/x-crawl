import tsPlugin from 'rollup-plugin-typescript2'
import terserPlugin from '@rollup/plugin-terser'
import runPlugin from '@rollup/plugin-run'

export default {
  input: 'test/start/index.ts',
  output: {
    file: 'test/start/index.js',
    format: 'cjs'
  },
  plugins: [tsPlugin(), terserPlugin(), runPlugin({ stdin: { clear: true } })]
}
