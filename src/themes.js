export const themes = [
  {
    id: 'dawn', name: '晨雾山湖', english: 'A LAKE BEFORE THE WORLD WAKES', period: '清晨', startHour: 5,
    line: '天刚亮，美好正在慢慢醒来。', note: '让第一缕光，轻轻落在今天的开头。',
    mood: '晨光初至 · 万物苏醒', color: '#806e7c', position: '45% center',
    alt: '群山环抱的湖泊笼罩着清晨薄雾，第一缕光照亮山脊与湖边小舟',
  },
  {
    id: 'sakura', name: '樱花街巷', english: 'MORNING ON SAKURA LANE', period: '上午', startHour: 8,
    line: '沿着花开的方向，慢慢走。', note: '街角的风，捎来了一整个春天。',
    mood: '花开有时 · 好事将至', color: '#735263', position: '50% center',
    alt: '樱花树笼罩着安静的春日街巷，晨光洒在旧房屋、邮筒与自行车旁',
  },
  {
    id: 'summer', name: '夏日青空', english: 'A SUMMER BY THE SEA', period: '正午', startHour: 11,
    line: '把心事交给风，把今天留给海。', note: '云朵没有目的地，你也可以偶尔放空。',
    mood: '海风轻轻 · 来日方长', color: '#234863', position: '28% center',
    alt: '夏日海岸上的列车与小镇，蔚蓝海面映着明亮的积云',
  },
  {
    id: 'forest', name: '林间溪语', english: 'WHERE THE FOREST WHISPERS', period: '午后', startHour: 14,
    line: '听溪水走远，让思绪慢下来。', note: '穿过一片树影，把喧嚣留在身后。',
    mood: '树影斑驳 · 自在呼吸', color: '#244e48', position: '45% center',
    alt: '午后阳光穿过茂密森林，溪水流经青苔石块、小木桥与隐约可见的林间木屋',
  },
  {
    id: 'sunset', name: '麦田落日', english: 'GOLDEN FIELDS, SLOW EVENINGS', period: '黄昏', startHour: 17,
    line: '风吹过麦浪，今天温柔收场。', note: '不必追赶落日，停下来也是风景。',
    mood: '晚霞作序 · 温柔收场', color: '#8f5d56', position: '15% center',
    alt: '金色麦田在落日中起伏，田间小路通向远处山丘上的老风车',
  },
  {
    id: 'twilight', name: '雨巷灯火', english: 'A WARM WINDOW IN THE RAIN', period: '入夜', startHour: 19,
    line: '雨落在街上，温暖留在窗里。', note: '总有一盏灯，等你经过。',
    mood: '暮色四合 · 灯火可亲', color: '#39476f', position: '32% center',
    alt: '蓝紫暮色里的城市雨巷，书店的暖黄橱窗与路灯倒映在湿润路面上',
  },
  {
    id: 'night', name: '雪山星河', english: 'A SMALL LIGHT UNDER INFINITY', period: '深夜', startHour: 21,
    line: '天地很大，今晚只管仰望。', note: '在万千星光下，做一个轻轻的梦。',
    mood: '星河为伴 · 今夜好眠', color: '#111e35', position: '92% center',
    alt: '银河横跨雪山上空，高山草甸上的小帐篷和营灯发出温暖光芒',
  },
]

// Native Date accessors intentionally use the visitor's device time zone.
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function themeForTime(date = new Date()) {
  const hour = date.getHours()
  for (let i = themes.length - 1; i >= 0; i--) {
    if (hour >= themes[i].startHour) return themes[i]
  }
  return themes[themes.length - 1]
}

export function resolveScene(pathname) {
  const path = pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/'
  if (path === '/') return { kind: 'live' }
  const theme = themes.find((item) => path === `/scenes/${item.id}`)
  return theme ? { kind: 'scene', theme } : { kind: 'missing' }
}
