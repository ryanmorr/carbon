import { h, TEXT_NODE, ELEMENT_NODE } from '../../src/velvet';

describe('h', () => {
    it('should create a virtual element', () => {
        expect(h('div')).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {},
            children: [],
            key: null,
            node: null
        });
    });

    it('should create a virtual element with attributes', () => {
        expect(h('div', {id: 'foo', class: 'bar'})).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {id: 'foo', class: 'bar'},
            children: [],
            key: null,
            node: null
        });
    });

    it('should create a virtual element with a single text child', () => {
        expect(h('div', null, 'foo')).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    type: TEXT_NODE,
                    text: 'foo',
                    node: null
                }
            ],
            key: null,
            node: null
        });
    });

    it('should create a virtual element with a single element child', () => {
        expect(h('div', null, h('span'))).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    nodeName: 'span',
                    attributes: {},
                    children: [],
                    key: null,
                    node: null
                }
            ],
            key: null,
            node: null
        });
    });

    it('should create a virtual element with multiple children', () => {
        expect(h('div', null, h('i'), 'foo', h('em'))).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    nodeName: 'i',
                    attributes: {},
                    children: [],
                    key: null,
                    node: null
                },
                {
                    type: TEXT_NODE,
                    text: 'foo',
                    node: null
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'em',
                    attributes: {},
                    children: [],
                    key: null,
                    node: null
                }
            ],
            key: null,
            node: null
        });
    });

    it('should accept an array as children', () => {
        expect(h('div', null, [h('i'), h('em')], h('span'))).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    nodeName: 'i',
                    attributes: {},
                    children: [],
                    key: null,
                    node: null
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'em',
                    attributes: {},
                    children: [],
                    key: null,
                    node: null
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'span',
                    attributes: {},
                    children: [],
                    key: null,
                    node: null
                }
            ],
            key: null,
            node: null
        });
    });

    it('should support keys', () => {
        expect(h('div', {key: 'foo'})).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {key: 'foo'},
            children: [],
            key: 'foo',
            node: null
        });
    });

    it('should remove null and undefined children', () => {
        expect(h('div', {}, [null, 'foo', undefined, 'bar'])).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    type: TEXT_NODE,
                    text: 'foo',
                    node: null
                },
                {
                    type: TEXT_NODE,
                    text: 'bar',
                    node: null
                }
            ],
            key: null,
            node: null
        });
    });

    it('should support JSX', () => {
        const title = 'Hello World';
        const content = 'Lorem ipsum dolor sit amet';

        expect((
            <div>
                <h1>{title}</h1>
                <section class="content">{content}</section>
            </div>
        )).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    nodeName: 'h1',
                    attributes: {},
                    children: [
                        {
                            type: TEXT_NODE,
                            text: 'Hello World',
                            node: null
                        }
                    ],
                    key: null,
                    node: null
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'section',
                    attributes: {class: 'content'},
                    children: [
                        {
                            type: TEXT_NODE,
                            text: 'Lorem ipsum dolor sit amet',
                            node: null
                        }
                    ],
                    key: null,
                    node: null
                }
            ],
            key: null,
            node: null
        });
    });
});
