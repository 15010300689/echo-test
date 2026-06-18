export default function createElement(vnode) {
    let dom = document.createElement(vnode.sel);


    // 如果vnode有text属性，说明它是一个文本节点
    if (vnode.children == undefined) {
        dom.innerText = vnode.text;
    } else if (Array.isArray(vnode.children)) {
        // 如果vnode有children属性，说明它是一个元素节点
        for (let i = 0; i < vnode.children.length; i++) {
            let child = vnode.children[i];
            dom.appendChild(createElement(child));
        }
    }

    vnode.elm = dom;

    return dom;
}