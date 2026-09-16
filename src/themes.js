export const themes = [
  {
    "id": "dawn",
    "name": "早餐星球",
    "english": "A SMALL MORNING RITUAL",
    "period": "清晨",
    "startHour": 5,
    "line": "先喝一口热的，再慢慢开始。",
    "note": "把今天，泡进一杯温柔里。",
    "mood": "纸艺早餐 · 慢慢醒来",
    "color": "#254d52",
    "position": "52% center",
    "alt": "俯视纸艺早餐：橙色咖啡杯、层叠纸片蒸汽、牛角包和煎蛋摆在蓝绿色桌面"
  },
  {
    "id": "sakura",
    "name": "花店开门了",
    "english": "A TINY SHOP OF HAPPY THINGS",
    "period": "上午",
    "startHour": 8,
    "line": "今天，也给自己留一朵花。",
    "note": "小猫还没醒，花店已经开门。",
    "mood": "黏土花店 · 好事生长",
    "color": "#826585",
    "position": "50% center",
    "alt": "黏土微缩花店陈列着郁金香和雏菊，一只奶油色小猫蜷睡在门前"
  },
  {
    "id": "summer",
    "name": "深蓝漫游",
    "english": "SOMEWHERE BELOW THE WAVES",
    "period": "正午",
    "startHour": 11,
    "line": "跟着鲸，去更安静的地方。",
    "note": "把呼吸放慢，世界就宽了一点。",
    "mood": "水彩鲸群 · 自由漂游",
    "color": "#146788",
    "position": "20% center",
    "alt": "水彩笔触绘出鲸与幼鲸在透着阳光的蓝色水下游弋，小鱼绕着鲸身漂流"
  },
  {
    "id": "forest",
    "name": "存档的午后",
    "english": "SAVE POINT: A QUIET AFTERNOON",
    "period": "午后",
    "startHour": 14,
    "line": "暂停一下，也是一种进度。",
    "note": "把快乐存档，明天接着玩。",
    "mood": "像素房间 · 松弛一下",
    "color": "#554050",
    "position": "57% center",
    "alt": "像素游戏室里的老电视、游戏机、手柄和睡猫被午后阳光照亮"
  },
  {
    "id": "sunset",
    "name": "乘风去远方",
    "english": "UP, UP AND INTO THE EVENING",
    "period": "黄昏",
    "startHour": 17,
    "line": "把日落装进口袋，乘风走远。",
    "note": "目的地先空着，风会慢慢回答。",
    "mood": "复古海报 · 轻轻升空",
    "color": "#84504e",
    "position": "52% center",
    "alt": "复古印刷海报风格的巨型条纹热气球漂浮在玫瑰色沙丘上，背后是橙色落日"
  },
  {
    "id": "twilight",
    "name": "末班电车",
    "english": "THE LAST TRAM HOME",
    "period": "入夜",
    "startHour": 19,
    "line": "窗外是雨，下一站是安心。",
    "note": "找个靠窗的位置，让城市慢慢经过。",
    "mood": "雨窗车厢 · 温暖归途",
    "color": "#213d3c",
    "position": "23% center",
    "alt": "雨夜老电车内的绿色绒面座椅、红色雨伞和旅行包，窗外是模糊的城市灯光"
  },
  {
    "id": "night",
    "name": "轨道花园",
    "english": "A GARDEN ABOVE THE WORLD",
    "period": "深夜",
    "startHour": 21,
    "line": "在宇宙的一角，种一点明天。",
    "note": "地球已经睡了，番茄还在长大。",
    "mood": "复古科幻 · 漂浮入梦",
    "color": "#38243f",
    "position": "42% center",
    "alt": "复古科幻太空温室中，宇航员照料番茄和奇异植物，巨大圆窗外可见地球"
  }
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
