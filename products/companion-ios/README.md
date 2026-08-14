# Companion iOS — 上架与宣发材料

本目录存放 **App Store Connect 上架文案** 与发布检查清单。应用内 UI 文案在仓库 `companion-ios/CompanionApp/Resources/*.lproj`。

## 目录

```text
companion-ios/
├── README.md                 # 本文件
├── store/
│   ├── README.md             # ASC 字段限制、截图、隐私、订阅审核要点
│   ├── en/description.md
│   ├── zh-CN/description.md
│   ├── zh-TW/description.md
│   └── …                     # 其他本地化详情页
└── (后续可加) articles/ assets/
```

## 使用方式

1. 在 App Store Connect 为每个销售地区粘贴对应 `store/<locale>/description.md` 字段。
2. 截图、年龄分级、App Privacy、隐私政策 URL 按 `store/README.md` 清单勾选。
3. 品牌主名若从 `Companion` / `娜娜` 升级为独立造词（如研究中的 Herena），先改本目录与 `CFBundleDisplayName`，再提交审核。

## 与客户端多语言的关系

| 层 | 位置 | 现状 |
| --- | --- | --- |
| App Store 详情页 | 本目录 `store/*` | en / 中文 / 日韩欧东南亚等 |
| App UI | `companion-ios` `*.lproj` | 18 个 locale |
| 对话词条 / 安全提示 | `companion-service` lexicon | 目前仅 `zh-CN` / `en-US`；其它系统语言回退英语 |

客户端会发送 `Accept-Language`；服务端不支持的语言回退到 `en-US`，避免误落到中文。
