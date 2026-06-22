import h from './h.js';
import patch from './patch.js';





// console.log('vnode', vnode);
// console.log('vnode2', vnode2);

// 真实dom节点
let container = document.getElementById('container');
// 虚拟dom节点
let vnode = h('ul', {}, [
    h('li', {key: 'a'}, 'a'),
    h('li', {key: 'b'}, 'b'),
    h('li', {key: 'c'}, 'c'),
    h('li', {key: 'd'}, 'd'),
]);
let vnode2 = h('ul', {}, [
    h('li', {key: 'g'}, 'g'),
    h('li', {key: 'h'}, 'h'),
    h('li', {key: 'i'}, 'i'),
    h('li', {key: 'j'}, 'j'),
]);

const dom = patch(container, vnode);
// console.log('dom', dom);
const btn = document.getElementById('btn');
btn.addEventListener('click', () => {
    patch(vnode, vnode2);
});

