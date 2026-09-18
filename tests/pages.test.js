import test from 'node:test'
import assert from 'node:assert/strict'
import { standalonePageForPath } from '../src/pages.js'

test('autumn page supports direct, directory and index URLs', () => {
  for (const path of ['/festivals/autumn', '/festivals/autumn/', '/festivals/autumn/index.html']) {
    assert.equal(standalonePageForPath(path)?.kind, 'autumn')
  }
})

test('standalone pages do not capture the home, scenes or unknown URLs', () => {
  for (const path of ['/', '/index.html', '/scenes/night/', '/festivals/', '/festivals/autumn/other', '/festivals/autumn-other/']) {
    assert.equal(standalonePageForPath(path), undefined)
  }
})
