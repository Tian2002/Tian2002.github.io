import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { themes } from '../src/themes.js'
import { standalonePages } from '../src/pages.js'

// Real entry documents make direct URLs work on Pages without an SPA redirect hack.
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
for (const theme of themes) {
  const directory = new URL(`../dist/scenes/${theme.id}/`, import.meta.url)
  await mkdir(directory, { recursive: true })
  await writeFile(new URL('index.html', directory), html.replace('<title>晴屿 · 风景随时间流转</title>', `<title>晴屿 · ${theme.name}</title>`))
}
for (const page of standalonePages) {
  const directory = new URL(`../dist${page.path}`, import.meta.url)
  await mkdir(directory, { recursive: true })
  const document = html
    .replace('<title>晴屿 · 风景随时间流转</title>', `<title>${page.title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*("\s*\/>)/, `$1${page.description}$2`)
  await writeFile(new URL('index.html', directory), document)
}
await writeFile(new URL('../dist/404.html', import.meta.url), html)
await writeFile(new URL('../dist/.nojekyll', import.meta.url), '')
console.log(`Generated ${themes.length} scene pages, ${standalonePages.length} independent pages and 404.html.`)
