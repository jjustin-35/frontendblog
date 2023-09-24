---
layout: ironmen.md
title: next 13 - App Router 概念
date: 2023-09-20 23:52:57
categories:
- frontend
- ironman-2023
tags: 
- next.js
- 鐵人賽 2023
---
今天要來介紹 next 13 推出的一個重要概念: app router，這是一個全新的 file-base system，取代原有的 pages router。

## App Router 是什麼?
app router 是全新的 router system ，改變了過去 pages router 的資料夾結構、進入點。可以說，app router 是 pages router 的進化。

### App Route 特點
- route 需要放在 /app 資料夾下面
原先的 route 來源資料夾是 `/pages`，app router 變成 `/app`。
- route 單位由 "檔案" 變成 "資料夾"
page router 的 route 是一個一個的**檔案**，像是 /auth route 會是 `/pages/auth.tsx`，app router 的 route 則會是**資料夾**，`/app/auth/page.tsx`，其中 auth 是資料夾，`page.tsx` 會放頁面的主要內容。


| version | pages router | app router |
| -------- | -------- | -------- |
| route   | /auth  | /auth  |
|file path| /pages/auth.tsx| /app/auth/page.tsx|
- entry point 從 `_app.tsx` 變成 `layout.tsx`
pages router 的進入點是 `_app.tsx` ，child component 會透過 `<Component/>` 的方式被包在 app component 裡面，props 則會以 pageProps 的形式傳入 `<Component/>`: 
```typescript=
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
```
app router 的進入點改為 root layout，也就是一個在 /app 下的 `layout.tsx` 。這個頁面會包在所有頁面的最外層，跟 `_app` 有相同作用。
```typescript=
export default function RootLayout ({ children }) {
    return <div>{children}</div>
}
```
- `_document` 被 `layout` 取代
`_document` 是過去用來客製化 head 內容的主要檔案，在 app router 沒有 `_document` ，他的功能改由 `layout` 取代。
要怎麼客製化 head 呢? 留待我講到 layout 時再好好講解~

- 首頁由 `index.tsx` 改為 `page.tsx`
配合新的 file system，頁面內容都會需要放在以 `page.tsx` 命名的檔案中，首頁也不例外，從 `index.tsx` 改為 `page.tsx`。


## App Route 使用方式
接著來說明一下，app router 要怎麼寫。
### 首頁
首頁的建立很簡單，直接在 /app 下新增 `page.tsx` 即可。
要注意的是，除了 `page.tsx` 外，還需要建立 `layout.tsx`，這是整個 router 的進入點、也是包在最外層的 layout 。
```
app/
├── page.tsx
└── layout.tsx
```
page 和 layout 的詳細資訊會在後面介紹。

### route
前面有講到，一個 route 的單位是一個**資料夾**，假設需要一個 route `/dashboard`，那這個 route 會建立在 /app 下面，結構如下:
```
app/
└── dashboard/
    ├── page.tsx
    ├── layout.tsx
    └── ...
```
在 dashboard 資料夾下面會有 render 這個 route 的特殊檔案，像是 page、layout 等，要注意的是這些檔案一定要**照官方要求命名**，不然渲染頁面會有問題。

### nested route
依官網的說明，route 是一個**巢狀結構**: 
![](https://hackmd.io/_uploads/Sk6okGL16.png)

也就是說，route 下還可以有 route。例如，`/dashboard` 下需要 `/analytics` 的 sub path，建立方式是在 `dashboard` 資料夾下新建一個 `analytics` 資料夾。
資料夾架構會長這樣:
```
app/
└── dashboard/
    ├── page.tsx
    ├── layout.tsx
    ├── ...
    └── analytics/
        ├── page.tsx
        └── layout.tsx
```
網站上的網址會是:
```
https://domain.com/dashboard/analytics
```

這些是 next 13 最核心的 route 機制，跟過去 next 12 的寫法有些差距，從 12 升到 13 的朋友可能會有些不習慣，不過隨著熟練度上升，會發現這樣寫也有它的優勢。

### 同時使用 pages router 和 app router
剛開始嘗試的開發者可以漸進式的 pages router / app router 共用，next 13 允許同時用兩種不同的 route system 寫。
```
app/
├── page.tsx
├── layout.tsx
└── dashboard/
    ├── page.tsx
    ├── layout.tsx
    ├── ...
    └── analytics/
        ├── page.tsx
        └── layout.tsx
pages/
├── my-page.tsx
└── ...
```
但要注意的是，如果 app 資料夾和 pages 資料夾裡有同名 route 的話，**app 的 route 會覆蓋掉 pages 的 route**，可能會讓原本 pages router 的功能無法發揮作用，建議盡量做好 route 管理，避免出現這樣的情況。


以上，就是 next 13 app router 的介紹，明天會繼續講解 next 13 的另一大亮點: client component & server component，敬請期待~