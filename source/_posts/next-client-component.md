---
layout: ironmen.md
title: [next 13] - Client Component
date: 2023-09-24 23:51:48
catagories:
- frontend
tags:
- next.js
- 鐵人賽 2023
---

今天要來介紹 client component 的用法，其實 client component 就是過去 next 12 常用的 component，功能上大同小異，有用過 next 的讀者應該都相當熟悉。

不過 next 13 還是動了些手腳，因此今天就讓我來介紹一下要如何在 next 13 裡用 client component。

## 甚麼是 client component
client component 意指**在 client 端渲染的 component**，component 主要的互動行為和狀態切換都是在 server 端包成 js bundle 後，到了瀏覽器再渲染出來。

client component 其實就是過去常用的 React component，本身的寫法也與過去沒甚麼差別，都是 JSX 語法、React hooks 等等，也一樣能夠使用 browser 提供的 api。

不過到了這一代，next 推出了新的功能: server component，這種 component 可以在 server 端執行，能做只有在 server 才能做的事，也能減少瀏覽器的負擔。

相對的，**server component 不能在 client 端執行 js code**，如果要做網頁互動的功能，還是需要能在 client 端執行的 client component。

總結下來，新版的 next 有兩種功能，一種是原本就有的 client component ，一種是新的 server component，他們的分類如下:


| type | client component | server component |
| -------- | -------- | -------- |
| 執行環境 | 瀏覽器 | 伺服器 |
| 功能 | 提供網頁互動功能、能使用 browser api | 執行 server 功能、data fetching |


> 對 React 不太熟的朋友可以找找 React 的教學文章，或是看我去年寫的[不專業教學](https://ithelp.ithome.com.tw/articles/10291907)，這裡不再特別介紹 React。

## 如何使用 client component
由於 next 13 將**所有的 component 都預設為 server component**，也就是**只要沒有特別定義，next 會視 component 為在 server 端執行的**，而不是要在 client 端與使用者互動的 client component。

那要怎麼使用 client component 呢? 其實也相當簡單，在**component 的檔案最上面加 `use client` 的 tag**，next 就會知道這是要在 client 端渲染的 component ，並將他打包進 client component bundle 裡面。

> caution: 要注意一定要在檔案**最上面**，要寫在第一行，高於 imports 和其他 code。

```jsx=
'use client'
// your imports
import { useState, useEffect } from 'react';

const MyPage = (props) => {
    const [state, setState] = useState<string>('default');
    
    useEffect(() => {
        // do something
    }, [state]);
    
    return (
        <div>...</div>
    )
}

```

雖然這個動作很簡單，但如果每次都要做其實很麻煩。next 給了大家一個方便: **只要外層的 component 有 `'use client'`，裡面的所有 component 都會被視為 client component**，因此不需要在每個要用的元件都定義一次，只要在使用範圍的最外層定義就好。

## 要注意的地方
- server component 可以包 client component ，但 client component **不行**包 server component 。
總之就是 server component 一定要在 client component 的外層，例如:
```jsx=
'use client' // client component

const ClientComp = (props) => {
    useEffect(() => {
        ...
    }, [])
    
    return <div>...</div>
}
```
```jsx=
// 沒有 'use client'，這是 server component
import ClientComp from './ClientComp'

const ServerComp = (props) => {
    //do something
    return <ClientComp {...props} />
}
```
關於背後的機制會在下一篇講 server component 時一併解說。
- server component **可以**作為 prop 傳入 client component
也就是說，雖然 server component 不能直接包在 client component 裡面，但可以以 `children` 或其他 props 傳進去。
- 再三強調，`use client` 要寫最上面。


以上就是 client component 的解說，簡單來說它就跟過去的 component 沒兩樣，但多了 `'use client'` 和一些規則。

一開始使用時可能會不太習慣 (像我常會忘記加 `'use client'`，結果被報錯)，不過拆分成兩種 component 可以讓元件更好的各司其職，也讓網站開發的顆粒度從 "頁面" 縮小到 "元件"，可以做更靈活的搭配、操作。

下一篇就會是 next 13 結合 React 18 推出的新功能: server component，敬請期待!

