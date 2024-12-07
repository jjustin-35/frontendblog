---
title: React 底層機制：React Fiber 是什麼？
categories:
  - frontend
  - React
tags:
  - JavaScript
  - React
date: '2024-12-08T02:29:57.984Z'

---


[TOC]

自 React v16 起，React 進行了一次重大重構，採用了 Fiber 架構，不僅顯著提升效能，還為實現 React 18 中的 Concurrent Mode 奠定基礎。那麼，究竟什麼是 Fiber？


本文基於閱讀[React 開發者一定要知道的底層機制 — React Fiber Reconciler](https://medium.com/starbugs/react-%E9%96%8B%E7%99%BC%E8%80%85%E4%B8%80%E5%AE%9A%E8%A6%81%E7%9F%A5%E9%81%93%E7%9A%84%E5%BA%95%E5%B1%A4%E6%9E%B6%E6%A7%8B-react-fiber-c3ccd3b047a1)後的筆記，整理重點並適當補充解釋。若有興趣，可以參考莫力全的原文！

## React Fiber 是什麼？
React Fiber 是 React 在 v16 後重構的架構，透過 React Fiber 能夠提升 React 的效能，並實現 Hooks 和 concurrent mode 的功能。
Fiber 是纖維的意思，象徵此新架構的核心理念：將進程拆分為可暫停的小任務，並允許在任務間隙中讓瀏覽器執行其他高優先級工作，從而實現更高的並行性。
狹義上來說，Fiber 就是一種 object，透過 Fiber 可以描述 React 的 process (An unit of work for React to process)。

## Fiber 是為了解決什麼問題？
### React v15 的問題
舊版 React 在 **reconciliation** 過程中（生成新的 virtual DOM 並與舊的 virtual DOM 比對差異），採用的是 **Stack Reconciler** 的方式。這種方法使用遞迴（recursive）遍歷所有元件並比對每個節點。然而，這樣的實現有一個關鍵問題：**無法中途暫停**。一旦開始遍歷，就必須完成整個過程才能停止。
> This process is **recursive**. App may render to a <Greeting />, Greeting may render to a <Button />, and so on. The reconciler will “drill down” through user-defined components recursively as it learns what each component renders to.
> *[Implementation Notes](https://legacy.reactjs.org/docs/implementation-notes.html) -- Legacy Reactjs*


在這樣的架構下，若網頁龐大且複雜，瀏覽器的 main thread 便會因為忙著處理、渲染元件，被一個個任務阻塞卡住，導致網頁卡頓，影響使用者體驗。
![image](https://hackmd.io/_uploads/SklpSdP-Jg.png)
[<p style="font-size: 12px">React Fiber現状確認</p>
](https://blog.koba04.com/post/2017/04/25/a-state-of-react-fiber)
如上，React 從呼叫 `root.render(<App />)` 開始，不斷向下找元件，讓 main thread 塞滿任務。

### 解決方案：Fiber
要解決這個問題，勢必需要重構整個核心架構，將 stack reconciler 換成可以中途暫停的架構。
Fiber 有幾個核心功能：
- 可以將渲染畫面的任務切分成更小的任務
- 可以將任務依照優先權的高低排序
- 若有更重要的任務, 可以暫停任務, 去執行優先權更高的任務（排定優先序的目的）
- 重複使用先前建立過的任務

透過這些功能，React 可以適時暫停任務，從而讓瀏覽器執行諸如動畫等高優先級的工作，並且有效複用建立過的任務，提升效能及畫面流暢度。

下方的比較圖中，左方是原先的 stack reconciler，右方是 fiber reconciler，可以看到在流暢度上有頗大的差距。
![image alt](https://s3.amazonaws.com/media-p.slid.es/uploads/1103863/images/9133579/react-fiber.gif)
[<p style="font-size: 12px">圖片來源</p>](https://s3.amazonaws.com/media-p.slid.es/uploads/1103863/images/9133579/react-fiber.gif)

從效能上看，也可以看到任務不會被積在 call stack 中從而阻塞：
![image](https://hackmd.io/_uploads/rJMv-6Zmyg.png)
[<p style="font-size: 12px">React Fiber現状確認</p>
](https://blog.koba04.com/post/2017/04/25/a-state-of-react-fiber)

簡單來說，Fiber 更改了 Call Stack 的作法，並優化了整個架構，希望可以對每個任務和渲染做更細緻的處理。
這邊整理一下原有的 Stack Reconciler 和 Fiber Reconciler 的差異:
| 特性             | Stack Reconciler                  | Fiber Reconciler                            |
|------------------|-----------------------------------|--------------------------------------------|
| **資料結構**     | 	Call Stack   | Fiber Tree (Linked List) |
| **任務執行方式** | 同步執行，無法中斷               | 支援時間分片，任務可中斷並恢復            |
| **更新策略**     | 深度優先，同步遞迴               | 以優先級處理更新，分為 Render Phase 與 Commit Phase  |
| **效能優化**     | 適合小型應用，效能受限         | 提升大型應用效能，減少掉幀現象            |
| **開發難度**     | 結構簡單，直觀                   | 結構複雜，需額外處理時間調度與狀態管理    |


## React Fiber 如何實作？
### Fiber node
在開發 React 常會用到的 JSX component，會在 build 時被轉化成 component object （就是透過 `createElement` 在做的事），裡面會包含 component 的各種資訊，例如 element 屬性、props、states 等；然而 component object 並不是終點，react 還會再轉換成 **Fiber node**，同樣是個 object ，裡面有著 Fiber 模式需要的資訊，例如 children、sibling、return 等，下方會再詳細介紹。

### React 渲染流程
原先的 React 的渲染流程是 reconciler -> renderer，而 fiber 在 reconciler 之前再加上 scheduler，透過 scheduler 安排任務排序、調度工作，變成 scheduler -> reconciler -> renderer。
#### scheduler
scheduler 是 Fiber 引入的新階段，其主要功能是調度與排序任務。它會根據任務的優先級分配執行時間，確保高優先級的任務能在第一時間被處理，而低優先級任務則會在空閒時間執行。
#### reconciler
為 reconciliation 執行的階段，可再細分成兩個 phase: render phase 與 commit phase。
- **render phase**：根據 components 產生 virtual DOM，與前一個 virtual DOM 比對，透過 diff 演算法找出需要更新的 node，將這些 node 放入 update queue 中，交給 commit phase 更新。
- **commit phase**：遍歷 update queue，將裡面需要更新的 node **一次性**更新到 DOM 上。
#### renderer
處理實際畫面的渲染。React 將 reconciliation 的核心功能留在 `react` libary 中，將實際 render 到畫面上的功能獨立出來，讓 React 可以開發不同的平台。像是 `react-dom` 是給瀏覽器渲染、`react-native` 可以開發手機軟體等，透過核心與渲染功能的拆分，讓各種裝置都能用 React 開發，是大前端時代得以開啟的原因之一。

除了新增 scheduler，reconciler 也有做相應的調整，以下說明。

### Render phase
許多改動主要集中在 render phase。以下先來介紹一下 React 在 render phase 做了什麼:
- 自 root component 向下檢索 children
- 更新 state 和 props
- 呼叫 lifecycle hooks
- 比較前後的 component tree，並找出需要更新的 DOM 節點

過去的 React 以遞迴的方式遍歷 component tree 執行任務，會需要等所有 function 都執行完成後才能夠執行下一個任務。
當 component tree 又大又深時，這個演算法可能會無法在 1 幀（16ms）內完成工作，導致掉幀，畫面便會因此卡頓；過多的任務也會阻塞 main thread ，導致接下來的任務無法執行。

為了能靈活的控制每一幀的任務執行與否，也避免 call stack（需要執行的函數）無限增長，React 實作了一個可以暫停的架構，也就是 Fiber。

### Fiber Linked List Traversal
為了實現上面說的，React 將遞迴遍歷的方式改成了 linked list 的資料結構，linked list 的每一個節點都會指向下一個節點，有需要時，再行呼叫下個節點，也可以隨時暫停執行，不會有必須執行到底的狀況。

#### Linked list
Fiber linked list 有幾個特點：
- 每個 node 連結 children、sibling、 return。
    - children 連結子節點
    - sibling 連結兄弟節點
    - return 連結父節點
- 每個節點都只會有各一個 child、sibling 與 return。
- children 只會連結第一個 child，其他 children 會以第一個 child 的 sibling 連結。

畫出來會像這樣：
![1_mv0XXCAC9wYztIzdzx8J5Q](https://hackmd.io/_uploads/By9Vkkczke.png)

至於 React 是如何遍歷這個 Linked list 的呢？主要 follow 以下兩個原則：
1. DFS（深度優先搜尋）
2. 執行優先序：child -> self -> sibling

每個節點的任務有兩個步驟：`begin` 和 `complete`，`begin` 階段開始後，節點才會向下作 DFS 搜尋，任務完成到  `complete` 階段後，依優先序執行下個節點。
舉個例子，當遍歷到一個節點 A 時，會依照上述兩個規則處理：
1. 節點 A 會開始 `begin` 步驟，並按照執行優先序做 DFS。
2. 如果有 children ，向下搜尋，遍歷到的 children 執行`begin` 階段。
3. 若 children 皆執行完成（`complete`），便會 return 回父節點，也就是 A。
4. A 節點執行任務直到 `complete`。
5. A `complete` 後，指向 sibling 繼續執行。

可以參考下圖：
![1_TUZjD2-e26gPQtsIaneHRQ](https://hackmd.io/_uploads/SybBF1cGJe.gif)

React 的程式碼長這樣：
```typescript=
function workLoopSync() {
  // Perform work without checking if we need to yield between fiber.
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    // $FlowFixMe[incompatible-call] found when upgrading Flow
    performUnitOfWork(workInProgress);
  }
}
```
用 while 迴圈來 loop 整個工作流程，可以透過控制條件來停止執行。

> 這邊 React 會將 workLoop 拆成 sync 和 concurrent 主要是為了應對不同場景，sync 主要處理一般的 ui 渲染，像是 event 處理等，不適合中途停下，否則可能會有畫面與資料不同步的問題；concurrent 則是會在使用 `Suspense` 或 `useTransition` 時被呼叫，讓使用者可以根據任務優先級來判斷優先處理或者中斷任務。
> 關於 sync 和 concurrent workLoop 的詳細內容可以參考 [漫谈 react 系列(三): 三层 loop 弄懂 Concurrent 模式](https://juejin.cn/post/7022992730343079966)。

### 從 Render phase 到 Commit phase
接著來統整一下從 Render phase 走到 Commit phase 的整個流程:
#### Render Phase
1. **first render**: React 會遍歷整個 React tree，將 JSX 轉換成 component object， 再轉成 Fiber node。
2. **re-render**: 當 state 改變，React 會重複初次渲染的步驟，但這次會將改變 state 後產生 side effects 的 fiber node 放入 workInProgress tree。
3. **compare diff**: 新產生的 workInProgress tree 會與 current tree 做比較，並將需要執行的 side effects 放入一個 single-linked list 形式 effects 列表。

綜上所述，在 Render Phase 會產生兩個東西，供 Commit Phase 更新到畫面上:
- fiber tree
- effects list

#### Commit Phase
到了 Commit Phase，React 會**同步**地執行 effects list 中的 side effects，並將改變後的節點更新到 DOM 上。
需要同步執行的理由是，更新 DOM 的操作會需要一氣呵成，因此會需要一次性的執行過所有的 side effects，不然會有畫面上的不連貫。

由此可知，在 Render Phase，主要處理使用者**看不到的部分**，Commit Phase 則會處理讓使用者**看得到的部分**。

## 結語
React 作為我工作上主要的框架，雖然使用了一段時間，但我對它的底層邏輯一直都不了解，甚至一開始連 Fiber 是什麼也不清楚。雖然 Fiber 是在 React v16 推出的，已經是 2017 年的東西了，但 React 至今仍使用 Fiber 模式，並據此實現 hooks 、concurrent 模式，我覺得深入了解 Fiber 仍是相當重要的。

透過學習 Fiber 模式之於 React 的意義、在底層的運作，幫助我對 React 的運作了解更加深刻，能夠更加理解運作邏輯、流程，對開發也會很有幫助。

這篇講得沒有那麼深入，也還有許多東西沒講，像是 compare diff 的啟發式演算法、scheduler 的實作方式等，也許之後會再做更新XD (挖大坑)

**參考資料**
- [React 開發者一定要知道的底層機制 — React Fiber Reconciler](https://medium.com/starbugs/react-%E9%96%8B%E7%99%BC%E8%80%85%E4%B8%80%E5%AE%9A%E8%A6%81%E7%9F%A5%E9%81%93%E7%9A%84%E5%BA%95%E5%B1%A4%E6%9E%B6%E6%A7%8B-react-fiber-c3ccd3b047a1)
- [React Implementation Notes](https://legacy.reactjs.org/docs/implementation-notes.html)
- [React Fiber現状確認](https://blog.koba04.com/post/2017/04/25/a-state-of-react-fiber)
- [漫谈 react 系列(三): 三层 loop 弄懂 Concurrent 模式](https://juejin.cn/post/7022992730343079966)
- [react-books](https://xiaoxiaosaohuo.github.io/react-books/chapter1/fiberWorkflow.html)