# App Store Connect 上架清单（Companion）

对照 [App information](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information) 与 [Product page](https://developer.apple.com/app-store/product-page/)。

## 1. 元数据字段限制

| 字段 | 限制 | 本目录位置 |
| --- | --- | --- |
| App Name | ≤ 30 字符 | `description.md` → App Name |
| Subtitle | ≤ 30 字符 | Subtitle |
| Promotional Text | ≤ 170 字符；可不发版改 | Promotional Text |
| Description | ≤ 4000 字符；纯文本 | Description |
| Keywords | ≤ 100 **字节**；逗号分隔，勿重复 Name/Subtitle 已有词 | Keywords |
| What’s New | ≤ 4000 字符 | What’s New |
| Privacy Policy URL | **必填** | 上线前填入正式 URL（暂未写入文案，避免假链接） |
| Support URL | 建议必填 | 同上 |
| Marketing URL | 可选 | 有官网后再填 |
| Category | 与 Xcode `LSApplicationCategoryType` 一致 | 文案内 Category；工程为 `public.app-category.lifestyle` |

Keywords：**不要**在 Name / Subtitle / Keywords 之间重复同一词；Apple 会合并索引。

## 2. 截图与预览（需设计出图）

优先准备（按 ASC 当前要求勾选设备）：

- iPhone 6.9" / 6.7"（主图组，如 iPhone 16 Pro Max）
- 如卖 iPad：对应 iPad 尺寸组

建议 3–5 张静帧，**不要**在首图堆功能角标：

1. 聊天主界面（娜娜在场 + 一条短对话）
2. 语音输入态（按住说话）
3. 记忆 / 安静陪伴的价值一屏（短文案）
4. 订阅说明（文字免费、语音订阅；价格用系统本地化展示）

App Preview 视频可选（≤ 30s）。素材可放本产品 `assets/`（后续补充）。

## 3. App Privacy / 年龄分级 / 权限文案

- 完成 App Privacy 问卷，并与工程 `PrivacyInfo.xcprivacy`（若尚未添加则发版前补齐）一致。
- 年龄分级问卷按真实内容填写；陪伴聊天通常需声明用户生成内容与可能的敏感话题处理。
- 权限说明已本地化：`InfoPlist.strings`（相机 / 麦克风 / 相册）。

常见数据类型（按实现核对后勾选，勿照抄）：

- 联系方式（邮箱 / 手机，账号）
- 用户内容（聊天、语音、图片）
- 标识符（用于账号与购买）
- 购买历史（StoreKit）

## 4. 订阅（IAP）审核注意

- 商品 ID：`com.xinyuantech.companion.monthly` / `yearly`
- 应用内须有恢复购买；取消与自动续费走系统订阅页（已实现）
- 详情页与付费墙文案须说明：文字陪伴保留、语音需试用/订阅；价格以 StoreKit 为准
- 服务端须配置 Apple Root CA 并接收 Server Notifications V2

## 5. 本地化语言包（本目录已备）

`en` `zh-CN` `zh-TW` `ja` `ko` `es` `de` `fr` `pt-BR` `ar` `ru` `id` `vi` `th` `hi` `it` `tr` `nl`

ASC 里为每个语言单独粘贴；未覆盖的商店语言可先用 `en`。

## 6. 发版前仍缺（运营 / 法务）

- [ ] 正式 Privacy Policy URL、Support URL
- [ ] 账号持有人 / 出口合规 / 加密问卷
- [ ] 商标与最终品牌名核验（见 `companion-ios/docs/domain-shortlist-research.md`）
- [ ] 截图与（可选）预览视频
- [ ] `PrivacyInfo.xcprivacy` 与问卷对齐
- [ ] 各商店地区定价与税档
