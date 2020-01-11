import { patch } from '../src/velvet';

let prevVNode = null;
export const root = document.createElement('div');
document.body.appendChild(root);

export function render(el, vnode) {
    const rootEl = patch(el, vnode, prevVNode);
    prevVNode = vnode;
    return rootEl;
}

export function expectHTML(html) {
    expect(root.innerHTML).to.equal(html.replace(/\s{2,}/g, ''));
}

afterEach(() => {
    prevVNode = null;
    root.innerHTML = '';
});

after(() => {
    document.body.removeChild(root);
});
