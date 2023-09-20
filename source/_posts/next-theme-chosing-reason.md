---
layout: page.md
title: Nextjs 13 簡介 & 選擇題目理由
date: 2023-09-18 22:32:19
categories:
- frontend
- ironman-2023
tags: 
- next.js
- 鐵人賽 2023
---

## 前言
隔了一年，我又來鐵人賽挑戰自我啦！去年寫的是 [React 的介紹](https://ithelp.ithome.com.tw/users/20146829/ironman/5862)，實際進入業界後發現 React 的生態系比自己想像的更廣更深，還有很多東西可以深挖。
這次想要來介紹 React 的全端框架 - Next.js ，探索升級後的 Next.js 有哪些改變，又帶給前端開發者什麼樣的好處/不便，讓你我都更深入了解 Next.js。

## 什麼是 Next.js
Next.js 是一個以 React 為基礎的框架，他讓 React 網頁開發不僅僅侷限在 CSR（ Client Side Render）上，而可以做到 SSR (Server Side Render)/SSG (Server Side Generator)。
Next 不僅可以寫前端，也可以寫後端。使用 Next 的 api route 可以輕易寫出後端的 api ，讓 Next 可以拿來建構全端專案，特別是現在網頁可能都需要寫一點後端來處理邏輯。
如果需要使用 SSR 、需要寫點後端 api 時，Next 會是很好的解決方案。

## 選擇理由
Next 在今年升版到了 13.4 ，更新了他的 folder structure、component 的寫法，並增加許多的功能。
跟上個版本相比，這一版的改動幅度很大，很多過去的寫法都需要改變，也會踩到很多的雷。
有鑒於 Next 13 的中文資料沒有很多，我也剛好在試著用 Next 13 寫專案，因此想藉著這次鐵人賽，跟大家分享 Next 13 該怎麼寫，以及我碰到的一些開發上的經驗。

## 文章架構
文章安排如下：
1. Nextjs 13 簡介/選擇題目理由
2. Next 是什麼？
3. Next 環境建置及技術選型
5. Next app route 概念
6. compete with page route
7. client side component
8. server side component
9. data fetch
10. page and layout
11. react suspense and loading
12. error handling
13. dynamic route (SSG)
14. dynamic route (SSR)
15. parallel route
16. intercept route
17. hooks
18. example: todolist(1)
19. api route
20. server actions
21. middleware
22. serverside functions
23. example：todolist(2)
24. other useful components
25. test
26. styled component
27. next-auth
29. should I still use Redux?
30. Redux Toolkit
31. Redux Saga
32. 完賽感想

前半段會是 Next 13 的使用和介紹，後半段會介紹一些常使用到的套件，怎麼設定、使用方式、可能會碰到的雷等等。
這些內容是大概的構想，實際內容可能會根據過程中的規劃改變。

下一篇就正式開始囉!