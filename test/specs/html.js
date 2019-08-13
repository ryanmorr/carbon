import { html } from '../../src/velvet';

describe('html', () => {
    it('should create an element', () => {
        expect(html('div')).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: []
        });
    });

    it('should create an element with attributes', () => {
        expect(html('div', {id: 'foo', class: 'bar'})).to.deep.equal({
            nodeName: 'div',
            attributes: {id: 'foo', class: 'bar'},
            children: []
        });
    });

    it('should create an element with a single text child', () => {
        expect(html('div', null, 'foo')).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: ['foo']
        });
    });

    it('should create an element with a single element child', () => {
        expect(html('div', null, html('span'))).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [{
                nodeName: 'span',
                attributes: {},
                children: []
            }]
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
                    children: []
                },
                'foo',
                {
                    nodeName: 'em',
                    attributes: {},
                    children: []
                }
            ]
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
                    children: []
                },
                {
                    nodeName: 'em',
                    attributes: {},
                    children: []
                },
                {
                    nodeName: 'span',
                    attributes: {},
                    children: []
                }
            ]
        });
    });

    it('should support functional components', () => {
        const Component = sinon.spy((attributes, child) => html('div', attributes, child));

        expect(html(Component, {foo: 1, bar: 2, baz: 3}, 'foo')).to.deep.equal({
            nodeName: 'div',
            attributes: {foo: 1, bar: 2, baz: 3},
            children: ['foo']
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
                <Component foo="1" bar="2">foobar</Component>
            </div>
        )).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    nodeName: 'h1',
                    attributes: {},
                    children: ['Hello World']
                },
                {
                    nodeName: 'section',
                    attributes: {class: 'content'},
                    children: ['Lorem ipsum dolor sit amet']
                },
                {
                    nodeName: 'div',
                    attributes: {id: '1', class: '2'},
                    children: ['foobar']
                }
            ]
        });
    });
});
