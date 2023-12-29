import { h } from '../../src/carbon';

describe('h', () => {
    const TEXT_NODE = 3;
    const ELEMENT_NODE = 1;
    
    it('should create a virtual element', () => {
        expect(h('div')).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {},
            children: []
        });
    });

    it('should create a virtual element with attributes', () => {
        expect(h('div', {id: 'foo', class: 'bar'})).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {id: 'foo', class: 'bar'},
            children: []
        });
    });

    it('should create a virtual element with a single text child', () => {
        expect(h('div', null, 'foo')).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {},
            children: [
                {
                    nodeType: TEXT_NODE,
                    node: null,
                    text: 'foo'
                }
            ]
        });
    });

    it('should create a virtual element with a single element child', () => {
        expect(h('div', null, h('span'))).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {},
            children: [
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    props: {},
                    children: [],
                }
            ]
        });
    });

    it('should create a virtual element with multiple children', () => {
        expect(h('div', null, h('i'), 'foo', h('em'))).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {},
            children: [
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'i',
                    node: null,
                    props: {},
                    children: [],
                },
                {
                    nodeType: TEXT_NODE,
                    node: null,
                    text: 'foo'
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'em',
                    node: null,
                    props: {},
                    children: []
                }
            ]
        });
    });

    it('should accept an array as children', () => {
        expect(h('div', null, [h('i'), h('em')], h('span'))).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {},
            children: [
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'i',
                    node: null,
                    props: {},
                    children: []
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'em',
                    node: null,
                    props: {},
                    children: []
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    props: {},
                    children: []
                }
            ]
        });
    });

    it('should allow skipping attribute definition', () => {
        expect(h('div', h('span', 'foo'), h('em', ['bar', 'baz', 'qux']))).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {},
            children: [
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    props: {},
                    children: [
                        {
                            nodeType: TEXT_NODE,
                            node: null,
                            text: 'foo'
                        }
                    ]
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'em',
                    node: null,
                    props: {},
                    children: [
                        {
                            nodeType: TEXT_NODE,
                            node: null,
                            text: 'bar'
                        },
                        {
                            nodeType: TEXT_NODE,
                            node: null,
                            text: 'baz'
                        },
                        {
                            nodeType: TEXT_NODE,
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
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {key: 'foo'},
            children: []
        });
    });

    it('should remove null and undefined children', () => {
        expect(h('div', {}, [null, 'foo', undefined, 'bar'])).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {},
            children: [
                {
                    nodeType: TEXT_NODE,
                    node: null,
                    text: 'foo'
                },
                {
                    nodeType: TEXT_NODE,
                    node: null,
                    text: 'bar'
                }
            ]
        });
    });

    it('should support stateless functional components', () => {
        const Component = () => h('div');
        
        expect(h(Component)).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {},
            children: []
        });
    });

    it('should provide properties as a parameter to components', () => {
        const Component = (props) => h('div', props);
        
        expect(h(Component, {foo: 'bar'})).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {
                foo: 'bar',
                children: []
            },
            children: []
        });
    });

    it('should provide children as a property to components', () => {
        const Component = ({children}) => h('div', null, children);
        
        expect(h(Component, 'foo')).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {},
            children: [
                {
                    nodeType: TEXT_NODE,
                    node: null,
                    text: 'foo'
                }
            ]
        });
    });

    it('should support sibling components', () => {
        const Foo = () => h('div', 'foo');
        const Bar = () => h('span', {class: 'abc'}, 'bar');
        
        expect(h('section', null, [h(Foo), h(Bar)])).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'section',
            node: null,
            props: {},
            children: [
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'div',
                    node: null,
                    props: {},
                    children: [
                        {
                            nodeType: TEXT_NODE,
                            node: null,
                            text: 'foo'
                        }
                    ]
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    props: {
                        class: 'abc'
                    },
                    children: [
                        {
                            nodeType: TEXT_NODE,
                            node: null,
                            text: 'bar'
                        }
                    ]
                }
            ]
        });
    });

    it('should support deeply nested components', () => {
        const Foo = () => h('p', 'foo');
        const Bar = () => h('span', h(Foo));
        const Baz = () => h('div', h(Bar), h(Bar));
        
        expect(h(Baz)).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {},
            children: [
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    props: {},
                    children: [
                        {
                            nodeType: ELEMENT_NODE,
                            nodeName: 'p',
                            node: null,
                            props: {},
                            children: [
                                {
                                    nodeType: TEXT_NODE,
                                    node: null,
                                    text: 'foo'
                                }
                            ]
                        }
                    ]
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    props: {},
                    children: [
                        {
                            nodeType: ELEMENT_NODE,
                            nodeName: 'p',
                            node: null,
                            props: {},
                            children: [
                                {
                                    nodeType: TEXT_NODE,
                                    node: null,
                                    text: 'foo'
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    });

    it('should support components that return multiple root virtual elements', () => {
        const Foo = () => [h('div'), h('span'), h('em')];
        
        expect(h('section', h(Foo))).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'section',
            node: null,
            props: {},
            children: [
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'div',
                    node: null,
                    props: {},
                    children: []
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    props: {},
                    children: []
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'em',
                    node: null,
                    props: {},
                    children: []
                }
            ]
        });
    });

    it('should support sibling components that return multiple root virtual elements', () => {
        const Foo = () => [h('div'), h('span'), h('em')];
        const Bar = () => [h('p'), h('h1')];
        
        expect(h('section', h(Foo), h(Bar))).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'section',
            node: null,
            props: {},
            children: [
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'div',
                    node: null,
                    props: {},
                    children: []
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    props: {},
                    children: []
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'em',
                    node: null,
                    props: {},
                    children: []
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'p',
                    node: null,
                    props: {},
                    children: []
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'h1',
                    node: null,
                    props: {},
                    children: []
                }
            ]
        });
    });

    it('should support JSX', () => {
        const title = 'Hello World';
        const content = 'Lorem ipsum dolor sit amet';
        const Component = ({foo, children}) => <div foo={foo}>{children}</div>; // eslint-disable-line no-unused-vars

        expect((
            <div>
                <h1>{title}</h1>
                <section class="content">{content}</section>
                <Component foo="bar"><em>Component Child</em></Component>
                <span />
            </div>
        )).to.deep.equal({
            nodeType: ELEMENT_NODE,
            nodeName: 'div',
            node: null,
            props: {},
            children: [
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'h1',
                    node: null,
                    props: {},
                    children: [
                        {
                            nodeType: TEXT_NODE,
                            node: null,
                            text: 'Hello World'
                        }
                    ]
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'section',
                    node: null,
                    props: {class: 'content'},
                    children: [
                        {
                            nodeType: TEXT_NODE,
                            node: null,
                            text: 'Lorem ipsum dolor sit amet'
                        }
                    ]
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'div',
                    node: null,
                    props: {
                        foo: 'bar'
                    },
                    children: [
                        {
                            nodeType: ELEMENT_NODE,
                            nodeName: 'em',
                            node: null,
                            props: {},
                            children: [
                                {
                                    nodeType: TEXT_NODE,
                                    node: null,
                                    text: 'Component Child'
                                }
                            ]
                        }
                    ]
                },
                {
                    nodeType: ELEMENT_NODE,
                    nodeName: 'span',
                    node: null,
                    props: {},
                    children: []
                }
            ]
        });
    });
});
