---
title: 演算法學習 - Linear Search 及 Binary Search 介紹
categories:
- frontend
tags: 
- JavaScript
- cs
date: 2024-12-02 12:46:05
---

最近在補資料結構與演算法，雖然實際在前端的工作中還沒有碰到需要使用演算法的地方，但學習資料結構與演算法，可以提升程式能力，也能為將來面試做準備。

這篇會從基礎的 Linear Search 和 Binary Search 介紹起，let's go~~

<!-- more -->

## Linear Search
顧名思義是「漸進式搜尋」，也就是一個一個找，透過檢查 array 中所有元素，尋找符合條件的元素。

### 停止條件:
- 找到相符元素
- 未找到，回傳 `-1`

### Big O notation
- best: `O(1)`
- worst: `O(n)`
    - 需要 loop 完整個 array
- average: `O(n/2)`

## Binary Search
先跟中間值比較，若大於／小於，再與大於/小於那一半的中間值比較，重複以上動作直到找到搜尋值。
- 優勢：相較於 linear search 會快很多
- 限制：僅能使用於 sorted array

範例程式碼，尋找符合條件的數字:
  ```typescript
  function(arr: number[], target: number) {
    let min = 0;
    let max = arr.length - 1;
    
    while (min <= max) {
      let middle = Math.floor((min + max) / 2);
      
      if (target < arr[middle]) {
        max = middle - 1;
      } else if (target > arr[middle]) {
        min = middle + 1;
      } else {
        return middle;
      }
    }
    
    return -1;
  }
  ```

### Big O notation:
- best: `O(1)`
- worst: `O(logn)`
    - 每次尋找都會將 array 切半尋找，若 length = 8，則過程為 `8 -> 4 -> 2 -> 1`，歷經 3 步，也就是 $\log_2 8 = 3$ ，因此可以類推演算法所需步數為 $\log_2 n$ ，O natation 為 `O(logn)`
- average: `O(logn)`