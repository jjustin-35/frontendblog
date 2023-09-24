---
layout: ironmen.md
title: next 13 - Next 環境建置及技術選型
date: 2023-09-20 23:12:57
categories:
- frontend
- ironman-2023
tags: 
- next.js
- 鐵人賽 2023
---

今天我們要來講如何做 Next 的環境建置，以及為 Next 的專案做技術選型，未來的程式範例以及專案實作都會以這個技術選型基礎為準喔！

## 環境建置
Node.js: 首先需要 Node.js ，[Next 官方文件](https://nextjs.org/docs/getting-started/installation)要求 Node.js 需要有 16.14 以上，這邊可以直接裝最新的[穩定版 18.17.1](https://nodejs.org/zh-tw/download)。
![](https://hackmd.io/_uploads/ryIgCdDA3.png)
Next.js: 接著可以安裝我們最重要的 Next.js，因為我們要學習使用最新的 13.4 版本，因此直接裝 latest 版。
這裡建議直接用官方提供的 `create-next-app` cli，省掉許多設定其他東西的步驟：
npx: 
```
npx create-next-app@latest
```

yarn:
```
yarn create next-app
```

我個人比較習慣用 `yarn` ，會選下面的建立方式。
接著會跳出一堆選項要你選，像是是否啟用 `TypeScript`、是否啟用 eslint、用什麼 router 方式建立程式等等，可以照自己習慣的選，下面會介紹我常使用的技術選型，供各位參考。

## 技術選型
- TypeScript：想必大家都聽過 TypeScript ，TypeScript 已經漸漸的成為了寫前端、Node.js 的顯學，其強大的型別判斷以及限制讓動態型別的 JavaScript 可以更清楚的判斷參數型別，避免出現無法預期的錯誤。
- eslint, prettier: 居家旅行寫程式必備，可以規範程式碼的寫法，讓程式碼易讀性更高。由於這兩個有些不相容，可以再裝 prettier-eslint 來使用，或者在 vscode 裝 extension 來用。可以參考卡斯柏寫的[這篇](https://www.casper.tw/development/2021/04/11/vscode-eslint-prettier/)設定。
- styled components: 很好用的 css-in-js 套件，css-in-js 指的是將 css 跟 js component 寫在一起，好處是這樣這個元件完整包含功能性與 css，需要重複使用時只要引入元件就 ok ，複用性極高。
styled components 就是一個很好用的 css-in-js 套件，他也支援 next ，因此這邊也會使用。
- redux: redux 是 react 生態系一個很重要的資料管理套件，最早是從 meta 發布的 flux 架構發展的。
redux 幫我們將 react 的 state、資料統一管理起來，當有需要跨很多層傳遞的參數，或著需要在很多地方使用的資料時，redux 是一個非常好用的工具。

## 程式架構
這邊介紹一下 next 的 route 結構。
next 的 route 是 file-system base，在特定資料夾下的檔案們就是一個個的 route，因此要建立 route 非常簡單，只要新增檔案就好。
但仍然有幾個檔案是必備的，這次我們要學習的是 app route ，根據官方文件，我們需要 /app folder (安裝時應該就有了)，裡面至少需要:
- page.tsx
- layout.tsx

現在還不需要知道這兩個頁面的意義，之後會介紹。

接著會需要建立幾個必要的資料夾: 
- components, containers: 放個別 component 用的，這邊會採用 components/containers 的分類法，components 專放 ui 呈現的元件，不會處理資料流以及複雜的邏輯；containers 則會放處理資料邏輯的元件，不會處理 css 樣式。實作上會是邏輯/樣式拆分，到 page 上在組合起來。
關於這個分法的說明可以參考: [React.js: Container vs Presentational Components](https://www.cythilya.tw/2018/04/14/container-components-vs-presentational-components/)
- config: 放一些重要的設定檔，例如套件需要的資訊、要 call 的 api 的網域之類的。
- constants: 放一些會常使用到的變數，如 api path、hex 色碼等。

做好這樣的準備，差不多就可以開始用 next 開發網站了! 其實還有許多東西，不過後面慢慢加就好。
明天會介紹 app route 的概念，正式進入 next 的開發!