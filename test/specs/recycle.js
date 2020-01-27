import { recycle, TEXT_NODE, ELEMENT_NODE } from '../../src/velvet';

describe('recycle', () => {
    it('should convert a text node into a vnode', () => {
        const text = document.createTextNode('foo');

        expect(recycle(text)).to.deep.equal({
            type: TEXT_NODE,
            node: text,
            text: 'foo'
        });
    });

    it('should convert an element into a vnode', () => {
        const div = document.createElement('div');

        expect(recycle(div)).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {},
            children: [],
            key: null,
            node: div
        });
    });

    it('should convert multiple elements into an array of vnodes', () => {
        const div = document.createElement('div');
        div.innerHTML = '<div></div><span></span><em></em>';

        expect(recycle(div.childNodes)).to.deep.equal([
            {
                type: ELEMENT_NODE,
                nodeName: 'div',
                attributes: {},
                children: [],
                key: null,
                node: div.childNodes[0]
            },
            {
                type: ELEMENT_NODE,
                nodeName: 'span',
                attributes: {},
                children: [],
                key: null,
                node: div.childNodes[1]
            },
            {
                type: ELEMENT_NODE,
                nodeName: 'em',
                attributes: {},
                children: [],
                key: null,
                node: div.childNodes[2]
            }
        ]);
    });

    it('should convert an empty nodelist into a null value', () => {
        const div = document.createElement('div');

        expect(recycle(div.childNodes)).to.equal(null);
    });

    it('should convert an element with attributes into a vnode', () => {
        const div = document.createElement('div');
        div.innerHTML = '<div id="foo" class="bar"></div>';

        expect(recycle(div.firstChild)).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {
                id: 'foo',
                class: 'bar'
            },
            children: [],
            key: null,
            node: div.firstChild
        });
    });

    it('should convert a DOM tree into a vtree', () => {
        const div = document.createElement('div');
        const foo = div.appendChild(document.createTextNode('foo'));
        const em = div.appendChild(document.createElement('em'));
        const bar = em.appendChild(document.createTextNode('bar'));
        const span = div.appendChild(document.createElement('span'));
        span.setAttribute('id', 'abc');
        const i = span.appendChild(document.createElement('i'));
        i.setAttribute('class', '123');
        const qux = i.appendChild(document.createTextNode('qux'));
        
        expect(recycle(div)).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    type: TEXT_NODE,
                    node: foo,
                    text: 'foo'
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'em',
                    attributes: {},
                    children: [
                        {
                            type: TEXT_NODE,
                            node: bar,
                            text: 'bar'
                        }
                    ],
                    key: null,
                    node: em
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'span',
                    attributes: {
                        id: 'abc'
                    },
                    children: [
                        {
                            type: ELEMENT_NODE,
                            nodeName: 'i',
                            attributes: {
                                class: '123'
                            },
                            children: [
                                {
                                    type: TEXT_NODE,
                                    node: qux,
                                    text: 'qux'
                                }
                            ],
                            key: null,
                            node: i
                        }
                    ],
                    key: null,
                    node: span
                }
            ],
            key: null,
            node: div
        });
    });

    it('should ignore the style attribute', () => {
        const div = document.createElement('div');
        div.innerHTML = '<div style="width: 100px"></div>';

        expect(recycle(div.firstChild)).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {},
            children: [],
            key: null,
            node: div.firstChild
        });
    });

    it('should recycle keys', () => {
        const div = document.createElement('div');
        div.innerHTML = '<div key="foo"></div>';

        expect(recycle(div.firstChild)).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {
                key: 'foo'
            },
            children: [],
            key: 'foo',
            node: div.firstChild
        });
    });
});
