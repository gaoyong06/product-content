# 新标签页竞品公开资料核验

> 访问日期：2026-09-07（Asia/Shanghai）。本文只记录可从公开页面直接核验的内容；无法访问或页面未披露的数字明确标为“未确认”。Chrome Stats 的“用户规模/排名”不能用推测值补齐。

## 结论摘要

- 本次访问未获得四个产品在 Chrome Stats 上可引用的用户规模或排名。`chrome-stats.com` 对 HomepageTab 页面返回 Cloudflare challenge；iTab、WeTab、Start.me 的 Chrome Stats 页面也未能在公开访问中取得可读正文。因此不能据此宣称谁的安装量或排名更高。
- iTab 官方站点将产品定位为“自定义新标签页”，公开描述明确包含网站、壁纸、搜索引擎、日历、天气、每日头条、壁纸和常用网址；这是高密度、多组件仪表盘方向的直接证据。
- WeTab 官方入口可访问，但首页是客户端渲染壳，未在初始 HTML 中披露可核验的组件清单、用户数或权限说明；本次不把页面结构推断为功能承诺。
- Start.me 官网和 Chrome 应用页在本次访问均返回 Cloudflare challenge；不能把其组件密度、用户规模或权限描述当作本次已核验事实。
- HomepageTab 官方英文产品页直接写明“Wallpapers, shortcuts, and 30+ widgets. Free to use.”，可核验的产品定位是壁纸、快捷方式和 30+ 小组件；官方 Chrome Web Store 链接及权限说明仍应以商店页面当前展示为准。

## 逐项证据

### iTab

官方页面：

