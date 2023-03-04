---
title: 'Redux - 基本: store, dispatch & selector'
date: 2023-03-05 01:33:02
categories:
- frontend
tags: 
- Redux
- JavaScript
---

![](https://i.imgur.com/hFGODme.gif)

前一篇以經介紹了 action、reducer 了，這一篇繼續介紹 store 、 dispatch 以及 selector。

## store 
store 是儲存 reducer 的資料儲存庫，之前建立的 reducer 都會存放在這裡。
要創建一個 store ，可以使用 redux 提供的 `createStore`: 
```
const store = createStore(rootreducer);
```
> 現在 redux 會建議使用 redux toolkit 的 configureStore 替代 createStore，configureStore 基本上是 createStore 的加強版。

store 提供幾種方法可以使用：`getState()`、`subscribe()` 以及 `dispatch()`。
- `getState()` 可以取得 state 的值。
- `subscribe()` 可以傳入一個 callback function 監聽 state 的改變，並作相對應的處理，`subscribe()` 會回傳一個 unsubscribe 的 function 在監聽完成後取消監聽。
- `dispatch()` 則可以 dispatch action 進入 store。
```
import store from './store';
import actions from './actionCreator';

// get init state
const state = store.getState();

// subscribe state, and log it
const unsubscribe = store.subscribe(()=>{
    console.log(store.getState());
})

// dispatch action
store.dispatch(actions.addTodo(memo));

// unsubscribe
unsubscribe();
```
不過，我們現在基本上不用這個方法來取用 store 中的 state，而是使用 react-redux 提供的 hooks，`useSelector` 以及 `useDispatch`。

## Provider
要使用 useSelector 之前，需要先用 Provider 將要取用 store 的 components 包裹住，相當於 react 中 context 的 Provider。
```
<Provider store={store}>
    <App/>
</Provider>
```

## useSelector
`useSelector`是 react redux 提供的 hook ，可以輕易地取得 store 中的 state。
要使用 useSelector ，需要傳入一個 callback function，用以取得 state：
```
const todolist = useSelector(state => state.todolist);
```
與 store.getState() 不同，useSelector 是一個 hook ，因此當 state 改變時，可以觸發 re-render。

## useDispatch
`useDispatch`是用來 dispatch action 的方法，使用方法很簡單，只要使用 useDispatch，來取出 dispatch ，放入 action 即可。
```
const dispatch = useDispatch();

dispatch(someActionCreator(payload));
```