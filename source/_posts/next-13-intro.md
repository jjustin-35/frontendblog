---
layout: post.md
title: next 13 - Next 13.4 - 全新版本的 Next
date: 2023-09-20 23:07:08
categories:
- frontend
- ironman-2023
tags: 
- next.js
- 鐵人賽 2023
---

## 升版後的 Next
Next 在今年升版到 13.4，並增加了許多新的功能，同時也大幅翻轉了原先的寫法。
總的來說，新版本的 Next 將 data fetch 的層級拉低到 component，並增加了 component 的彈性，相較過去 (page router) 的寫法有了更多活用的可能性。
接著讓我們來認識一下升版後的 Next 吧！

<!--more-->

## 有哪些不同？
### App Route
新的 next 改了原本的 file-base route 架構，除了將來源資料夾從 /pages 改名 /app ，建立 route 的方式也有很大不同。
next 13 的 route 從 file route 變成了 directory route，就是 **route 會跟著 directory 名稱走**，詳細改變可以看下面這張表：


| version | next 12 | next 13 |
| -------- | -------- | -------- |
| **route name** | /auth/login | /auth/login |
| **file path** | /pages **/auth/login.tsx** | /app **/auth/login/page.tsx** |

要建立新 route ，會需要在 app 下建立一個新資料夾，並資料夾下面建立 page.tsx，以寫入這個 route 的內容，跟過去直接新建 `.tsx` 檔案直接寫的做法不太一樣。

### Page, Layout
next 13 新增了 `page.tsx`、`layout.tsx` 等檔案，在 route 下新建以這些名稱命名的檔案，會各自發揮不同的功用。
例如，前面有提及的 page，就是取代原先的 `<route>.tsx`，是主要的頁面內容；layout 則是新的功能，layout 會是這個 route 裡面的模板，裡面建立的 component 會套用在這個 route 裡所有的檔案上（包含下一層的 route）。

### Server Component
過去 next 的 component 都是 client component，也就是所有 react 的行為都會在 browser 執行，這樣讓 data fetching 必須另外用 `getServerSideProps` 抓取資料，再傳入 props 裡面，相對不直覺。
next 13.4 推出了 server component ，也就是在 server 執行的 component ，相較過去都是 client component 的環境，server component 有幾個優勢:
- **run in server**
server component 會在 server 裡執行 js code ，接著產出 JSON-like 的靜態檔案，再交給 client 的 ReactDOM render。
![](https://mermaid.ink/img/IGZsb3djaGFydCBMUgoJc3RlcDFbZmV0Y2ggZGF0YSBhbmQgcnVuIGpzIGluIHNlcnZlcl0KICAgIHN0ZXAyW2dlbmVyYXRlIEpTT04tbGlrZSBmaWxlIGFuZCBzZW5kIHRvIGNsaWVudF0KICAgIHN0ZXAzW3NlbmQgdG8gcmVhY3RET00gYW5kIHJlbmRlcl0KICAgIHN0ZXAxLS0-c3RlcDItLT5zdGVwMwo)
因此，原本不能直接在 component 裡的行為可以直接在 component 裡做，提升開發體驗以及整體效率。
- **reduce bundle size**
由於 server component 的 js code 都會在 build time 執行，**不會被包入 bundle**，因此可以減少 bundle 的 size，也可以提升網站的執行速度。
- **data fetching**
過去 next 12 的 data fetching，需要在 `getServerSideProps` 抓資料，或是另外用 Redux thunk、Redux Saga 等套件來幫助我們做 data fetch。
現在有了 server component ，開發者可以直接在 server component 裡直接 call api fetch data，相較以往方便許多。

## 我應該要用新功能嗎？
next 剛開始採用新模式，雖然出台很多嶄新功能，讓網頁開發效率更高、網站效率更快，但同時也還有很多套件沒跟上 next 的更版。
簡而言之，**新版本的環境尚不穩定**，要不要使用還是 depend on situation，如果今天是想要開發小專案或實驗性質的專案，大可以玩玩 next 13.4 的各種功能；但如果是開發大型專案，建議可以向 next 官方建議的那樣: 漸進式的使用 app router 的新功能。
現在的版本同時支援 page router 和 app router ，開發者可以在需要的地方用 app router 的功能，諸如 server component 這樣好用的功能，其他依然可以使用 page router 實作。
結論而言，**要不要使用需要看專案大小規模，以及你想不想用**。我認為可以趁現在 page router 跟 app router 共存的版本，漸漸 migrate 到 app router，未來 app router 的套件支援度和穩定性一定會更高的。