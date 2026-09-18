# 把月亮寄给你

通用秋日祝福页，独立地址 `/festivals/autumn/`，首页没有入口。

## 体验

- 初始页面展示秋夜露台与纸质信封，点击信封或“轻轻拆开”阅读祝福。
- 称呼为“给屏幕前的你”，落款为“一个惦记你的朋友”。不读取个人信息，也不请求定位。
- “收下这份祝福”关闭来信并播放一轮短烟花，随后可重读或保存纪念卡。
- 纪念卡在浏览器本地生成 PNG，支持下载，手机可长按图片保存。插画加载失败时生成简洁月亮背景。
- 弹窗使用原生 dialog，支持键盘焦点限制、Escape 关闭、关闭按钮和背景点击。
- 飘花可暂停；跟随系统减少动态效果偏好关闭动画。无自动音频。

## 实现

- `src/AutumnPage.vue`：页面、信件、动效和纪念卡导出。
- `src/pages.js`：独立页面目录，供页面选择和静态入口构建共用。
- 构建生成 `dist/festivals/autumn/index.html`，支持直接打开和刷新。首页与原有场景保持独立。
- 通用版未实现个性化参数、登录、后台或分享平台卡片接口。

## 插画

使用内置 image_gen 工具生成，转换为 WebP，保存在 `public/festivals/autumn.webp`。

最终提示词：

Use case: illustration-story. Asset type: finished full-bleed background illustration for a Chinese autumn greeting website, landscape 16:9. A poetic hand-painted gouache storybook illustration, softly textured matte paper, restrained exquisite detail, midnight navy and petrol blue with warm cream moonlight and osmanthus gold. A quiet Chinese small-town rooftop terrace at night. A beautiful large full moon in the upper right quadrant, with soft cloud wisps. Lower right foreground: small round wooden tea table, two ceramic teacups, cut mooncake on a plate, vintage camera and blank travel ticket. A small orange cat sleeps on a wicker chair next to it. Fragrant golden osmanthus branches frame the right edge. Distant blue layered rooftops with tiny warm window lights across bottom third. A tiny subtle firework far on the horizon. Crucial composition: left 55 percent of canvas and upper left are uninterrupted very dark blue open sky with sparse faint stars, reserved for website typography; all detailed still life subjects concentrated in right half and bottom quarter. Calm heartfelt autumn holiday mood, sophisticated editorial children's book atmosphere. No text, no lettering, no watermark, no borders, no UI. This is the actual scene asset, not a website screenshot. Moon visibly round and warm, avoid photorealism and 3D.
