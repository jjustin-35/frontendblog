---
title: lazy loading 的圖片或 iframe，什麼時候開始 loading？
categories:
- frontend
tags: 
- JavaScript
- web
---

[TOC]

在可視區範圍外的圖片或 iframe ，通常會加上 `loading: "lazy"` 的屬性做 lazy loading，避免在一開始網頁載入時就去拿取圖片和 iframe 的資料，直到進入可視區後才會載入。
這時我就好奇了，lazy loading 究竟是在什麼時候載入呢？所謂的"進入可視區"的實際距離究竟是多少呢？

## loading: lazy 用法
`loading` 是可以用在 `img` 和 `iframe` 上的一種屬性，有兩種 value：
- `lazy`: 延遲元素載入，直到進入**近可視區**的距離。
- `eager`: default 值，在網頁載入時立即載入。

圖片和 iframe 通常要載入不小的資料，因此非立即用到的資源還是用 `lazy` 延遲載入比較好。
這樣做可以幫助我們減少初始載入的資料，使網頁載入速度更快，提升 LCP (Largest Contentful Paint) 的速度，並減少 FCP (First Contentful Paint) 和 FID (First Input Delay) 的時間。

## `img` `iframe` 資源的 loading 過程
瀏覽器會優先渲染 `loading: eager` 的圖片、iframe，eager 的圖片、iframe 載入完成後才會去接著載入 lazy 的圖片，並會提前載入在 distance from viewport 區域內的圖片或 iframe。
因此，如果在 eager 圖片未渲染完成前，滑到 lazy loading 的圖片，是可能不會渲染出來的喔！

## lazy loading 的 distance from viewport 是多少？
根據 [web.dev 的文章](https://web.dev/articles/browser-level-image-lazy-loading#distance-from-viewport)，lazy loading 不是直到元素進入畫面後才載入，而是會計算距離可視區的一定距離，進入這個範圍後，就會做載入，讓元素進入可視區時可以立即與使用者互動。
具體來說是多少呢？這會根據連線類型以及請求資源的類型而有所不同。
Chrome 的 [chromium source](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/frame/settings.json5;l=963-995) 中的設定可以看到不同資源、連線類型需要的距離閾值 (distance threshold)，也就是進入後開始載入的範圍。
以下是圖片和 iframe 的值：

| 網速       | 圖片 (px) | iframe (px) |
|------------|-----------|-------------|
| 4G         | 1250px    | 2500px      |
| 3G         | 2500px    | 3500px      |
| 2G         | 6000px    | 6000px      |
| slow 2G    | 8000px    | 8000px      |
| offline    | 8000px    | 8000px      |
| unknown    | 3000px    | 4000px      |

可以看到，網速越快所需的距離閾值越小，也就是可以在更接近 viewport 的地方載入資源。

我們可以透過 DevTools 的 Network 來測試，web.dev 提供了一個 [demo](https://lazy-load.netlify.app/iframes/) 可以玩玩看，可以看到 youtube 的 iframe 在 scroll 接近時開始載入，到我們滑到時便可以直接使用。
{% youtube YMbXR40qLrk %}

## 結論
lazy loading 很好用，提升網站效能，但可能會需要注意 distance from viewport，如果距離 viewport 太近（例如就在 banner 下面) ，一樣會在剛開始時就被載入，可能就沒什麼效果！


###### tags: `blog` 