import { recycle } from '../../src/vdom';

describe('recycle', () => {
    it('should convert a null or undefined value to an empty vnode', () => {
        expect(recycle(null)).to.equal(null);
        expect(recycle(void 0)).to.equal(null);
    });

    it('should convert a text node into a vnode', () => {
        const text = document.createTextNode('foo');

        expect(recycle(text)).to.equal('foo');
    });

    it('should convert a DOM tree into a vnode tree', () => {
        const root = document.createElement('div');
        root.innerHTML = '<div id="foo"><span class="bar">baz</span><em></em></div>';

        expect(recycle(root.firstChild)).to.deep.equal({
            nodeName: 'div',
            attributes: {id: 'foo'},
            children: [
                {
                    nodeName: 'span',
                    attributes: {class: 'bar'},
                    children: ['baz']
                },
                            {
                    nodeName: 'em',
                    attributes: {},
                    children: []
                }
            ]
        });
    });

    it('should ignore the style attribute', () => {
        const root = document.createElement('div');
        root.innerHTML = '<div style="width: 100px"></div>';

        expect(recycle(root.firstChild)).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: []
        });
    });
});
