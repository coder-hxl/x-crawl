import { expect, test } from '@jest/globals'

import { TEST_CONTENT } from '../src/index'

test('test', () => {
  expect(TEST_CONTENT).toEqual('Hello World')
})
