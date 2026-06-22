import patchVnode from "./patchVnode.js";
import createElement from "./createElement.js";
/**
 * 判断两个节点是否是同一个节点
 * @param {*} oldVnode 旧节点(虚拟dom节点)
 * @param {*} newVnode 新节点(虚拟dom节点)
 * @returns {boolean} 是否是同一个节点
 */
const isSameVnode = (oldVnode, newVnode) => {
    return oldVnode.key === newVnode.key;
}

/**
 * 
 * @param {*} parent 父节点(真实dom节点)
 * @param {*} oldCh 旧子节点数组(虚拟dom节点)
 * @param {*} newCh 新子节点数组(虚拟dom节点)
 */
export default  (parentElm, oldCh, newCh) => {
    let oldStartIdx = 0; // 旧子节点数组起始索引
    let oldEndIdx = oldCh.length - 1; // 旧子节点数组结束索引
    let oldStartVnode = oldCh[0]; // 旧子节点数组起始节点
    let oldEndVnode = oldCh[oldEndIdx]; // 旧子节点数组结束节点

    let newStartIdx = 0; // 新子节点数组起始索引
    let newEndIdx = newCh.length - 1; // 新子节点数组结束索引
    let newStartVnode = newCh[0]; // 新子节点数组起始节点
    let newEndVnode = newCh[newEndIdx]; // 新子节点数组结束节点
    
    // 循环对比旧子节点数组和新子节点数组
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isSameVnode(oldStartVnode, newStartVnode)) {
            console.log('第一种情况：旧前和新前');
            // 第一种情况：旧前和新前
            // 处理起始节点相同的情况
            patchVnode(oldStartVnode, newStartVnode);
            if (newStartVnode.elm) {
               newStartVnode.elm = oldStartVnode?.elm;
            }
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];

        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            console.log('第二种情况：旧后和新后');
            // 第二种情况：旧后和新后
            patchVnode(oldEndVnode, newEndVnode);
            if (newEndVnode.elm) {
               newEndVnode.elm = oldEndVnode?.elm;
            }
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            console.log('第三种情况：旧前和新后');
            // 第三种情况：旧前和新后
            patchVnode(oldStartVnode, newEndVnode);
            if (newEndVnode.elm) {
               newEndVnode.elm = oldStartVnode?.elm;
            }
            // 将旧前节点插入到旧后节点的下一个兄弟节点前面
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            console.log('第四种情况：旧后和新前');
            // 第四种情况：旧后和新前
            patchVnode(oldEndVnode, newStartVnode);
            if (newStartVnode.elm) {
                newStartVnode.elm = oldEndVnode?.elm;
            }
            // 将旧后节点插入到旧前节点的下一个兄弟节点前面
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            console.log('第五种情况：其他情况');
            // 第五种情况：其他情况
            // 创建一个对象，存虚拟节点（判断新旧有没有相同节点）
            const keyMap = {};
            for (let  i = oldStartIdx; i <= oldEndIdx; i++) {
                const key = oldCh[i]?.key;
                if (key) {
                    keyMap[key] = i;
                }
            }

            // 在旧节点中查找匹配节点
            let idxInOld = keyMap[newStartVnode.key];
            if (idxInOld) {
                // 如果有，该数据在新旧虚拟节点中都存在，移动位置就可以了
                const elmToMove = oldCh[idxInOld];
                patchVnode(elmToMove, newStartVnode);
                // 处理过的节点,在旧的虚拟节点的数据组中，设置为undefined
                oldCh[idxInOld] = undefined;
                parentElm.insertBefore(elmToMove.elm, oldStartVnode?.elm);
            } else {
                // 如果旧节点中没有匹配节点，则创建新节点
                parentElm.insertBefore(createElement(newStartVnode), oldStartVnode?.elm);
            }
            // 新数据的指针向后移动
            newStartVnode = newCh[++newStartIdx];

            console.log('keyMap', keyMap);
        } 
    }
}