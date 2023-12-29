export let root = document.createElement('div');
document.body.appendChild(root);

export function expectHTML(html) {
    expect(root.innerHTML).to.equal(html.replace(/\s{2,}/g, ''));
}

beforeEach(() => {
    root._vnode = null;
    root.innerHTML = '';
});
