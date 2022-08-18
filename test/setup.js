export let root;

export function expectHTML(html) {
    expect(root.innerHTML).to.equal(html.replace(/\s{2,}/g, ''));
}

beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
});

afterEach(() => {
    document.body.removeChild(root);
});
