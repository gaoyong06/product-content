# HomepageTab 发布 skills.sh Skill 的可行性评估

**评估日期：** 2026-08-20  
**范围：** 判断是否应该为 HomepageTab 编写并公开发布一个 Agent Skill，以便 AI 使用 HomepageTab。

## 结论先行

目前没有必要直接发布一个笼统的“HomepageTab Skill”。

原因不是 Skill 没有价值，而是当前 HomepageTab 缺少面向 Agent 的稳定操作接口。`skills.sh` 上的 Skill 本质是给 Agent 加载的说明、流程和可选脚本，并不会自动获得 Chrome 扩展权限、浏览器控制能力、HomepageTab 账号权限或 API 凭证。仅发布一份 `SKILL.md`，不能让 AI 自动安装扩展、打开新标签页、读取用户笔记，或替用户写入网站和小组件。

建议先把“AI 要完成什么动作”定义清楚，再决定是否发布。对于 HomepageTab，最值得做的是“AI 生成内容后，经用户确认保存到 HomepageTab”，而不是做一个泛化的产品介绍 Skill。这个方向需要先补齐 OAuth/授权、工具接口、确认和审计机制；在接口完成以前，公开 Skill 的实际价值较低，维护和安全风险却已经存在。

## skills.sh 能做什么

### 发布与安装模型

skills.sh 是开放 Agent Skills 生态的目录和发现入口。Skill 通常以 Git 仓库中的一个目录分发，目录内至少有 `SKILL.md`，也可以带 `scripts/`、`references/` 和其他资源。用户通过 Skills CLI 搜索和安装，例如：

```bash
npx skills find <query>
npx skills add <owner>/<repo>@<skill>
npx skills update
```

安装后的文件由具体 Agent 宿主读取。不同宿主决定何时加载 Skill、允许哪些工具、是否允许执行脚本；skills.sh 本身不提供一个统一的浏览器执行沙箱，也不替宿主授予第三方账号权限。

### 能力边界

Skill 可以：

- 告诉 Agent 何时使用某个工作流、哪些输入需要确认；
- 提供 HomepageTab 的产品术语、URL 规则、API 调用顺序和错误处理约定；
- 通过随包脚本完成本地的格式转换、请求编排或校验（前提是 Agent 宿主允许执行）；
- 引导 Agent 打开公开分享页，或把结果整理成用户可以复制到 HomepageTab 的内容。

Skill 不能单独做到：

- 安装或启用 Chrome/Edge/Firefox 扩展；
- 访问 `chrome-extension://` 页面、替换浏览器新标签页或控制扩展 Service Worker；
- 绕过登录、设备 ID、OAuth、CORS、主机权限或浏览器安全策略；
- 把 API 密钥、用户 Cookie 或 HomepageTab 私有数据安全地提供给任意 Agent；
- 保证所有支持 Skill 的 Agent 都具有相同的浏览器、网络和脚本能力。

因此，“上传 Skill”不等于“AI 已经接入 HomepageTab”。它只是一个可被 Agent 读取的集成说明层。

## 与 HomepageTab 当前实现的匹配度

### 当前已有能力

- HomepageTab 是 Chrome/Edge/Firefox 新标签页扩展，同时提供 `web.homepagetab.com` 网页版。
- 网页版包含多个 Widget、桌面布局、网站捷径、笔记、算式本等用户数据，并提供公开分享页面。
- 公开分享路径已经明确，包括：
  - `/desktop/share/{code}`
  - `/bookmark/folder/share/{code}`
  - `/directory/share/{code}`
  - `/notebook/share/{code}`
  - `/calculator/share/{code}`
- 服务端提供 `GET /homepagetab/v1/bootstrap` 和各业务域 REST 接口；用户数据的真实来源是 `homepage-tab-service`。
- 用户数据接口要求 `X-Device-Id`；未登录数据归设备主体，登录后还会进行 user/device 绑定。这是浏览器客户端身份模型，不是 Agent 可以自行推断或安全生成的授权模型。
- 第三方访问遵循“只走 BFF”的项目约定。Skill 如果要求 Agent 直连天气、壁纸或其他第三方域名，会与现有架构和安全边界冲突。

