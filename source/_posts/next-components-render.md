---
title: next 13 - components render 機制
catagories:
  - frontend
tags:
  - next.js
  - 鐵人賽 2023
date: 2023-09-24 23:54:36
---
前面做了關於 client component 以及 server component 的基本介紹，這一篇來介紹一下他們背後的 render 機制。

## 新的 render 機制有那些好處?
- 使用 server side 的功能
前面介紹 server component 時有講到，server component 可以直接取用 server 的功能，並接介資料庫。
- 減少 bundle size
由於 server component 會執行一部份的 code ，不會進到 js bundle 裡面，因此到 client 端的 bundle size 會小很多。
- 自動 code split
code split 是將 js bundle 切割成一小個一小個 chunk ，讓 client 端在運行網站時，不需要直接下載所有的程式碼，而是下載有需要的就好。
過去 code split 常會用 lazy loading 的方式進行，像是用 next dynamic api 或著其他套件。next 13 中，由於 server component 和 client component 的特性，在渲染時相當於會自動進行 code splitting ，可以提升網站的效率。

## render 機制如何運作
server component 和 client component 會以**混和渲染**的方式渲染頁面。由前面介紹兩種 components 的內容可知，client component 和 server component 會交錯使用，並長成一個混和兩種元件的元件樹。
![混合式渲染，橘色為 Server Components，藍色為 Client Components](https://miro.medium.com/v2/resize:fit:875/1*i80QJHVT7OX4YL1kJDh1XQ.png)
> 混合式渲染，橘色為 Server Components，藍色為 Client Components。資料來源: [從 Next.js 13 認識 React Server Components](https://oldmo860617.medium.com/%E5%BE%9E-next-js-13-%E8%AA%8D%E8%AD%98-react-server-components-37c2bad96d90)

### 初次渲染
#### server 端
當使用者初次進入網站，client 向 server 發起 request 開始，next 會初始化整個頁面架構。在這個階段，next 會透過 React api 將 server component 渲染成 React Server Component Payload (RSC Payload) 這個特殊架構。

RSC Payload 描述了整個網頁的架構，從 root 的 component 到 leaf，元件樹會被記錄在這個 payload 裡面。由於 client component 不會在 server 上執行，因此當碰到 client component 時，會先在此處記個 placeholder，代表這裡是 client component，等到後續再做渲染。

接著 next 會將 RSC Payload 和 client component 結合，生成靜態的 HTML 檔案，並將這份 html response 給 client 端。

#### client 端
client 端接到 html 後，會立即拿來顯示給使用者。此時在 client 的頁面是**靜態，沒有互動功能的頁面**，只供初次顯示使用。

接著，client 拿到 RSC Payload 後，會拿這份 RSC Payload 整合 client/server component 的元件樹，並更新 client 上的 DOM。

等到 client 端下載完 js bundle 後，便會執行 React 的 hydration，將 js code 加到 client component ，到了這個階段，**網頁才有互動性**。

<img src="https://mermaid.ink/img/IGdyYXBoIExSOwoJczFbImBtYWtlIHNlcnZlciBjb21wIHRvIFJlYWN0IFNlcnZlciBDb21wb25lbnQgUGF5bG9hZCwKICAgIHdpdGggcmVmZXJlbmNlIG9mIGNsaWVudCBjb21wYCJdCiAgICBzMlsiYHVzZSBSU0MgUGF5bG9hZCBhbmQgY2xpZW50IGNvbXAganMgaW5zdHJ1Y3Rpb25zIHRvIHJlbmRlciBIVE1MYCJdCiAgICBjMVsiYHNob3cgaHRtbCBjb21lcyBmcm9tIHNlcnZlcmAiXQogICAgYzJbImB1c2UgUlNDIFBheWxvYWQgdG8gcmVjb25jaWxlIHNlcnZlciBjb21wIGFuZCBjbGllbnQgY29tcGAiXQogICAgYzNbImBoeWRyYXRlIGpzIG9uIGNsaWVudCBjb21wYCJdCiAgICBzdWJncmFwaCBzZXJ2ZXIKICAgIHMxLS0-czIKICAgIGVuZAogICAgczItLT5jMQogICAgc3ViZ3JhcGggY2xpZW50CiAgICBjMS0tPmMyCiAgICBjMi0tPmMzCiAgICBlbmQK" />

### Subsequent Request
#### client component
在初次渲染後，client component 就會留在 client 端渲染，**不會再由 server 生成 html** 。當頁面更新時，client component 會使用 client 端的 React api 更新頁面。

#### server component
server component 有三種渲染方式:
1. 靜態渲染 static rendering
靜態渲染會是在 build time 就渲染完成，包含 data fetching、使用 server 功能等，都會在 build time 就執行完，且不會再變動。
靜態渲染是預設功能，適合那種不會因為用戶資訊變動的資料，像是 country list 等資訊就很適合。
2. 動態渲染 dynamic rendering
動態渲染會在每一次的 request 時重新渲染，在 request time 時執行 server component 的 code，適合需要經常變動的資料，像是 user data  等。
那要怎麼使用動態渲染呢? next 會偵測資料狀態和 route 的渲染方式，檢查資料有沒有被快取、是不是 dynamic 的 route，自動切換至動態渲染。
next 有列出會動態渲染的幾種組合:
![](https://hackmd.io/_uploads/HJ1CyKn1a.png)

這邊另外說明一下，當 request 進來時，server component 會重新渲染，生成 RSC Payload ，再進 client 端與 client component 調和。這個階段不會重新下載 js bundle ，而是更新後的 RSC Payload 併進 client 端。
3. Streaming
前面有提到 code split，streaming 是類似這個功能的渲染方式，它可以提供漸進式渲染，也就是隨著使用者的瀏覽，漸進式的渲染出來。
這個功能可以利用 `loading.tsx` 和 `React.Suspense` 實作，之後會在介紹給大家。


以上，就是關於 components render 機制的介紹。相較於過去都是 client component ，內容比較複雜，學習難度較高，但同時也提升效率以及改善過去的一些痛點。
接下來會介紹 data fetch ，跟 server component 有關，請期待下一篇~