// Each independent page gets a real HTML entry during the Pages build.
export const standalonePages = [
  {
    path: '/festivals/autumn/',
    kind: 'autumn',
    title: '把月亮寄给你 · 晴屿',
    description: '给屏幕前的你，一封秋日来信。中秋快乐，国庆假期快乐，愿有人相见，也有闲暇。',
  },
]

export function standalonePageForPath(pathname) {
  const path = pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') + '/'
  return standalonePages.find((page) => page.path === path)
}
