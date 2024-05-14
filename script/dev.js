import tsPlugin from 'rollup-plugin-typescript2'
import terserPlugin from '@rollup/plugin-terser'
import runPlugin from '@rollup/plugin-run'

export default {
  input: `test/dev/src/index.ts`,
  output: {
    file: `test/dev/src/index.js`,
    format: 'es'
  },
  plugins: [tsPlugin(), terserPlugin(), runPlugin({ stdin: { clear: true } })]
}
