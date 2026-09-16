import test from 'node:test'
import assert from 'node:assert/strict'
import { dateKey, resolveScene, themeForDate, themes } from '../src/themes.js'

test('daily theme uses the Shanghai calendar and remains stable all day', () => {
  const start = new Date('2026-09-15T16:00:00.000Z')
  const end = new Date('2026-09-16T15:59:59.999Z')
  assert.equal(dateKey(start), '2026-09-16')
  assert.equal(dateKey(end), '2026-09-16')
  assert.equal(themeForDate(start), themeForDate(end))
  assert.equal(dateKey(new Date('2026-09-16T16:00:00.000Z')), '2026-09-17')
})

test('a month includes all themes, with deterministic results', () => {
  const chosen = Array.from({ length: 30 }, (_, day) => new Date(Date.UTC(2026, 8, day + 1)))
  assert.equal(new Set(chosen.map((date) => themeForDate(date).id)).size, themes.length)
  for (const date of chosen) assert.equal(themeForDate(date), themeForDate(new Date(date)))
})

test('scene URLs accept directories and index.html but reject unknown paths', () => {
  for (const path of ['/', '/index.html']) assert.equal(resolveScene(path).kind, 'daily')
  for (const theme of themes) {
    for (const suffix of ['', '/', '/index.html']) {
      assert.equal(resolveScene(`/scenes/${theme.id}${suffix}`).theme, theme)
    }
  }
  for (const path of ['/other/', '/scenes/', '/scenes/unknown/', '/scenes/summer/nested']) {
    assert.equal(resolveScene(path).kind, 'missing')
  }
})
