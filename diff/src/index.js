import h from './h.js';
import patch from './patch.js';



let vnode2 = h('ul', {}, [
    h('li', {}, 'li'),
    h('p', {}, 'p'),
]);

// console.log('vnode', vnode);
// console.log('vnode2', vnode2);

// 真实dom节点
let container = document.getElementById('container');
// 虚拟dom节点
let vnode = h('h1', {}, 'hello world');

const dom = patch(container, vnode2);
console.log('dom', dom);
