export const TIME_ZONE = 'Asia/Shanghai'

export const themes = [
  {
    id: 'sakura', name: '樱花晴昼', english: 'SAKURA DAYDREAM',
    line: '等风来，也等一场花开。', note: '把脚步放慢一点，春天会等你。',
    mood: '花开有时 · 好事将至', color: '#735263', position: '20% center',
    alt: '樱花盛开的海边小路，远处是春日的小岛与蓝天',
  },
  {
    id: 'summer', name: '夏日青空', english: 'A SUMMER BY THE SEA',
    line: '把心事交给风，把今天留给海。', note: '云朵没有目的地，你也可以偶尔放空。',
    mood: '海风轻轻 · 来日方长', color: '#234863', position: '28% center',
    alt: '夏日海岸上的列车与小镇，蔚蓝海面映着明亮的积云',
  },
  {
    id: 'night', name: '静谧星夜', english: 'UNDER THE SAME STARS',
    line: '世界安静下来，星光就有了回声。', note: '今晚，允许自己什么都不想。',
    mood: '星河为伴 · 今夜好眠', color: '#111e35', position: '56% center',
    alt: '繁星与银河下的海边小镇，远处灯火温柔地亮着',
  },
]

export function dateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type).value
  return `${value('year')}-${value('month')}-${value('day')}`
}

// A date-seeded hash: stable on refresh and consistent across devices/time zones.
export function themeForDate(date = new Date()) {
  let seed = 2166136261
  for (const char of `isle:${dateKey(date)}`) {
    seed = Math.imul(seed ^ char.charCodeAt(0), 16777619)
  }
  seed ^= seed >>> 16
  seed = Math.imul(seed, 0x85ebca6b)
  seed ^= seed >>> 13
  return themes[(seed >>> 0) % themes.length]
}

export function resolveScene(pathname) {
  const path = pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/'
  if (path === '/') return { kind: 'daily' }
  const theme = themes.find((item) => path === `/scenes/${item.id}`)
  return theme ? { kind: 'scene', theme } : { kind: 'missing' }
}
