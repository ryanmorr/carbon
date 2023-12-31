import { h } from '../../src/carbon';

describe('h', () => {
    const TEXT_NODE = 3;
    const ELEMENT_NODE = 1;
    
    it('should create a virtual element', () => {
        const vnode = h('div');

        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: []
        });
    });

    it('should create a virtual element with attributes', () => {
        const vnode = h('div', {
            id: 'foo', 
            class: 'bar'
        });

        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {id: 'foo', class: 'bar'},
            children: []
        });
    });

    it('should create a virtual element with a single text child', () => {
        const vnode = h('div', null, 'foo');

        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: TEXT_NODE,
                    node: null,
                    text: 'foo'
                }
            ]
        });
    });

    it('should convert a numeric text node into a string', () => {
        const vnode = h('div', null, 123);

        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: TEXT_NODE,
                    node: null,
                    text: '123'
                }
            ]
        });
    });

    it('should create a virtual element with a single element child', () => {
        const vnode = h('div', null, h('span'));
        
        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    tag: 'span',
                    node: null,
                    key: null,
                    props: {},
                    children: [],
                }
            ]
        });
    });

    it('should create a virtual element with multiple children', () => {
        const vnode = h('div', null, 
            h('i'), 
            'foo', 
            h('em')
        );

        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    tag: 'i',
                    node: null,
                    key: null,
                    props: {},
                    children: [],
                },
                {
                    type: TEXT_NODE,
                    node: null,
                    text: 'foo'
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'em',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                }
            ]
        });
    });

    it('should accept an array as children', () => {
        const vnode = h('div', null, [
            h('i'),
            h('em'),
            h('span')
        ]);

        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    tag: 'i',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'em',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'span',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                }
            ]
        });
    });

    it('should support multiple levels of nested sub-arrays of children', () => {
        const vnode = h('div',
            h('h1'),
            [
                h('em', {foo: 'bar'}, 'abc'), 
                [
                    h('i'), 
                    [
                        [
                            h('span', null)
                        ]
                    ], 
                    h('p', undefined, 123)
                ]
            ],
            [
                h('section', {id: 'abc'})
            ]
        );

        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    tag: 'h1',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'em',
                    node: null,
                    key: null,
                    props: {
                        foo: 'bar'
                    },
                    children: [
                        {
                            type: TEXT_NODE,
                            node: null,
                            text: 'abc'
                        }
                    ]
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'i',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'span',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'p',
                    node: null,
                    key: null,
                    props: {},
                    children: [
                        {
                            type: TEXT_NODE,
                            node: null,
                            text: '123'
                        }
                    ]
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'section',
                    node: null,
                    key: null,
                    props: {
                        id: 'abc'
                    },
                    children: []
                }
            ]
        });
    });

    it('should allow skipping attribute definition', () => {
        const vnode = h('div', 
            h('span', 'foo'), 
            h('em', 
                [
                    'bar',
                    'baz',
                    'qux'
                ]
            )
        );

        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    tag: 'span',
                    node: null,
                    key: null,
                    props: {},
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
                    tag: 'em',
                    node: null,
                    key: null,
                    props: {},
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
        const vnode = h('div', {
            key: 'foo'
        });

        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: 'foo',
            props: {key: 'foo'},
            children: []
        });
    });

    it('should remove null, undefined, and boolean children', () => {
        const vnode = h('div', {}, [
            null,
            'foo',
            undefined,
            'bar',
            true,
            'baz',
            false
        ]);

        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
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
                },
                {
                    type: TEXT_NODE,
                    node: null,
                    text: 'baz'
                }
            ]
        });
    });

    it('should support stateless functional components', () => {
        const Component = () => h('div');

        const vnode = h(Component);
        
        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: []
        });
    });

    it('should provide properties as a parameter to components', () => {
        const Component = (props) => h('div', props);

        const vnode = h(Component, {
            foo: 'bar'
        });
        
        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {
                foo: 'bar',
                children: []
            },
            children: []
        });
    });

    it('should provide children as a property to components', () => {
        const Component = ({children}) => h('div', children);

        const vnode = h(Component, 'foo');
        
        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: TEXT_NODE,
                    node: null,
                    text: 'foo'
                }
            ]
        });
    });

    it('should support sibling components', () => {
        const Foo = () => h('div', 'foo');
        const Bar = () => h('span', {class: 'abc'}, 'bar');

        const vnode = h('section', [
            h(Foo),
            h(Bar)
        ]);
        
        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'section',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    tag: 'div',
                    node: null,
                    key: null,
                    props: {},
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
                    tag: 'span',
                    node: null,
                    key: null,
                    props: {
                        class: 'abc'
                    },
                    children: [
                        {
                            type: TEXT_NODE,
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

        const vnode = h(Baz);
        
        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    tag: 'span',
                    node: null,
                    key: null,
                    props: {},
                    children: [
                        {
                            type: ELEMENT_NODE,
                            tag: 'p',
                            node: null,
                            key: null,
                            props: {},
                            children: [
                                {
                                    type: TEXT_NODE,
                                    node: null,
                                    text: 'foo'
                                }
                            ]
                        }
                    ]
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'span',
                    node: null,
                    key: null,
                    props: {},
                    children: [
                        {
                            type: ELEMENT_NODE,
                            tag: 'p',
                            node: null,
                            key: null,
                            props: {},
                            children: [
                                {
                                    type: TEXT_NODE,
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
        const Foo = () => [
            h('div'),
            h('span'),
            h('em')
        ];

        const vnode = h('section', h(Foo));
        
        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'section',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    tag: 'div',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'span',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'em',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                }
            ]
        });
    });

    it('should support sibling components that return multiple root virtual elements', () => {
        const Foo = () => [
            h('div'),
            h('span'),
            h('em')
        ];

        const Bar = () => [
            h('p'), 
            h('h1')
        ];

        const vnode = h('section',
            h(Foo),
            h(Bar)
        );
        
        expect(vnode).to.deep.equal({
            type: ELEMENT_NODE,
            tag: 'section',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    tag: 'div',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'span',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'em',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'p',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'h1',
                    node: null,
                    key: null,
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
            type: ELEMENT_NODE,
            tag: 'div',
            node: null,
            key: null,
            props: {},
            children: [
                {
                    type: ELEMENT_NODE,
                    tag: 'h1',
                    node: null,
                    key: null,
                    props: {},
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
                    tag: 'section',
                    node: null,
                    key: null,
                    props: {class: 'content'},
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
                    tag: 'div',
                    node: null,
                    key: null,
                    props: {
                        foo: 'bar'
                    },
                    children: [
                        {
                            type: ELEMENT_NODE,
                            tag: 'em',
                            node: null,
                            key: null,
                            props: {},
                            children: [
                                {
                                    type: TEXT_NODE,
                                    node: null,
                                    text: 'Component Child'
                                }
                            ]
                        }
                    ]
                },
                {
                    type: ELEMENT_NODE,
                    tag: 'span',
                    node: null,
                    key: null,
                    props: {},
                    children: []
                }
            ]
        });
    });
});
