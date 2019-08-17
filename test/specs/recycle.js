import recycle from '../../src/recycle';

describe('recycle', () => {
    it('should convert a null or undefined value to an empty vnode', () => {
        expect(recycle(null)).to.equal(null);
        expect(recycle(void 0)).to.equal(null);
    });

    it('should convert a text node into a virtual text node', () => {
        const text = document.createTextNode('foo');

        expect(recycle(text)).to.deep.equal({
            type: 'text',
            text: 'foo',
            node: text
        });
    });

    it('should convert a DOM tree into a virtual node tree', () => {
        const root = document.createElement('div');
        root.innerHTML = '<div id="foo"><span class="bar">baz</span><em></em></div>';

        const div = root.querySelector('div');
        const span = root.querySelector('span');
        const text = span.firstChild;
        const em = root.querySelector('em');

        expect(recycle(root.firstChild)).to.deep.equal({
            type: 'element',
            nodeName: 'div',
            attributes: {id: 'foo'},
            children: [
                {
                    type: 'element',
                    nodeName: 'span',
                    attributes: {class: 'bar'},
                    key: null,
                    node: span,
                    children: [
                        {
                            type: 'text',
                            text: 'baz',
                            node: text
                        }
                    ]
                },
                {
                    type: 'element',
                    nodeName: 'em',
                    attributes: {},
                    children: [],
                    key: null,
                    node: em
                }
            ],
            key: null,
            node: div
        });
    });

    it('should ignore the style attribute', () => {
        const root = document.createElement('div');
        root.innerHTML = '<div style="width: 100px"></div>';

        const div = root.firstChild;

        expect(recycle(div)).to.deep.equal({
            type: 'element',
            nodeName: 'div',
            attributes: {},
            children: [],
            key: null,
            node: div
        });
    });

    it('should recycle keys', () => {
        const root = document.createElement('div');
        root.innerHTML = '<div key="foo"></div>';

        const div = root.firstChild;

        expect(recycle(div)).to.deep.equal({
            type: 'element',
            nodeName: 'div',
            attributes: {key: 'foo'},
            children: [],
            key: 'foo',
            node: div
        });
    });
});
