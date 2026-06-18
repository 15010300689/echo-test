import vnode from './vnode.js';
export default function (tag, props, params) {
    if (typeof params === 'string') {
        return vnode(tag, props, undefined, params, undefined);
    }

    if (Array.isArray(params)) {
        const children = [];
        for (let i = 0; i < params.length; i++) {
            children.push(params[i]);
        }
        return vnode(tag, props,children, undefined, undefined);
    }
}