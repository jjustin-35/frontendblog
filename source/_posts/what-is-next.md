---
layout: page.md
title: Next 是什麼？
date: 2023-09-20 23:03:12
categories:
- frontend
- ironman-2023
tags: 
- next.js
- 鐵人賽 2023
---

今天會介紹一下 Next 是什麼、為什麼要使用 Next，來幫助一些沒什麼接觸 Next 的朋友快速認識什麼是 Next。

## Next 出現背景
如同上一篇講的，**Next 是一個基於 React 的全端框架**，目的是為了解決用 React 建置網站時存在的問題。
為什麼 Next 會出現呢 ? 就需要回顧一下 CSR 和 SSR 了。
### CSR
傳統的伺服器渲染 (Server Side Render)，使用者發 request -> server 做好網頁 -> 渲染到瀏覽器上的做法，隨著網頁功能變多變複雜、前後端分離的趨勢，CSR 的概念逐漸興起。
CSR (Client Side Render) 將網頁內容從傳統的 server render 改由 JavaScript 在瀏覽器渲染。
由於使用者所有的互動（像是換頁、頁面更新）都由 JavaScript 執行 -> 渲染，少了一來一往的 request/response ，使用者體驗因此大幅上升。
然而，這樣的 CSR 也有缺點。
由於所有的頁面都由 JS 框架渲染，在 JS 跑出內容前整個網站只有作為容器的空 `<div>` ，對 SEO (Search Engine Optimization，搜尋引擎優化) 不好。
此外，網頁內容必須等待 JavaScript 下載完成才會開始渲染，第一次進入網站時會需要等比較久才能看到畫面，也是 CSR 的一大痛點。
> 註: 現在的 google 搜尋引擎可以等 JS 跑完後再 query 內容，即使使用 CSR 還是可以被搜尋到，但仍會有些限制在，可以看看 [google 的說明](https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript)。

### SSR/SSG 是什麼?
為了解決上述問題，新一代的 SSR (SSR with Hydration) 就出現了。
SSR 讓網頁渲染重新交由 server 端處理，但保留了 React 的優點，也就是換頁之類的與使用者互動的功能速度很快的部分。

跟傳統的 SSR 相同，先在 server 產出 html，並傳送給瀏覽器，讓瀏覽器先渲染出畫面；接著再讓瀏覽器下載 JavaScript，後續的渲染則如 CSR 一般交由 JavaScript 接手。

這個結合傳統 SSR 以及 CSR 的做法，讓使用者剛進入網頁時，可以先看到靜態網頁內容，避免 JavaScript 還沒下載好看不到畫面的窘境；且由於一開始就有網頁內容，搜尋引擎在爬蟲時很快便可以抓到內容，有利 SEO。

由於保留了 React 換頁及更新的實作方式，使用者在切換頁面時不會感受到重新載入的感覺，讓使用者體驗跟 CSR 一樣好。

SSG (Static Site Generate) 則是在 server 端就建好 html，接下來的 request 都會共用這個 html，不會因應使用者的 request 重新建置頁面。
SSG 會適合靜態、不會一直變化的頁面，像是部落格類型的網站。

Next 就是一個結合了 SSR 和 SSG 的全端框架，他讓開發者可以輕松的建構 React base 的 SSR/SSG 架構，也可以寫後端，省掉了再開個專案寫後端的煩惱。

## Next 功能
Next 相當好用，他提供了幾項功能讓開發者可以快速建置網頁。像是: 
1. file-system base 的 router: Next 提供以檔案建置 route 的功能，也就是說，在 pages/app 資料夾下 (看你用的版本而定) 的每個檔案就是一個 route，不用再額外做其他設定。
2. api router: api router 讓開發者不需要另開一個專案、用 express 等後端框架寫後端 (雖然你想還是可以) ，在 api folder 下面每個檔案就會是一個 api route ，方便寫 api。
3. SSR/SSG: 你可以在 Next 裡選擇要渲染 SSR 還是 SSG。
4. 內建 component/hook: Next 裡面內建好幾種功能性 component，像是 `<Link>`、`<Image>` 等，幫助開發者可以應用到需要的功能上；Next 也提供 hook，像是 `useRouter`，可以在 component 內處理 route 相關的功能。

原本想要接著介紹 Next 13 的，但發現內容會有點長，而且 Next 13 有蠻多新亮點的，明天再一起介紹!

參考文章：
[[教學] SSR 與 CSR 深度解析：從渲染方式到效能優化](https://www.shubo.io/rendering-patterns/)
[初探 Server-Side-Rendering 與 Next.js](https://medium.com/starbugs/%E5%88%9D%E6%8E%A2-server-side-rendering-%E8%88%87-next-js-%E6%8E%A8%E5%9D%91%E8%A8%88%E7%95%AB-d7a9fb48a964)
[Next.js](https://nextjs.org/docs)