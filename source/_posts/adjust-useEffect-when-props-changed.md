---
title: 不要再用 useEffect 更新 state 了！props 更新篇
categories:
- frontend
- React
tags: 
- JavaScript
- React
date: 2025-10-7 01:52:00
---

React 開發者常常會用 useEffect 來更新 state，但如果是在操作有 effect 的行為之外用 useEffect 來更新 state，就很容易造成效能上的問題，這篇來講一下要如何在 props 改變時更新 state。

## Worst Way：用 useEffect 更新 state
有時候我們會習慣用 useEffect 來更新 state，像是傳進來的 props 更新時，就會用以下的方式來更新 state:
```jsx=
const Comp = ({ items }) => {
    const [selection, setSelection] = useState(null);
    
    useEffect(() => {
        setSelection(null)
    }, [items])
    
    //...
}
```

但 React 官方文件告訴我們，不要再這樣更新 state 了！這樣會導致元件多次不必要的 re-render，進而造成效能上的問題。
```
props 更新 -> component re-render -> useEffect 執行 setState -> component re-render
```
可以看到，一次 props 的更新造成兩次 re-render。

## Better Way: 比較 props 前後差異
要避免多次渲染，就是要盡量做到**在 rendering 時更新 state**。

如果在 component 正在 render 時，state 被更新的話，React 會將正在 render 的這版 JSX 丟掉，並立即嘗試重新 render。

因此，我們可以捨棄 useEffect，在一次 rendering 中用**比較前後 props**的方式來更新資料：
```jsx=
const Comp = ({ items }) => {
    const [selection, setSelection] = useState(null);
    const [preItems, setPreItems] = useState(items);
    
    // comparing in rendering
    if(items !== preItems) {
        setSelection(null);
        setPreItems(items);
    }
}
```

這樣可以避免 useEffect 造成的 re-render，React 會在 state 更新時並重新渲染新的 JSX。

> 注意：為了避免過多 state 更新導致 component rendering 中斷 -> 重新 render，React 限制只有**同一元件**的 state 在 rendering 更新才會立即 re-render，若是子元件在 rendering 更新，會跳錯誤。

## Best Way: 直接用 props 計算出需要的資料
最好的辦法就是**直接在一次 rendering 中計算出需要的資料**：
```jsx=
const Comp = ({ items }) => {
    const [selectionId, setSelectionId] = useState(null);
    
    const selection = items.find((item) => item.id === selectionId);
}
```
這樣的做法是需要用 id 之類的值來標記需要的資料，再從 props 裡 mapping 出真正需要的資料。

這樣是最簡潔、也最不會因為 useEffect 而耗費效能的方式，在不需要複雜計算的情況下，直接這樣計算就可以了。（複雜計算就需要考慮使用 `useCallback`、`useMemo` 或是抽成 custom hook。）

###### tags: `blog` 