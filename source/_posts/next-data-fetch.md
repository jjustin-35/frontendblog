---
title: next.js 13 - Data Fetch 策略
catagories:
  - frontend
tags:
  - next.js
  - 鐵人賽 2023
date: 2023-09-24 23:56:59
---

今天要接著介紹網頁開發很重要的一環， data fetch。很多時候我們開發功能時，往往需要從外部拿取資料，要如何拿取資料就是很重要的問題。這一篇會來介紹如何在 next 13 裡做 data fetch，以及一些要注意的地方。

## 4 種 data fetch 策略
- 在 server 上使用 `fetch` api
next 支援在 server 使用 `fetch` api，相信大家應該都很熟悉 `fetch`，在 next 上可以在 server side 使用 fetch 來抓取資料。
- 在 server 上使用第三方套件
像是串接資料庫等，可能會在 server 上使用到第三方的套件，其 data fetch 的方式可能沒辦法使用 fetch，這樣的情況下，next 支援 `cache` api，讓第三方套件的資料一樣能被快取起來。
- 在 client 端透過 route handler fetch
在 client 端可以透過呼叫 route handler 來做 data fetch，這部分會待講到 route handler 時一起講。
- 在 client 端使用第三方套件
像是 SWR 或 React Query 等套件，或是透過 Redux Thunk、Redux Saga 來做 data fetch。

next 官方建議[盡量在 server 上做 data fetch](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#fetching-data-on-the-server) ，因此本篇會著重在如何在 server 上抓取資料，client 端的部分則會在講 route handler 或第三方套件時再介紹。

## 如何使用 fetch api
next 支援在 server side 使用 `fetch` api，並且將 `fetch` 強化，讓 `fetch` 有更多功能，幫助我們優化抓取資料的流程。

### 記憶 request，減少重複發送
React （不是 next ）強化了原有的 fetch api，在 fetch 上加入了“記憶”功能。

當發送一個 api 請求時，fetch 會記憶這個 request 的形式，當下次有同樣路徑、同樣格式的 request 要呼叫時，fetch 就會從記憶體中拉出上次 response 回來的結果，並回傳給呼叫的位置。

#### 如何運作
簡單講一下背後是如何運作的，可以看官方提供的這張圖：
![Diagram showing how fetch memoization works during React rendering.](https://nextjs.org/docs/light/request-memoization.png)
當第一次 request 送出時，記憶體沒有資料，會在 cache 裡記上`MISS`，並 call api，拿到資料後將資料丟入記憶體，並在 cache 記上`SET`，同時送資料給呼叫的地方。
後續每當有地方要 call api 時（不一定是同個 component），只要是相同的 request ，就會在 cache 上記 `HIT`，並回傳記憶體的資料。

#### 使用須知
要注意的是，這個功能是有些限制的：
- 僅限於 `GET` 方法能使用
- 僅會在 React Component Tree 上作用，Route handler 不管用
記憶功能只會在上一篇講過的 React Component Tree 作用，如果是 api route 這種 Route handler ，就不支援記憶功能。
- 當 component 渲染完成，記憶體就會重置並清空
也就是說 fetch 的功能是在渲染階段執行，一旦完成渲染，資料就會被清空不再保留。

### 快取資料
next 在 React 的基礎之上給 fetch 加強了兩個新功能，其中一個是 `cache`，透過這個快取設定可以將資料保留在記憶體中，跟前一點有異曲同工之妙，但不同的是：
- 使用 cache，component 會採 dynamic render 
前一篇有講的 dynamic render，也就是會變成每次 request 進來時就會渲染 server component。
- 可以使用於 `POST` 方法
原本的 fetch 僅能紀錄 `GET`，透過 cache 也可以使用在 `POST` 方法上。

cache 可以幫助我們記錄著資料，不需要每一次有 request 時就發一次 api，減少伺服器的負擔。

#### 如何使用
在 fetch 後面的 option 上加上 `cache: <setting words>`即可，其中 `force-cache` 是預設值，可以省略。
```jsx=
// force-cache is default
const data = await fetch('https://example.com/api', {cache: 'force-cache'})
```
其他的設定可以參考[官方文件](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching)，這邊就容我先跳過。

### Revalidation
revalidation (重新驗證？)是 next 給 fetch 的其中一個強化，用於 重新 fetch 資料。透過這個功能，可以確保取得的資料是我們需要且最新的，適合需要變動的資料。
revalidation 有兩種形式：
- time-based
time-based 就是每隔一段時間就重新抓取資料的意思，適合較不重要、不會頻繁變動的資料。
```typescript
const resp = await fetch(api, { next: { revalidate: 3600 } })
```
- on-demand
on-demand 則是提供開發者手動調整的選擇，他會根據設定的 event 執行重新抓取。
在 next 中有 cache tag 機制（就像上面提到的 `MISS`、`SET`、`HIT` 等），因此可以依據 tag 來要求做 revalidation；此外，也可以依據路徑的變動做 revalidation。
以下附上官方的例子：
- tag based
先在 fetch 時加上 tag：
```jsx=
export default async function Page() {
  const res = await fetch('https://...', { next: { tags: ['collection'] } })
  const data = await res.json()
  // ...
}
```
實做一個 route handler 來處理 revalidation，這邊是呼叫 next 提供的 `revalidateTag()` api：
```jsx=
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
 
// e.g a webhook to `your-website.com/api/revalidate?tag=collection&secret=<token>`
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const tag = request.nextUrl.searchParams.get('tag')
 
  if (secret !== process.env.MY_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }
 
  if (!tag) {
    return NextResponse.json({ message: 'Missing tag param' }, { status: 400 })
  }
 
  revalidateTag(tag)
 
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
```

- path based
一樣設計一個 route handler 來處理:
```jsx=
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
 
export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')
 
  if (!path) {
    return NextResponse.json({ message: 'Missing path param' }, { status: 400 })
  }
 
  revalidatePath(path)
 
  return NextResponse.json({ revalidated: true, now: Date.now() })
```
[官方連結](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#on-demand-revalidation)

## 如何使用第三方套件
如果今天需要用第三方套件來呼叫 api，像是 mongoose 這類連結資料庫的套件，有他們自己的呼叫方式，此時就不能使用 fetch 。那要如何實現類似記憶的功能呢？這時可以使用 react 提供的 `cache` function。

這個 `cache` function 可以應用在第三方套件呼叫 api 的 function 上，進而將資料記憶在快取裡，減少 api 的重複呼叫。
```typescript=
import { cache } from 'react';

export const getItem = cache(async (id: string) => {
  const item = await db.item.findUnique({ id })
  return item
})
```


以上，是關於 fetch data 的內容，在做網頁開發時必定繞不開這個課題，在 server 上做完 data fetch ，將可使 client 端減少負擔，而為了讓 server 上的資料抓取效能更好， React 和 next 設計了一連串的機制來處理資料抓取。