- 官网：[https://www.itab.link/](https://www.itab.link/)
- Chrome 安装说明：[https://www.itab.link/install/chrome.html](https://www.itab.link/install/chrome.html)

页面证据（抓取 HTML 的 `meta description`）：

> `iTab新标签页,自定义您新标签页上的网站和壁纸以及搜索引擎,创建和编辑属于您自己的浏览器标签页,精美日历、炫酷天气、每日头条、海量壁纸、常用网址随心订制`

可验证的功能/组件：自定义网站、壁纸、搜索引擎；创建和编辑标签页；日历；天气；每日头条；海量壁纸；常用网址。该描述显示默认产品叙事偏“多组件聚合”，但没有给出默认首屏实际显示多少个组件，因此“组件密度”只能定性为高，不应写成未经截图核验的精确数量。

用户规模、排名、权限：本次没有得到可核验数字或权限列表。Chrome Stats 目标页（按产品扩展 ID 查询）未能通过 Cloudflare challenge；Chrome Web Store 安装说明页面也没有在本次抓取结果中给出用户数。

### WeTab

官方页面：[https://wetab.link/](https://wetab.link/)

页面证据：HTML 标题为 `WeTab 新标签页`，页面使用 `#app` 客户端渲染，初始 HTML 未直接列出组件清单、用户规模、排名或权限声明。`https://wetab.link/manifest.json` 在本次访问中未返回可读取正文。

可验证结论：WeTab 是新标签页产品；其默认首屏组件密度、具体功能和权限不能仅凭本次初始 HTML 确认。不要把脚本包名、DOM 壳或搜索结果中的宣传词当作权限或组件证据。

用户规模、排名、权限：未确认。建议后续用可执行浏览器加载页面并读取渲染后的 DOM，再以 Chrome Web Store 的扩展详情页核对权限。

### Start.me

官方页面：

- 官网：[https://start.me/](https://start.me/)
- Chrome 应用页：[https://www.start.me/apps/chrome](https://www.start.me/apps/chrome)

访问结果：两个页面均返回 Cloudflare `Just a moment...` / `Enable JavaScript and cookies to continue` challenge，没有公开正文可供本次引用。

用户规模、排名、权限、默认组件密度：未确认。不能用 Start.me 的品牌定位或第三方文章替代页面级证据。

### HomepageTab

官方产品页：[https://www.homepagetab.com/en/](https://www.homepagetab.com/en/)

页面证据（HTML `title` 与 `meta description`）：

- Title：`HomepageTab — Your homepage, every new tab`
- Description：`Your homepage, every new tab. In the whitespace, resonance follows. Wallpapers, shortcuts, and 30+ widgets. Free to use.`
- Keywords 中包含 `new tab`, `homepage`, `browser extension`, `chrome extension`, `firefox addon`, `edge addon`, `wallpapers`, `shortcuts`, `productivity`, `dashboard`。

可验证的功能/组件：壁纸、快捷方式、30+ 小组件；产品覆盖 Chrome extension、Firefox addon、Edge addon 的产品定位关键词。根据官方描述，组件数量可写为“30+”，但该页面没有逐项列出默认首屏启用哪些组件，不能据此断言默认首屏密度。

Chrome Web Store：仓库已有官方链接 `[HomepageTab](https://chromewebstore.google.com/detail/homepagetab/ljneopimlgekcjhadhhbehomnfibidac)`。本次未把 Chrome Stats 的估算值或商店动态数据写入结论；用户规模、排名和当前权限应在可访问的商店详情页/Chrome Stats 页面重新读取后记录。

## Chrome Stats 访问记录

尝试访问的公开入口：

- HomepageTab：[https://chrome-stats.com/d/ljneopimlgekcjhadhhbehomnfibidac](https://chrome-stats.com/d/ljneopimlgekcjhadhhbehomnfibidac)
- iTab 搜索入口：[https://chrome-stats.com/search?q=iTab](https://chrome-stats.com/search?q=iTab)
- WeTab 搜索入口：[https://chrome-stats.com/search?q=WeTab](https://chrome-stats.com/search?q=WeTab)
- Start.me 搜索入口：[https://chrome-stats.com/search?q=Start.me](https://chrome-stats.com/search?q=Start.me)

结果：HomepageTab 详情页返回 Cloudflare challenge（`Just a moment...`、`Enable JavaScript and cookies to continue`）；其余搜索入口也无法取得可引用的统计正文。因此本报告没有填写用户数、安装量、全球排名、评分等数字。

## 对产品判断的边界

“组件密度”应拆成两个指标：

1. **产品承诺密度**：官方文字列出的能力数量。当前可直接核验的是 iTab 的多类组件描述，以及 HomepageTab 的“30+ widgets”。
2. **默认首屏密度**：首次安装、无用户配置时实际可见的组件数量/占屏比例。本次没有对 iTab、WeTab、Start.me 完成可重复的干净浏览器首启截图，因此不输出精确比较结论。

权限必须来自 Chrome Web Store 扩展详情页的 Permissions 区域或扩展 `manifest.json`；官网产品描述不能证明权限范围。用户规模和排名必须带具体来源、字段名称和抓取日期，不能把第三方估算或搜索摘要当作 Chrome 官方安装数。

## Dribbble 视觉趋势补充（2024-2026）

### 访问范围与限制

访问日期：2026-09-07。尝试访问以下公开搜索入口：

- [Dribbble dashboard 搜索](https://dribbble.com/search/dashboard)
- [Dribbble new tab 搜索](https://dribbble.com/search/new%20tab)
- [Dribbble start page 搜索](https://dribbble.com/search/start%20page)
- [Dribbble widgets 搜索](https://dribbble.com/search/widgets)
- [Dribbble popular shots](https://dribbble.com/shots/popular)

所有请求均返回 HTTP `202`、`content-length: 0`，响应头包含 `x-amzn-waf-action: challenge`，未返回搜索结果、作品标题、发布日期、图片或作品详情。Google 的 `site:dribbble.com/shots` 搜索本次也返回验证提示，没有可引用的作品摘要。

### 可验证结论

本轮无法从 Dribbble 一手页面核验 2024-2026 的 dashboard/new tab/start page/widget 作品，也无法负责任地提炼材质、卡片、色彩、网格或动效趋势。下列说法均不应作为本次研究结论：

- “近两年主流都使用玻璃拟态/渐变/大圆角卡片”；
- “某种网格密度或动效已经成为行业标准”；
- “某个作品或设计师代表新标签页趋势”。

这些判断需要可访问的作品页、明确发布日期和可复核截图后才能成立。当前最稳妥的产品设计输入仍来自前述竞品官方页面：iTab 的多组件聚合叙事，以及 HomepageTab 官方页面明确的壁纸、快捷方式和 `30+ widgets`。它们能支持功能密度与信息架构讨论，但不能替代 Dribbble 的视觉趋势样本。