### 目前缺少的关键能力

仓库中没有看到面向外部 Agent 的公开 OAuth 授权流程、细粒度 token、MCP/Tool 服务器或专用的 Agent API 契约。现有 `X-Device-Id` 也不适合作为第三方 Agent 的长期凭证：把设备 ID 写进 Skill 会造成跨用户数据串读风险，要求用户把私有 Header/Cookie 粘贴给 Agent 则会造成凭证泄露。

扩展的核心能力依赖浏览器环境：Manifest V3 的新标签页覆盖、扩展存储、系统状态 API 和 Service Worker。一个静态 Skill 无法替代这些运行时条件。AI 可以在某些宿主中通过浏览器自动化打开 `web.homepagetab.com`，但这与“稳定地使用用户扩展和私有桌面数据”是两件事，不能当作正式集成方案。

## 哪些场景值得做

| 场景 | 是否值得发布 Skill | 原因 |
| --- | --- | --- |
| 只介绍 HomepageTab 的功能和安装方式 | 否 | 官网、`llms.txt`、商店页面已经更适合承载稳定产品信息；Skill 会增加一个容易过期的复制入口。 |
| 让 AI 打开公开分享页、总结或改写分享内容 | 可以作为只读试验 | 不需要用户私有凭证，但能力主要来自公开 URL；优先完善分享页的标题、摘要、结构化数据和 `llms.txt`。 |
| AI 生成笔记/待办后保存到用户 HomepageTab | 值得做，但要先做接口 | 这是用户能感知的高价值闭环，需要 OAuth、细粒度权限、用户确认、幂等和审计。 |
| AI 直接管理用户网站、桌面布局和 Widget | 暂不做 | 写操作多、破坏性强，且当前设备身份模型和浏览器扩展边界不适合外部 Agent。 |
| 依靠 Skill 自动安装并操作 Chrome 扩展 | 不可行 | Skill 没有扩展安装权限，也不能跨 Agent 统一控制浏览器。 |

## 推荐方案

### 阶段 0：先把公开内容做好

保留现有两个域名的 `robots.txt`、`sitemap.xml` 和 `llms.txt`。在 `llms.txt` 中描述：

- HomepageTab 的产品用途和官方入口；
- 公开分享 URL 的路径规则；
- 哪些页面是只读公开内容；
- `#open=plugin-id` 是浏览器端深链接，不是服务器可抓取资源；
- 不要把设备 ID、Cookie、API Key 放入 Prompt、Skill 或公开分享链接。

这一步不需要发布 Skill，却能让支持网页读取的 AI 正确理解 HomepageTab。

### 阶段 1：定义一个窄而安全的 Agent 用例

建议选择“保存一条 AI 生成的笔记”或“把 AI 生成的网站加入待整理清单”中的一个，不要一开始覆盖所有 Widget。先确定：

1. 资源模型和字段限制；
2. 是否允许匿名设备，还是必须登录；
3. OAuth 授权范围，例如 `notes:write`，不能复用设备 ID；
4. 每次写入前是否必须展示预览并取得用户确认；
5. 幂等键、撤销方式、审计日志和速率限制；
6. 错误、过期授权和账号切换时的行为。

### 阶段 2：提供正式的 Agent 接口

在服务端增加独立的、版本化的 Agent API 或 MCP Server。接口应通过 HomepageTab BFF 进入，不能让 Skill 指示 Agent 直连第三方上游。读写接口要使用 OAuth 用户授权和最小权限 token，并把 Agent 来源、用户确认和操作结果记入审计日志。

在此之前，不建议在 Skill 中写入内部 `X-Device-Id`、生产 API Key、浏览器 Cookie 或未公开的 REST 路径。

### 阶段 3：再发布一个窄职责 Skill

