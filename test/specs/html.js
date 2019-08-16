import { html } from '../../src/vdom';

describe('html', () => {
    it('should create an element', () => {
        expect(html('div')).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [],
            key: null
        });
    });

    it('should create an element with attributes', () => {
        expect(html('div', {id: 'foo', class: 'bar'})).to.deep.equal({
            nodeName: 'div',
            attributes: {id: 'foo', class: 'bar'},
            children: [],
            key: null
        });
    });

    it('should create an element with a single text child', () => {
        expect(html('div', null, 'foo')).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: ['foo'],
            key: null
        });
    });

    it('should create an element with a single element child', () => {
        expect(html('div', null, html('span'))).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [{
                nodeName: 'span',
                attributes: {},
                children: [],
                key: null
            }],
            key: null
        });
    });

    it('should create an element with multiple children', () => {
        expect(html('div', null, html('i'), 'foo', html('em'))).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    nodeName: 'i',
                    attributes: {},
                    children: [],
                    key: null
                },
                'foo',
                {
                    nodeName: 'em',
                    attributes: {},
                    children: [],
                    key: null
                }
            ],
            key: null
        });
    });

    it('should accept an array as children', () => {
        expect(html('div', null, [html('i'), html('em')], html('span'))).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    nodeName: 'i',
                    attributes: {},
                    children: [],
                    key: null
                },
                {
                    nodeName: 'em',
                    attributes: {},
                    children: [],
                    key: null
                },
                {
                    nodeName: 'span',
                    attributes: {},
                    children: [],
                    key: null
                }
            ],
            key: null
        });
    });

    it('should support keys', () => {
        expect(html('div', {key: 'foo'})).to.deep.equal({
            nodeName: 'div',
            attributes: {key: 'foo'},
            children: [],
            key: 'foo'
        });
    });

    it('should support functional components', () => {
        const Component = sinon.spy((attributes, child) => html('div', attributes, child));

        expect(html(Component, {foo: 1, bar: 2, baz: 3}, 'foo')).to.deep.equal({
            nodeName: 'div',
            attributes: {foo: 1, bar: 2, baz: 3},
            children: ['foo'],
            key: null
        });

        expect(Component.called).to.equal(true);
        expect(Component.args[0][0]).to.deep.equal({foo: 1, bar: 2, baz: 3});
        expect(Component.args[0][1]).to.deep.equal(['foo']);
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
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    nodeName: 'h1',
                    attributes: {},
                    children: ['Hello World'],
                    key: null
                },
                {
                    nodeName: 'section',
                    attributes: {class: 'content'},
                    children: ['Lorem ipsum dolor sit amet'],
                    key: null
                },
                {
                    nodeName: 'div',
                    attributes: {id: '1', class: '2'},
                    children: [
                        {
                            nodeName: 'div',
                            attributes: {key: 'foo'},
                            children: ['foo'],
                            key: 'foo'
                        },
                        {
                            nodeName: 'div',
                            attributes: {key: 'bar'},
                            children: ['bar'],
                            key: 'bar'
                        }
                    ],
                    key: null
                }
            ],
            key: null
        });
    });
});
