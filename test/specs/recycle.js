import { recycle } from '../../src/velvet';

describe('recycle', () => {
    it('should convert a text node into a vnode', () => {
        const text = document.createTextNode('foo');

        expect(recycle(text)).to.equal('foo');
    });

    it('should convert a DOM tree into a vnode tree', () => {
        const root = document.createElement('div');
        root.innerHTML = '<div id="foo"><span class="bar">baz</span><em></em></div>';

        expect(recycle(root.firstChild)).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    nodeName: 'span',
                    attributes: {},
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
});
