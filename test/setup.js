const VDOM = Symbol.for('vdom');

export const root = document.createElement('div');
document.body.appendChild(root);

export function expectHTML(html) {
    expect(root.innerHTML).to.equal(html.replace(/\s{2,}/g, ''));
}

afterEach(() => {
    root[VDOM] = null;
    root.innerHTML = '';
});

after(() => {
    document.body.removeChild(root);
});
