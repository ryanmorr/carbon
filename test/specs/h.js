import { h } from '../../src/velvet';

describe('h', () => {
    const ELEMENT_NODE = 1;
    const TEXT_NODE = 3;

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

    it('should support functional components', () => {
        const Component = sinon.spy((attributes, child) => h('div', attributes, child));

        expect(h(Component, {foo: 1, bar: 2, baz: 3}, 'foo')).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {foo: 1, bar: 2, baz: 3},
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

        expect(Component.called).to.equal(true);
        expect(Component.args[0][0]).to.deep.equal({foo: 1, bar: 2, baz: 3});
        expect(Component.args[0][1]).to.deep.equal(['foo']);
    });

    it('should provide an empty object and an empty array to functional components if no attributes or children are supplied', () => {
        const Component = sinon.spy(() => <div></div>);

        expect(h(Component)).to.deep.equal({
            type: ELEMENT_NODE,
            nodeName: 'div',
            attributes: {},
            children: [],
            key: null,
            node: null
        });

        expect(Component.called).to.equal(true);
        expect(Component.args[0][0]).to.deep.equal({});
        expect(Component.args[0][1]).to.deep.equal([]);
    });

    it('should support JSX', () => {
        const title = 'Hello World';
        const content = 'Lorem ipsum dolor sit amet';

        // eslint-disable-next-line no-unused-vars
        const Component = sinon.spy(({foo, bar}, child) => (
            <div id={foo} class={bar}>{child}</div>
        ));

        expect((
            <div>
                <h1>{title}</h1>
                <section class="content">{content}</section>
                <Component foo="1" bar="2">
                    <div key="foo">foo</div>
                    <div key="bar">bar</div>
                </Component>
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
                },
                {
                    type: ELEMENT_NODE,
                    nodeName: 'div',
                    attributes: {id: '1', class: '2'},
                    children: [
                        {
                            type: ELEMENT_NODE,
                            nodeName: 'div',
                            attributes: {key: 'foo'},
                            children: [
                                {
                                    type: TEXT_NODE,
                                    text: 'foo',
                                    node: null
                                }
                            ],
                            key: 'foo',
                            node: null
                        },
                        {
                            type: ELEMENT_NODE,
                            nodeName: 'div',
                            attributes: {key: 'bar'},
                            children: [
                                {
                                    type: TEXT_NODE,
                                    text: 'bar',
                                    node: null
                                }
                            ],
                            key: 'bar',
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
