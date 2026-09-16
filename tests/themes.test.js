import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { dateKey, resolveScene, themeForTime, themes } from '../src/themes.js'

test('every minute of a local day belongs to its intended scene', () => {
  const expected = [
    [0, 300, 'night'], [300, 480, 'dawn'], [480, 660, 'sakura'],
    [660, 840, 'summer'], [840, 1020, 'forest'], [1020, 1140, 'sunset'],
    [1140, 1260, 'twilight'], [1260, 1440, 'night'],
  ]
  for (const [start, end, id] of expected) {
    for (let minute = start; minute < end; minute++) {
      assert.equal(themeForTime(new Date(2026, 8, 16, 0, minute)).id, id, `local minute ${minute}`)
    }
  }
})

test('switches exactly at each boundary, including midnight', () => {
  for (const theme of themes) {
    const boundary = new Date(2026, 8, 16, theme.startHour)
    assert.notEqual(themeForTime(new Date(+boundary - 1)).id, theme.id)
    assert.equal(themeForTime(boundary).id, theme.id)
  }
  assert.equal(themeForTime(new Date(2026, 8, 17, 0)).id, 'night')
  assert.equal(dateKey(new Date(2026, 8, 16, 23, 59, 59)), '2026-09-16')
  assert.equal(dateKey(new Date(2026, 8, 17, 0)), '2026-09-17')
})

test('same instant follows each visitor time zone, including DST transitions', () => {
  const moduleUrl = new URL('../src/themes.js', import.meta.url).href
  const probe = (tz, instant) => JSON.parse(execFileSync(process.execPath, [
    '--input-type=module', '-e',
    `import { themeForTime, dateKey } from ${JSON.stringify(moduleUrl)}; const date = new Date(${JSON.stringify(instant)}); console.log(JSON.stringify([themeForTime(date).id, dateKey(date)]));`,
  ], { env: { ...process.env, TZ: tz }, encoding: 'utf8' }))
  assert.deepEqual(probe('Asia/Shanghai', '2026-09-16T10:00:00Z'), ['sunset', '2026-09-16'])
  assert.deepEqual(probe('America/Los_Angeles', '2026-09-16T10:00:00Z'), ['night', '2026-09-16'])
  assert.deepEqual(probe('America/Los_Angeles', '2026-09-16T01:00:00Z'), ['sunset', '2026-09-15'])
  for (const instant of ['2026-03-08T09:59:59Z', '2026-03-08T10:00:00Z', '2026-11-01T08:59:59Z', '2026-11-01T09:00:00Z']) {
    assert.equal(probe('America/Los_Angeles', instant)[0], 'night')
  }
})

test('all seven fixed pages resolve independently of the local clock', () => {
  for (const path of ['/', '/index.html']) assert.equal(resolveScene(path).kind, 'live')
  assert.equal(new Set(themes.map((theme) => theme.id)).size, 7)
  for (const theme of themes) {
    for (const suffix of ['', '/', '/index.html']) {
      assert.equal(resolveScene(`/scenes/${theme.id}${suffix}`).theme, theme)
    }
  }
  for (const path of ['/other/', '/scenes/', '/scenes/unknown/', '/scenes/summer/nested']) {
    assert.equal(resolveScene(path).kind, 'missing')
  }
})
