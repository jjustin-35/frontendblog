---
title: [next 13] - server component
catagories:
  - frontend
tags:
  - next.js
  - 鐵人賽 2023
date: 2023-09-24 23:53:05
---

昨天介紹了 client component，今天要介紹 next 13 推出的新功能: server component。
server component 可以讓開發者在 server 上執行 js code，不用打包到 client 端再執行，既縮小 bundle size，又能更快速的 render 網頁，是相當不錯的功能。

## server component 是什麼?
server component 是**在 server side 渲染的 component**，顧名思義，server component 會在 server 執行 js code 並渲染，生成靜態檔案後再丟到 client 端顯示給使用者。

相對於 client component ，server component **不會**有 js code 在 browser 上執行，也因此 server component 沒辦法使用 React hooks 和 browser api，也就是**不能提供與使用者互動的功能**。

這個功能其實不算是新東西，React 在 2020 年便提出 server component 的概念，不過 React 的 server component 比較複雜，在跟 next 結合後，相對比較好使用。

## server component 的優點
- fetch data on server
server component 可以在 **server 上 fetch data、call api**，這些被 fetch 下來的 data 會被快取記住，因此可以在需要的 component 上重複使用這些資料，除了減少原本在 client 端 fetch 到 render 的時間，也可以減少發 request 的次數。
- 使用 server 功能以及使用資料庫
server component 在 server 上執行，因此可以直接跟 server 溝通，像是直接呼叫 internal api，以及直接連結資料庫等。
server component 也可以用來處理機敏資訊，避免機敏資訊暴露在 client 端的風險。
- 縮小 bundle size
前面有提及，使用 server component 可以**縮小 bundle size**，由於 server component 上的 js 會在 server 上處理完，不會被打包進 bundle 裡面，因此可以縮小 bundle size。
這個特性很適合用在需要大容量套件的情況，在 server 上執行的話就不需要進 client 端，減少 client 下載 bundle 的負擔。

## 如何使用
server component 是**預設使用的 component**，因此可以直接使用。
他可以是 async function ，拿來 fetch data 等。
```typescript=
const ServerComp = async (props) => {
  const resp = await fetch('https://example.com/api/do-something');
  const data = await resp.json();
  //... do something
  return <div>{data}</div>
}
```
要注意的是，**server component 不能在 client component 的內層**，但可以以**props 的形式傳入**。( 以 props 傳入的內容必須是以 [serialize](https://developer.mozilla.org/en-US/docs/Glossary/Serialization) 的內容)

本來還想介紹 client component 和 server component 的渲染機制，不過今天的內榮比想像多一點 (還有我來不及寫完)，所以我會放到明天介紹，敬請期待!