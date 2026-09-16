# 晴屿 · 每天一幅风景

基于 Vue 3 + Vite 的纯静态 H5。参考 `haru-isle` 首页，复用其中的三张海岛 WebP 插画：樱花晴昼、夏日青空、静谧星夜。首页只有风景、寄语与日期，没有导航或子页面入口。

## 本地运行

需要 Node.js 22 或更新版本。

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

## 页面路径

| 路径 | 内容 |
| --- | --- |
| `/` | 根据北京时间的日期，伪随机选取今日主题 |
| `/scenes/sakura/` | 固定樱花主题 |
| `/scenes/summer/` | 固定夏日主题 |
| `/scenes/night/` | 固定星夜主题 |

同一天、不同设备、反复刷新都得到同一主题；跨日自动更新，浏览器从后台恢复时也会检查日期。相邻日期允许抽到相同主题。日期统一使用 `Asia/Shanghai`，不受访问者所在地影响。

子页面不出现在首页，但属于公开静态内容，知道地址即可访问；隐藏入口不等同于权限控制。

构建脚本会生成 `dist/scenes/<主题>/index.html`，因此在 GitHub Pages 上可直接打开或刷新路径，不依赖服务端 rewrite。未知路径显示自定义 404。后续可以按 `/games/<作品>/`、`/stories/<作品>/` 等结构扩展页面组件与构建入口。

## GitHub Pages 发布

仓库为 `Tian2002.github.io`，Vite `base` 使用 `/`，部署后域名为 `https://tian2002.github.io/`。

1. 在仓库 Settings → Pages → Build and deployment 中，将 Source 设为 **GitHub Actions**。
2. 将代码推送到 `main`。如使用其他默认分支，请调整 `.github/workflows/pages.yml` 的触发分支。
3. 工作流安装依赖、测试、构建，再发布 `dist`。也可通过 Actions 页面手动运行。

工作流依据 [GitHub Pages 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) 配置。

## 修改内容

- `src/themes.js`：主题名称、寄语、图片描述、移动端裁切位置、每日主题算法。
- `public/themes/`：本地插画素材，无外部图片或字体请求。
- `src/App.vue`：首页与固定主题页，含暂停动效按钮。
- `src/style.css`：桌面、平板、手机竖屏与横屏样式；支持安全区域、减少动态效果偏好和背景图片失败时的渐变兜底。
- `scripts/build-pages.mjs`：真实静态路径与 404 的生成。

不需要后端、数据库或 API 密钥。
