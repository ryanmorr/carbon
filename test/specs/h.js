import { h } from '../../src/velvet';

describe('h', () => {
    const TEXT_NODE = 3;
    const ELEMENT_NODE = 1;
    
    it('should create a virtual element', () => {
        expect(h('div')).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            attributes: {},
            children: []
        });
    });

    it('should create a virtual element with attributes', () => {
        expect(h('div', {id: 'foo', class: 'bar'})).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            attributes: {id: 'foo', class: 'bar'},
            children: []
        });
    });

    it('should create a virtual element with a single text child', () => {
        expect(h('div', null, 'foo')).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            attributes: {},
            children: [
                {
                    type: TEXT_NODE,
                    node: null,
                    text: 'foo'
                }
            ]
        });
    });

    it('should create a virtual element with a single element child', () => {
        expect(h('div', null, h('span'))).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            attributes: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    attributes: {},
                    children: [],
                }
            ]
        });
    });

    it('should create a virtual element with multiple children', () => {
        expect(h('div', null, h('i'), 'foo', h('em'))).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            attributes: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    nodeName: 'i',
                    node: null,
                    attributes: {},
                    children: [],
                },
                {
                    type: TEXT_NODE,
                    node: null,
                    text: 'foo'
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'em',
                    node: null,
                    attributes: {},
                    children: []
                }
            ]
        });
    });

    it('should accept an array as children', () => {
        expect(h('div', null, [h('i'), h('em')], h('span'))).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            attributes: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    nodeName: 'i',
                    node: null,
                    attributes: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'em',
                    node: null,
                    attributes: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    attributes: {},
                    children: []
                }
            ]
        });
    });

    it('should allow skipping attribute definition', () => {
        expect(h('div', h('span', 'foo'), h('em', ['bar', 'baz', 'qux']))).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            attributes: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    attributes: {},
                    children: [
                        {
                            type: TEXT_NODE,
                            node: null,
                            text: 'foo'
                        }
                    ]
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'em',
                    node: null,
                    attributes: {},
                    children: [
                        {
                            type: TEXT_NODE,
                            node: null,
                            text: 'bar'
                        },
                        {
                            type: TEXT_NODE,
                            node: null,
                            text: 'baz'
                        },
                        {
                            type: TEXT_NODE,
                            node: null,
                            text: 'qux'
                        }
                    ]
                }
            ]
        });
    });

    it('should support keys', () => {
        expect(h('div', {key: 'foo'})).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            attributes: {key: 'foo'},
            children: []
        });
    });

    it('should remove null and undefined children', () => {
        expect(h('div', {}, [null, 'foo', undefined, 'bar'])).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            attributes: {},
            children: [
                {
                    type: TEXT_NODE,
                    node: null,
                    text: 'foo'
                },
                {
                    type: TEXT_NODE,
                    node: null,
                    text: 'bar'
                }
            ]
        });
    });

    it('should support JSX', () => {
        const title = 'Hello World';
        const content = 'Lorem ipsum dolor sit amet';

        expect((
            <div>
                <h1>{title}</h1>
                <section class="content">{content}</section>
                <span />
            </div>
        )).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            attributes: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    nodeName: 'h1',
                    node: null,
                    attributes: {},
                    children: [
                        {
                            type: TEXT_NODE,
                            node: null,
                            text: 'Hello World'
                        }
                    ]
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'section',
                    node: null,
                    attributes: {class: 'content'},
                    children: [
                        {
                            type: TEXT_NODE,
                            node: null,
                            text: 'Lorem ipsum dolor sit amet'
                        }
                    ]
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    attributes: {},
                    children: []
                }
            ]
        });
    });
});
