---
title: 甚麼是 unit test? unit test 介紹
categories:
- frontend
tags: 
- JavaScript
- unit-test
---

最近我在重構舊專案，並為其加入測試功能，也趁著這次機會，讓我學習我不太熟悉的單元測試，從而更深入地了解測試的技術細節。

近期會在部落格上分享一些單元測試的核心觀念，並介紹一些有關 jest 和 react-testing-library 的使用方法，以便對單元測試的概念進行整理。

<!-- more -->

## 什麼是 unit test
unit test (單元測試) 是指對程式碼的最小單位做測試，可能是一個 feature ，也可能是一個 function。

unit test 與 integration test (整合測試) 相對。unit test 針對軟體中每個基礎功能、單位的程式碼和邏輯做測試，不會管到程式的其他地方，其他功能不在 unit test 的範圍內。

相對的，integration test 就是整個功能的測試。以表單為例，表單是否可以填寫、填寫後有無正確檢查內容、送出功能是否正常等。這些一連串的行為都是 integration test 的測試對象。

我覺得 [Unit test 與 Integration test 概論](https://medium.com/@frozenfung/unit-test-%E8%88%87-integration-test-%E6%A6%82%E8%AB%96-41b39f0f823) 舉的例子不錯，以手電筒而言， unit test 就是開關、燈泡各自的測試；intergration test 則是整支手電筒能不能用的測試，有範圍上的區別。

## 怎麼寫 unit test
這邊簡單介紹一下要如何用 `jest` 來寫 unit test，大概說明一下觀念，更詳細的介紹會在之後的文章介紹。

假如今天有個 function 要測試:
```typescript=
const sum = (num1: number, num2: number) => {
    return num1 + num2;
}
```
我們要測試這個 `sum()` function 是否能正確作用，需要設定 test case:
- 兩個數字能正確加起來

接著，便可以寫 unit test 了。
```typescript=
// jest 寫法
test('should return correct value of sum', () => {
    // 設定預期結果
    const expect = 5;
    
    // 判斷 function 的結果是否與預期相同
    expect(sum(2, 3)).toBe(expect);
})
```
這樣，就完成一個簡單的測試了。