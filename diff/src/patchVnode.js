import createElement from "./createElement.js";
import updateChildren from "./updateChildren.js";
export default function patchVnode(oldVnode, newVnode) {
    // 新节点没有children属性，说明它是一个文本节点，需要更新文本内容
    if (newVnode.children === undefined) {
        if(newVnode.text !== oldVnode.text) {
            oldVnode.elm.textContent = newVnode.text;
        }
    } else {
        if (oldVnode.children !== undefined && oldVnode.children.length > 0) {
            // 新节点有children属性，旧节点也有children属性，需要进行递归更新
            // 最复杂的情况，diff的核心  oldVnode.elm  oldVnode.children, newVnode.children

            updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
        } else {
            // 新节点有子节点，旧节点没有子节点，需要创建子节点
            // 先清空旧节点的子节点
            oldVnode.elm.innerHTML = '';
            // 再创建新节点的子节点
            for (let child of newVnode.children) {
                // 递归创建子节点
                let childDom = createElement(child);
                oldVnode.elm.appendChild(childDom);
            }
        }
    }
}