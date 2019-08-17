import patch from './patch';
import { recycle } from './html';

export { html } from './html';

export function render(parent, newVNode) {
    const refs = {};
    const oldVNode = parent._prevVNode || recycle((parent && parent.childNodes[0]) || null);
    const element = patch(parent, oldVNode, newVNode, refs);
    parent._prevVNode = newVNode;
    return Object.keys(refs).length > 0 ? refs : element;
}
