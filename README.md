# product-content
所有产品的宣发素材, 内容管理

当前产品目录示例：

- `products/homepage-tab/store/` — Chrome Web Store 多语言详情
- `products/companion-ios/store/` — App Store Connect 多语言上架文案与清单
- `products/paopaopaike/articles/`、`products/zhijuanyun/articles/` — 宣发文章



### 文章文件标题命名
日期 + 稳定的 ASCII slug

格式:
```
YYYY-MM-DD-readable-slug.md
```

示例:
```
articles/
├── 2026-08-05-product-overview.md
├── 2026-08-12-how-to-organize-browser-tabs.md
└── 2026-08-20-customer-case-study.md
```

如果文章有多语言，可以这样组织：
```
articles/
├── zh-CN/
│   └── 2026-08-05-product-overview.md
└── en-US/
    └── 2026-08-05-product-overview.md
```