---
title: 'Redux - 基本: Actions & Reducer'
date: 2023-02-14 00:30:51
categories:
- frontend
tags: 
- Redux
- JavaScript
---

Redux 是一個資料（狀態）管理套件，他是參考 meta 公司提出的 Flux 架構實作而出的。

## Flux
Flux 是一種設計方式，為了控制狀態與 view 的資料流不會過於繁雜，因而設計了一套將資料與 view 分離的模式，即是 Flux 。
![](https://i.imgur.com/KLtRG6B.png)
當有 action 觸發，需要改變資料或畫面時，會讓 dispatcher 分派指令給 store（資料），在進而改變 view ( 畫面 )，如果又觸發什麼指令，仍然需要經過 dispatcher 派發指令，呈現**單一資料流**。
![](https://i.imgur.com/hFGODme.gif)


這是 redux 的運作模式，與上述類似，使用者在 UI 部分進行操作，發送一個 event 給 dispatcher ， dispatcher 發送一個 action 給 store ，store 是儲存 reducer （資料儲存）的地方，並且會依據 Action 的類別對狀態進行變更。當 state 變更，UI 便會呈現相對應的變化。

## Actions
在使用 Redux 時，相當重要的就是 Action 的使用。透過 Action ，才能將使用者需要執行的動作執行，並且改變狀態。

### Flux Standard Action
Flux Stardard Action(FSA) 是基本 Action 的格式 ：
```javascript
const action = {
    type: "ADD_TODO",
    payload: "this is new memo"
}
```
其中，type 為必須的，其他（包含 payload、error、meta）都是選擇性的。

- payload: 可以放入任何型別，傳輸資料。
- error: 傳輸錯誤與否。
- id: 可以放入 id ，指出是哪個 id 要求的。

### Action type
要使用 action ，我們可以先定義上述的 action type:
```javascript
export const ADD_TODO = 'ADD_TODO';
```
這樣在取用 action 時，就只需要引入 action type 的檔案，方便使用 action type，也方便管理 action type。

### Action Creator
為了產生 Actions ，可以將 action 包裝成一個 function，根據不同 type 使用不同的 Action Creator。
```javascript
import {ADD_TODO} from './actionType.js';
const addTodo = (text) => {
    return {
        type: ADD_TODO,
        payload: text
    }
}
```

**注意:**
在專案中有時候會有 XXX_SUC、XXX_FAL 的 type，主要是為了描述諸如串接 API 時是否成功或著是失敗。

## Reducer
Reducer 是 state 處理的地方，他就像是 `Array.reduce()` 中會放入的 function，會根據指定的 action 將 state 加工成下一個 state 並回傳。
```javascript
import * as actions from 'actionType.js';

const initState = [];

const reducer = (state = initState, action)=>{
    switch(action.type){
        case actions.ADD_TODO:
            return [
                ...state,
                action.payload
            ];
        case actions.REMOVE_TODO:
            return state.filter(todo => todo.id !== action.id);
        default: 
            return state;
    }
}
```
要注意的是，reducer 需要是一個 pure function，也就是每次輸入同一個值，可以預測輸出的值會是一樣的，這樣不僅提升可讀性，也方便維護。
要做到這件事，必須要讓 function 不會修改到外面的東西。immutable (不可改動)的 primate value 沒有甚麼問題，但 object (包含 array) 是 mutable 的，因此若是直接修改 object 及 array 的值，將會改變原本的 object、array 。為此，我們必須回傳一個新的 object。
可以使用 ES6 的展開運算子做到這樣的事。

另外，也建議不要在 reducer 中做條件判斷，可以嘗試將邏輯判斷抽離 reducer ，另外寫成一個 function ，可以提高可讀性。

### combineReducers
由於只能有一個 Reducer，如果有複數的 reducer 的話，就需要使用 combineReducer 這個 function 來合併 reducer 。
```javascript
import {combineReducer} from 'readux';

const rootReducer = combineReducers({
    reducer1,
    reducer2
})
```


參考文章：
https://chentsulin.github.io/redux/docs/basics/Actions.html