import vnode from './vnode.js'
import createElement from './createElement.js'
import patchVnode from './patchVnode.js'
/**
 * 对比两个vnode，判断是否需要更新
 * @param oldVnode 旧vnode（真实dom节点）
 * @param newVnode 新vnode（虚拟dom节点）
 * 
 * 新老节点替换的规则：
 * 如果新节点的tag和旧节点的tag不同，直接删除旧节点，创建新节点
 */

export default function (oldVnode, newVnode) {
    // 如果旧节点没有sel属性，说明它是一个真实dom节点，需要将它转换成vnode
    if (oldVnode.sel === undefined) {
        oldVnode = vnode(
            oldVnode.tagName.toLowerCase(), 
            {}, 
            [],
            undefined,
            oldVnode
        );

        console.log('oldVnode', oldVnode);
    }

    // 如果新旧节点的sel属性相同，说明它们是同一个节点，需要进行更新
    if (oldVnode.sel === newVnode.sel) {
        patchVnode(oldVnode, newVnode);
    } else {
        // 如果新旧节点的sel属性不同，说明它们不是同一个节点，需要进行替换
        // 新的虚拟节点创建为dom节点
        let newDom = createElement(newVnode);
        console.log('newDom', newDom);
        let oldDom = oldVnode.elm;
        if (newDom) {
            oldDom.parentNode.insertBefore(newDom, oldDom.nextSibling);
        }
        oldDom.parentNode.removeChild(oldDom);
        return newDom;
    }
}