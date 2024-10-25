# www vs non-www 的區別
---
title: www 網址 vs 非 www 網址的區別
categories:
- frontend
tags: 
- web
date: 2024-10-25 15:11:00
---

[TOC]

網址有分成 `www` 前綴和無 `www` 前綴的兩種，兩種都相當常見，例如這個 blog 就是有 `www` 前綴的，而像 `https://hackmd.io/` 就沒有。
那這兩種網址究竟有什麼差別呢？好處壞處分別是？對 SEO 有什麼影響呢？以下紀錄一下 survey 後的筆記。

## `www` 與 `non-www` 的差別
`www` 和 `non-www` 沒有太大的差別，基本上現在的使用者在輸入網址時都會省略 `www` 前綴，瀏覽器也都會隱藏 `www`，`non-www` 會是使用者比較習慣的行為。

### www
- subdomain
`www` 本身可以當作是一個 subdomain，對某些需要區分 `www.example.com` 和 `example.com` 的網站來說，`www` 便可以派上用場。
- 限制 cookie
`www` 可以限制 cookie 的使用，不讓其 cookie 供其他的 subdomain 使用，原因也很好理解：`www` 本身就是一個 subdomain，並不是主 domain，因此他的 cookie 可以被限縮在這個 `www` 的 subdomain 下。

### non-www
- 符合使用者習慣
如同描述，現在的使用者習慣不打 `www`，瀏覽器也傾向隱藏，因此不使用 `www` 是比較符合使用者習慣的。
- 不會限制 cookie（domain 下皆可共用）
和 `www` 不同，沒有 `www` 前綴的網址本身是主 domain，因此他的 cookie 是在該 domain 下皆可共用的，無法限制僅於 non-www 的網址使用。

## 對 SEO 的影響
`www` 和 `non-www` 在 SEO 上幾乎沒有區別，基本上不會因為用了 `www` 而變好或變差，反之亦然。
不過，由於上述提到的，`www` 前綴的網址本身是個 subdomain，因此若以 `www` 的網址作為標準網址，則需要設定好導轉以及設定好 canonical 來指示搜尋引擎，避免索引時出現重複內容的問題。