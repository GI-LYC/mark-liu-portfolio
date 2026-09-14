# 刘奕辰 Mark / Portfolio

汽车视觉设计作品集网站。首页是暖白背景的滚动式竖版作品叠页，其余页面保留现有设计。内容取自当前目录中的个人简历、作品图片与视频素材。

## 本地运行

需要 Node.js 22 或更新版本。

```powershell
npm install
npm run dev
```

打开 `http://127.0.0.1:4173/dist/index.html` 浏览已构建并校验的本地网站。

Hero 使用本地 GSAP / ScrollTrigger / Flip，不依赖在线 CDN。滚动逐张推进并吸附；点击后卡先选中，再点击当前卡展开原比例预览。本地服务器支持视频分段请求。请通过 HTTP 地址访问，不要以 file:// 直接打开 HTML。

## Layered Work Deck

首页从 `data.js` 选取 10 个真实项目，采用 4:5 圆角叠页、弱透视和克制的信息区。滚动到最后一张后进入 Selected Works；也可以使用底部索引选择。手机支持横向 Swipe 和纵向滚动。仅当前项目的视频播放，预览支持关闭按钮、背景和 ESC。

新增项目后运行 `npm run prepare:hero`，会生成缩略图、清晰封面和尺寸清单。完整构建也会自动执行这一步。模块、计算方式与验证说明见 `hero/README.md`。

## 构建发布包

原始作品位于 `作品集总结/`，使用 Git LFS 保存，发布网站仍使用 `dist/`。克隆仓库后运行 `git lfs install` 和 `git lfs pull` 获取完整原图与原视频。简历原件、工具缓存和本地测试截图不纳入仓库。

使用 Node.js 22 或更新版本、带 Pillow 的 Python，以及本地 FFmpeg：

```powershell
npm install --prefix .deploy-tools --no-audit --no-fund ffmpeg-static
$env:DEPLOY_PYTHON = "python"
npm run build
```

构建会按 data.js 收集素材，生成视频封面、WebP 图片和 H.264 MP4 视频到 dist。
视频压缩缓存位于 .deploy-tools/media-cache；原始作品不会被改动。
原始素材完整时执行完整媒体构建；部分原始素材不可用时，构建会校验并复用完整的 `dist/assets` 已发布素材。任意必需发布素材也缺失时会报错，不会省略作品。吉利 3 张封面的引用已更新为“美图”目录，原始素材引用现已恢复。

运行 `npm run test:hero` 检查项目映射、尺寸和图片资源；`node scripts/validate-media.mjs --published` 检查发布包中的全部媒体引用。`npm run test:media` 会额外要求全部原始素材存在。浏览器交互验证使用 `node scripts/qa-deck.mjs`。

本地吉利和五菱素材重分类后的引用已同步。吉利节日与热点项目展示端午节、父亲节及阿根廷主题动态。

## 新增作品归属

- 五菱：宫廷主题短片与七位人物设定，图片横滑、视频独立展示。
- 五菱：《重生我是顾家千金》新增为独立竖版短片项目，配套自动提取的封面。
- AUDI-E：世界杯主题短片独立成项，秋意感知加入节气情绪视觉。
- 吉利：节日与热点动态、月度销量视觉、三省卖点短片、AI 主题视频分别成项。
- 首页叠页、精选作品和完整作品集优先展示 AUDI-E 世界杯、《人类训服 AI》，然后是新增五菱短片。全站共 11 个项目，Hero 保持 10 个精选项目。

新增项目文案按素材内容整理，未补写客户成效或未经确认的具体职责。

## 页面

- `index.html`：首页 Hero、代表作品与能力介绍
- `portfolio.html`：筛选式卡片作品集
- `project.html?id=audi-earth-day`：项目详情、大图查看与视频播放
- `about.html`：个人简介、技能与服务方向
- `contact.html`：联系信息
