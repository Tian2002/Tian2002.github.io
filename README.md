# 晴屿 · 风景随时间流转

基于 Vue 3 + Vite 的纯静态 H5。参考 `haru-isle` 首页，提供七套主体、构图与媒介各异的原创插画：纸艺早餐、黏土花店、水彩鲸群、像素游戏室、热气球海报、电车车厢与科幻太空温室。首页根据访客设备的当地时间自动切换风景，只展示风景、寄语、日期与当地时间，没有导航或子页面入口，也不显示主题编号。

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

| 路径 | 内容 / 当地时间 |
| --- | --- |
| `/` | 按下表自动展示，页面保持打开时也会切换 |
| `/scenes/dawn/` | 早餐星球 · 05:00–08:00 |
| `/scenes/sakura/` | 花店开门了 · 08:00–11:00 |
| `/scenes/summer/` | 深蓝漫游 · 11:00–14:00 |
| `/scenes/forest/` | 存档的午后 · 14:00–17:00 |
| `/scenes/sunset/` | 乘风去远方 · 17:00–19:00 |
| `/scenes/twilight/` | 末班电车 · 19:00–21:00 |
| `/scenes/night/` | 轨道花园 · 21:00–次日 05:00 |

时段包含起始时间，不包含结束时间。独立主题路径始终固定展示对应主题，不受当前时段影响。

首页以访客设备的当地时间为准，不请求定位权限、不调用天气服务，也不依赖服务器时区。浏览器从后台恢复时立即检查时间；跨午夜时日期同步更新。夏令时由设备的时区规则处理。上述时段是固定的设计安排，不是按地理位置计算的真实日出日落。

子页面不出现在首页，但属于公开静态内容，知道地址即可访问；隐藏入口不等同于权限控制。

构建脚本会生成 `dist/scenes/<主题>/index.html`，因此在 GitHub Pages 上可直接打开或刷新路径，不依赖服务端 rewrite。未知路径显示自定义 404。后续可以按 `/games/<作品>/`、`/stories/<作品>/` 等结构扩展页面组件与构建入口。

## GitHub Pages 发布

仓库为 `Tian2002.github.io`，Vite `base` 使用 `/`，部署后域名为 `https://tian2002.github.io/`。

1. 在仓库 Settings → Pages → Build and deployment 中，将 Source 设为 **GitHub Actions**。
2. 将代码推送到 `main`。如使用其他默认分支，请调整 `.github/workflows/pages.yml` 的触发分支。
3. 工作流安装依赖、测试、构建，再发布 `dist`。也可通过 Actions 页面手动运行。

工作流依据 [GitHub Pages 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) 配置。

## 修改内容

### 独立节日页

`/festivals/autumn/` 是“把月亮寄给你”通用祝福页，支持拆信、收下祝福和保存 PNG 纪念卡。首页不提供入口，直接分享完整地址即可。开发时打开 `http://127.0.0.1:5173/festivals/autumn/`。

页面代码在 `src/AutumnPage.vue`，独立页面登记在 `src/pages.js`，详细设计和插画提示词在 `docs/autumn-design.md`。生产构建会生成真实静态入口，支持直接访问和刷新。

- `src/themes.js`：主题名称、寄语、图片描述、移动端裁切位置、时段切换规则。
- `public/themes/`：本地插画素材，无外部图片或字体请求。
- `src/App.vue`：首页与固定主题页，含暂停动效按钮。
- `src/style.css`：桌面、平板、手机竖屏与横屏样式；支持安全区域、减少动态效果偏好和背景图片失败时的渐变兜底。
- `scripts/build-pages.mjs`：真实静态路径与 404 的生成。

新增图片由内置 imagegen 生成，生成提示词记录在 `docs/theme-art-prompts.md`，以 WebP 格式存于 `public/themes/`。七张图片均重新设计生成，分别采用纸艺、黏土、水彩、像素、复古海报、绘本漫画与复古科幻表现方式。历史主题路径继续保留，避免已有链接失效。

不需要后端、数据库或 API 密钥。