Skill 的职责应是把自然语言意图映射到正式工具，而不是模拟浏览器内部实现。示例职责：

```text
用户说“把这段内容保存到我的 HomepageTab 笔记”时：
1. 提取标题和正文，先展示预览；
2. 明确告知即将写入 HomepageTab；
3. 调用 homepage-tab.notes.create 工具；
4. 只在工具返回成功后报告分享链接或笔记 ID；
5. 任何授权、冲突或服务端错误都原样提示，不要求用户粘贴密钥。
```

Skill 目录应有版本、变更记录、接口契约测试和安全审查。发布后还要维护与 API 版本、授权范围和多语言产品文案的同步。

## 发布前置条件清单

- [ ] 明确一个单一且可验证的 Agent 用例；
- [ ] 有公开、版本化的 Agent API/MCP 工具，而非复用浏览器内部 Header；
- [ ] 有 OAuth 登录、最小权限 scope、撤销和 token 过期处理；
- [ ] 写操作有预览、用户确认、幂等键、审计日志和速率限制；
- [ ] 所有第三方数据仍经 HomepageTab BFF；
- [ ] 不在 Skill、示例 Prompt、Issue 或日志中包含密钥、Cookie、设备 ID 和私人内容；
- [ ] 对公开分享内容做提示词注入和恶意链接处理；
- [ ] 以一个 Agent 宿主完成端到端验证，再扩展到其他宿主；
- [ ] 明确 Skill 维护者、版本策略和下线策略；
- [ ] 在公开发布前重新核对 skills.sh 当前的提交格式、审核/收录规则和 CLI 版本。

## 外部资料与项目证据

> 本次执行环境在 2026-08-20 无法解析 `skills.sh` 的 DNS，因此没有把当前排行榜或页面状态当作已现场验证事实。以下链接是应在发布前复核的一手资料；关于仓库现状的判断来自本地代码和项目文档。

| 来源 | 观察日期 | 用途 |
| --- | --- | --- |
| [skills.sh](https://skills.sh/) | 2026-08-20（待网络恢复后复核） | Skill 目录、搜索和安装入口。 |
| [skills.sh 文档](https://skills.sh/docs) | 2026-08-20（待网络恢复后复核） | 发布、发现和使用模型的官方说明入口。 |
| [Vercel Labs Skills CLI](https://github.com/vercel-labs/skills) | 2026-08-20 | CLI、仓库 Skill 目录和安装模型的一手实现来源。 |
| [Agent Skills 规范](https://agentskills.io/specification) | 2026-08-20（待网络恢复后复核） | `SKILL.md` 结构和 Agent 加载约定。 |
| [Chrome Extensions Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3) | 2026-08-20 | 说明扩展能力依赖浏览器运行时，不能由 Skill 取代。 |
| [Chrome Extensions Permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions) | 2026-08-20 | 说明扩展权限由 Manifest/浏览器授予，不是 Skill 自动获得。 |
| `homepage-tab-web/README.md` | 2026-08-20 | 现有 Web/扩展构建、商店包和运行形态。 |
| `homepage-tab-service/docs/rest-and-http-cache.md` | 2026-08-20 | REST、`X-Device-Id`、BFF 和用户数据边界。 |
| `homepage-tab-service/docs/third-party-upstreams.md` | 2026-08-20 | “只走 BFF”的第三方访问约定。 |
| `homepage-tab-web/src/product-brand.js` | 2026-08-20 | 公开分享路径常量和 URL 形态。 |

## 最终建议

现在不要为了“让 AI 使用 HomepageTab”而发布一个泛化 Skill。先把现有 `llms.txt` 和公开分享页作为 AI 可读入口，再以一个只读或单一写入用例验证真实需求。等 OAuth/Agent API 或 MCP 接口、确认流程和安全边界完成后，再发布一个职责单一的 `homepage-tab-notes` 或类似 Skill。这样发布的 Skill 才是产品能力的稳定入口，而不是把浏览器内部实现和私有凭证暴露给 Agent 的说明文件。
