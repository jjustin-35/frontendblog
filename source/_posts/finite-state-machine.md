---
title: 【ＷebConf 筆記】有限狀態機是什麼？如何使用？
categories:
- frontend
tags: 
- JavaScript
---

[TOC]

以下是 2024 WebConf 第一場的筆記和心得，由於第一次接觸到有限狀態機這個概念，覺得相當有趣且可以實際運用在狀態管理上，來做個筆記。

<!-- more -->

## 有限狀態機是什麼
有限狀態機是什麼？根據維基百科上面的描述，有限狀態機是一個 **「表示有限個狀態以及在這些狀態之間的轉移和動作等行為的數學計算模型」**，簡單來說，有限狀態機是一個幫我們收斂狀態、控制狀態切換用的模型。

想像有一個紅綠燈，這個紅綠燈有幾種特性：
- 有三種狀態：綠燈、黃燈、紅燈
- 同一時間點只會顯示一種狀態
- 有一個初始狀態（例如一開始是綠燈）
- 有限數量的事件，轉換到下個狀態：
    - 綠燈時，經過一定秒數，轉黃燈
    - 黃燈時，經過一定秒數，轉紅燈
    - 紅燈時，經過一定秒數，轉綠燈
- 一個轉換 function，傳入現在的狀態和事件，會回傳下一個狀態

因為紅綠燈以上的特性，我們可以說紅綠燈是一個**有限狀態機**，也就是有**有限數量的狀態、有限數量的事件、每次僅啟動一個狀態**的運作機制，這樣的運作機制可以有效控制紅綠燈的顯示，避免出現同時亮兩個燈、綠燈後亮紅燈等錯誤狀態。

如果將紅綠燈寫成 function 會長這樣：
```typescript=
// machine: define the states and their events
const machine = {
    initial: 'green',
    states: {
        green: {
            on: { TIMER: { target: 'yellow' } },
        },
        yellow: {
            on: { TIMER: { target: 'red'} }
        },
        red: {
            on: { TIMER: {target: 'green'} }
        }
    }
}
```
```typescript=
// state: current state
// transition: get next state by state and action passing in
// send: change current state to next state by action
function createMachine(machine) {
    return {
        state: machine.initial,
        transition(state, action) { 
            return machine[state].on[action];
        },
        send(action) {
            const nextState = this.transition(this.state, action);
            this.state = nextState.target;
        }
    }
}
```
```typescript=
// use
const service = createMachine(machine);

const button = document.querySelector('button');
const light = document.querySelector('.light');

button.addEventListner('click', () => {
    const curState = service.state;
    const nextState = service.transition(curState, 'TIMER');
    
    console.log(curState, nextState);
    service.send('TIMER');
})
```
由於用了 machine 管理 state ，我們幾乎不需要寫 `if-else` 來做條件判斷，對於管理狀態來說易讀性更高。

有興趣可以參考我用有限狀態機概念寫的紅綠燈：
<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/jjustin-35/embed/WbeXPKJ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/jjustin-35/pen/WbeXPKJ">
  Untitled</a> by jjustin-35 (<a href="https://codepen.io/jjustin-35">@jjustin-35</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 為什麼要用有限狀態機？
### 有效管理狀態，避免過多狀態管理困難
當我們在開發程式時，常常會有一堆狀態要管理，且會有相應的事件需要處理，如果單純用變數和條件子句做處理，當 state 數量一多，便會難以管理，事件處理也很有可能會落東落西，導致 bug。
有限狀態機將 state 明確定義，每個 state 對應的事件、要轉換的狀態也都在 createMachine 時便定義清楚，不僅僅可以快速查找所有的 state 、event，也可以輕易擴展 state 和 event，避免因爲過長的 `if-else` 造成難以修改、擴充問題。

### 可以讓協作成員清楚知道系統的 state
有時候我們需要與其他成員協作，若是沒有定義清楚 state 的話，很容易會讓協作成員搞不清楚狀況，加深開發、維護難度。
有限狀態機在一開始 create machine 時便規範性地將 state 定義出來，可以讓協作成員快速理解該系統有哪些 state、event ，幫助協作成員快速上手。

## 工具 -- xstate
要使用有限狀態機，通常會建議使用套件協助管理，除了避免重複造輪子之外，若是自己寫的有限狀態機有缺陷，或著使用方式、寫法沒有定義好，可能都會讓自己和協作成員在使用上出現問題，沒有增加可讀性，反而更加難以維護。

### [xstate](https://stately.ai/docs/xstate)
xstate 是一個輕量化的套件，最大的特色是有 UI 介面，可以讓非工程成員也可以清楚知道系統的 state 和各式 event。
![截圖 2025-01-05 下午6.40.17](https://hackmd.io/_uploads/H1bibkOU1l.png)

套件遵循 functional programming 的精神，寫法就如同上面自己寫的有限狀態機一樣：
```typescript=
import { createMachine, createActor } from "xstate";

const machine = createMachine({
  id: "traffic-light",
  initial: "GREEN",
  states: {
    GREEN: {
      on: {
        TIMER: { target: "YELLOW" },
      },
    },
    YELLOW: {
      on: {
        TIMER: { target: "RED" },
      },
    },
    RED: {
      on: {
        TIMER: { target: "GREEN" },
      },
    },
  },
});

// use
const actor = createActor(machine);
const render = (state: string) => {
  document.body.innerHTML = JSON.stringify(state);
};

actor.subscribe((state: string) => {
  render(state);
});

actor.start();

const nextBtn = document.querySelector(".next-btn") as Element;
nextBtn.addEventListener("click", () => {
  actor.send({ type: "TIMER" });
});
```
可以到這裡試試看：https://stately.ai/viz

## [RxJS](https://rxjs.angular.tw/guide/overview)
RxJS 是一個蠻受歡迎的反應式編程套件，套件最大的特色是，有各式各樣的工具函數，可以透過不同工具管理執行、停止等工作流程，相當適合處理非同步事件。

舉例：
1. hash change
原本的 hash change 處理會寫成：
```typescript=
const hashListner = (callback) => {
    const handler = () => {
        callback(window.location.hash);
    }
    window.addEventListener('hash', handler);
    
    const cancel = () => {
        window.removeEventListener('hash', handler);
    }
    return {
        cancel,
    }
}

const hashChange = () => {
    //do something...
}

const { cancel } = hashListner(hashChange);
```
該寫法可能會因為不同協作成員的 coding 風格而有所改變，沒有統一性也不好維護。
若引用 RxJS，則可以統一寫法，提升可維護性及可讀性：
```typescript=
const getLocationHash = () => 
  window.location.hash.replace('#', '').split('/');

const hashChange$ = fromEvent(window, 'hashchange').pipe(
  map(getLocationHash),
  distinctUntilChanged(),
  startWith(getLocationHash()),
  shareReplay(1),
);

hashChange$.subscribe((hash) => {
  //do something...
});
```
對其他協作人員來說，`hashChange$` 可以透過 subscribe 來加上各種不同的處理 function，這樣的寫法可以讓 hashChange 這個 event 有高複用性，也可以限制 coding 風格，讓程式碼有統一寫法，進而提升可讀性和可維護性。

###### tags: `blog` 