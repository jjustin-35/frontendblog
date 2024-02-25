---
title: Redux Saga 是什麼？異步處理方案 Redux Saga 教學
categories:
  - frontend
tags:
  - Redux
  - JavaScript
date: 2023-04-09 00:34:58
---

Redux Saga 是一個專門處理 Side Effect 的 Middleware，尤其是在處理非同步的讀取（如串接 API），可以幫助我們更好的使用非同步的功能。

## 基本概念
Saga 是一個 Middleware，因此他會在 dispatch action 到 store 之前處理 相關的 action。

![](https://i.imgur.com/OdEL7fs.gif)

middleware 會在 dipatch action 到 store 之前處理 action ，並且根據 action 的描述溝通 api，處理之後再發送 action 進 store。

要注意的是，這些被 dispatch 進去 saga 的 action **仍然會進入 store** ，雖然 saga 看起來很像是攔截了該 action ，但是實際上仍會被 dispatch 進去。

## function* - generator function & yield
在講 Saga 前，需要先認識 function* 和 yield 這兩個東西。這兩個是 JavaScript 原生的 api，是 ES6 的語法。

### function*
`function*` 是一個 generator function，寫法如下:
```javascript
function* generator(){
    console.log('hello')
}
```
實際執行上面的 generator()，會發現:
```javascript
generator();
// 沒有 log 出 hello
```
與一般的 function 不一樣，當執行 generator() 時，function 不會如往常般執行，回傳的也不是執行後結果，而是一個迭代器 (iterator)。
function* 所宣告的 function 會暫停內部程式碼的執行，要執行其中的功能，需要透過迭代器呼叫 `next` 方法，才能執行:
```javascript
const iterator = generator();

iterator.next();
// 'hello'
// {value: undefined, done: true}
```
如果在瀏覽器跑的話，可以看到會回傳一個物件，裡面有一個 value 和一個
### yield
yield 會暫停其後程式碼的執行，直到呼叫 `next` 方法。
```javascript
// 搭配generator function使用
function* generator(){
     const data = yield doSomethingGood();
     yield console.log('after something good');
}

const it = generator();

it.next(); // doSomethingGood();
it.next(); // after something good
```

## Saga 用法
### createSagaMiddleware
先建立 saga middleware，接著才放入 createStore。
```javascript
const sagaMiddleware = createSagaMiddleware();

cosnt store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
)
```
### fetch data
建立一個可以跟 api 溝通的 function，使用 saga 的 call 、 put 方法：
```javascript
import {call, put} from 'redux-saga/effects';

function* fetchData(url){
    const data = yield call(() => fetch(url).then(newData => newData.json()));
}
```


#### call
執行函式用的 api，傳入 function 以及參數可以執行該 function ，其中，參數可以是 generator function 或是 promise ，若是 promise ，他會等待直到 promise 被 resolve 或是 reject ，並回傳一個 promise；若是 generator 的話，則會如同在 generator 中直接執行一般，會等待子 generator 執行完成再繼續接下來的步驟。
```javascript
function* genfn(){
    const data = yield call(fetchData, url);
    ...
}
```

#### put
其實就是相當於 dispatch 的功能，可以將一個 action dispatch 進入 store：
```javascript
function* genfn(){
    const data = yield call(fetchData, url);
    yield put({type: 'FETCH_DATA_SUCC', data});
}
```
通常使用於資料處理結束後，要傳結果進入 store 時，會用到的。

### watcher
#### takeEvery
使用 takeEvery 可以接受到所有符合條件的 action ，並且執行 generator。
```javascript
function* watcher(){
    yield takeEvery('FETCH_DATA', genfn);
}
```
takeEvery 在取得多個相同的請求的情況下，可以僅發送一次請求，不會重複發送。


這些就是 Saga 的基礎用法，也是最常會使用到的 api ，但 Saga 能做的事遠遠不止這樣，下一篇會更詳細的介紹 Saga 究竟是什麼玩意兒（如果我夠勤奮的話）。