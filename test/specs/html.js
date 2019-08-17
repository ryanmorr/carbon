import { html } from '../../src/velvet';

describe('html', () => {
    describe('hyperscript', () => {
        it('should create a virtual element', () => {
            expect(html('div')).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [],
                key: null,
                node: null
            });
        });

        it('should create a virtual element with attributes', () => {
            expect(html('div', {id: 'foo', class: 'bar'})).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {id: 'foo', class: 'bar'},
                children: [],
                key: null,
                node: null
            });
        });

        it('should create a virtual element with a single text child', () => {
            expect(html('div', null, 'foo')).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    }
                ],
                key: null,
                node: null
            });
        });

        it('should create a virtual element with a single element child', () => {
            expect(html('div', null, html('span'))).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'element',
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
            expect(html('div', null, html('i'), 'foo', html('em'))).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'element',
                        nodeName: 'i',
                        attributes: {},
                        children: [],
                        key: null,
                        node: null
                    },
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    },
                    {
                        type: 'element',
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
            expect(html('div', null, [html('i'), html('em')], html('span'))).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'element',
                        nodeName: 'i',
                        attributes: {},
                        children: [],
                        key: null,
                        node: null
                    },
                    {
                        type: 'element',
                        nodeName: 'em',
                        attributes: {},
                        children: [],
                        key: null,
                        node: null
                    },
                    {
                        type: 'element',
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
            expect(html('div', {key: 'foo'})).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {key: 'foo'},
                children: [],
                key: 'foo',
                node: null
            });
        });

        it('should support functional components', () => {
            const Component = sinon.spy((attributes, child) => html('div', attributes, child));

            expect(html(Component, {foo: 1, bar: 2, baz: 3}, 'foo')).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: 1, bar: 2, baz: 3},
                children: [
                    {
                        type: 'text',
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
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'element',
                        nodeName: 'h1',
                        attributes: {},
                        children: [
                            {
                                type: 'text',
                                text: 'Hello World',
                                node: null
                            }
                        ],
                        key: null,
                        node: null
                    },
                    {
                        type: 'element',
                        nodeName: 'section',
                        attributes: {class: 'content'},
                        children: [
                            {
                                type: 'text',
                                text: 'Lorem ipsum dolor sit amet',
                                node: null
                            }
                        ],
                        key: null,
                        node: null
                    },
                    {
                        type: 'element',
                        nodeName: 'div',
                        attributes: {id: '1', class: '2'},
                        children: [
                            {
                                type: 'element',
                                nodeName: 'div',
                                attributes: {key: 'foo'},
                                children: [
                                    {
                                        type: 'text',
                                        text: 'foo',
                                        node: null
                                    }
                                ],
                                key: 'foo',
                                node: null
                            },
                            {
                                type: 'element',
                                nodeName: 'div',
                                attributes: {key: 'bar'},
                                children: [
                                    {
                                        type: 'text',
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

    describe('tagged template', () => {
        it('should return undefined for empty string', () => {
            expect(html``).to.equal(undefined);
        });
        
        it('should support single named elements', () => {
            expect(html`<div />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [],
                key: null,
                node: null
            });

            expect(html`<div/>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support closing tags', () => {
            expect(html`<div></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support auto-closing tags', () => {
            expect(html`<div><//>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support multiple root elements', () => {
                expect(html`<div /><span></span><em><//>`).to.deep.equal([
                {
                    type: 'element',
                    nodeName: 'div',
                    attributes: {},
                    children: [],
                    key: null,
                    node: null
                },
                {
                    type: 'element',
                    nodeName: 'span',
                    attributes: {},
                    children: [],
                    key: null,
                    node: null
                },
                {
                    type: 'element',
                    nodeName: 'em',
                    attributes: {},
                    children: [],
                    key: null,
                    node: null
                }
            ]);
        });

        it('should support dynamic tag names', () => {
            expect(html`<${'foo'} />`).to.deep.equal({
                type: 'element',
                nodeName: 'foo',
                attributes: {},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support a boolean attribute', () => {
            expect(html`<div foo />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: true},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support multiple boolean attributes', () => {
            expect(html`<div foo bar />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: true, bar: true},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support an attribute with an empty value', () => {
            expect(html`<div foo="" />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: ''},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support multiple attributes with empty values', () => {
            expect(html`<div foo="" bar="" />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: '', bar: ''},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support an attribute with a static value', () => {
            expect(html`<div foo="bar" />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: 'bar'},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support an attribute with a static value followed by a boolean attribute', () => {
            expect(html`<div foo="bar" baz />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: 'bar', baz: true},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support multiple attributes with a static value', () => {
            expect(html`<div foo="bar" baz="qux" />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: 'bar', baz: 'qux'},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support an attribute with a dyanmic value', () => {
            expect(html`<div foo=${'bar'} />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: 'bar'},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support multiple attributes with a dynamic value', () => {
            function onClick() {}

            expect(html`<div foo=${'bar'} onClick=${onClick} />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: 'bar', onClick: onClick},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support an attribute with a quoted dynamic value', () => {
            expect(html`<div foo="${'bar'}" />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: 'bar'},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support an attribute with a quoted dyanmic value that ignores static parts', () => {
            expect(html`<div foo="before${'bar'}after" />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: 'bar'},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support hyphens in attribute names', () => {
            expect(html`<div foo-bar />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {'foo-bar': true},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support NUL characters in attribute values', () => {
            expect(html`<div foo="\0" />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: '\0'},
                children: [],
                key: null,
                node: null
            });

            expect(html`<div foo="\0" bar baz=${'qux'} />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: '\0', bar: true, baz: 'qux'},
                children: [],
                key: null,
                node: null
            });
        });

        it('should support keys', () => {
            expect(html`<div key="foo"></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {key: 'foo'},
                children: [],
                key: 'foo',
                node: null
            });
        });

        it('should support spread attributes', () => {
            expect(html`<div ...${{ foo: 'bar' }} />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: 'bar'},
                children: [],
                key: null,
                node: null
            });

            expect(html`<div a ...${{ foo: 'bar' }} />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {a: true, foo: 'bar'},
                children: [],
                key: null,
                node: null
            });

            expect(html`<div a b ...${{ foo: 'bar' }} />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {a: true, b: true, foo: 'bar'},
                children: [],
                key: null,
                node: null
            });

            expect(html`<div ...${{ foo: 'bar' }} a />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {a: true, foo: 'bar'},
                children: [],
                key: null,
                node: null
            });

            expect(html`<div ...${{ foo: 'bar' }} a b />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {a: true, b: true, foo: 'bar'},
                children: [],
                key: null,
                node: null
            });

            expect(html`<div a="1" ...${{ foo: 'bar' }} />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {a: '1', foo: 'bar'},
                children: [],
                key: null,
                node: null
            });

            expect(html`<div a="1"><span b="2" ...${{ c: 'bar' }}/></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {a: '1'},
                children: [
                    {
                        type: 'element',
                        nodeName: 'span',
                        attributes: {b: '2', c: 'bar'},
                        children: [],
                        key: null,
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div a=${1} ...${{ b: 2 }}>c: ${3}</div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {a: 1, b: 2},
                children: [
                    {
                        type: 'text',
                        text: 'c: ',
                        node: null
                    },
                    {
                        type: 'text',
                        text: 3,
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div ...${{ c: 'bar' }}><span ...${{ d: 'baz' }}/></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {c: 'bar'},
                children: [
                    {
                        type: 'element',
                        nodeName: 'span',
                        attributes: {d: 'baz'},
                        children: [],
                        key: null,
                        node: null
                    }
                ],
                key: null,
                node: null
            });
        });

        it('should support multiple spread attributes in one element', () => {
            expect(html`<div ...${{ foo: 'bar' }} ...${{ baz: 'qux' }} />`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: 'bar', baz: 'qux'},
                children: [],
                key: null,
                node: null
            });
        });

        it('should not mutate the spread variables', () => {
            const obj = {};
            html`<div ...${obj} foo="bar" />`;
            expect(obj).to.deep.equal({});
        });

        it('should support a text child', () => {
            expect(html`<div>foo</div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div>foo bar</div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: 'foo bar',
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div>foo "<span /></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {   
                        type: 'text',
                        text: 'foo "',
                        node: null
                    },
                    {
                        type: 'element',
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

        it('should support NUL characters in text children', () => {
            expect(html`<div>\0</div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: '\0',
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div>\0${'foo'}</div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: '\0',
                        node: null
                    },
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    }
                ],
                key: null,
                node: null
            });
        });

        it('should support an element child', () => {
            expect(html`<div><span /></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'element',
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

            expect(html`<div><span></span></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'element',
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

        it('should support multiple element children', () => {
            expect(html`<div><span /><em /><a></a></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'element',
                        nodeName: 'span',
                        attributes: {},
                        children: [],
                        key: null,
                        node: null
                    },
                    {
                        type: 'element',
                        nodeName: 'em',
                        attributes: {},
                        children: [],
                        key: null,
                        node: null
                    },
                    {
                        type: 'element',
                        nodeName: 'a',
                        attributes: {},
                        children: [],
                        key: null,
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div a><span b /><em c /></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {a: true},
                children: [
                    {
                        type: 'element',
                        nodeName: 'span',
                        attributes: {b: true},
                        children: [],
                        key: null,
                        node: null
                    },
                    {
                        type: 'element',
                        nodeName: 'em',
                        attributes: {c: true},
                        children: [],
                        key: null,
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div x=1><span y=2 /><em z=3 /></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {x: '1'},
                children: [
                    {
                        type: 'element',
                        nodeName: 'span',
                        attributes: {y: '2'},
                        children: [],
                        key: null,
                        node: null
                    },
                    {
                        type: 'element',
                        nodeName: 'em',
                        attributes: {z: '3'},
                        children: [],
                        key: null,
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div x=${1}><span y=${2} /><em z=${3} /></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {x: 1},
                children: [
                    {
                        type: 'element',
                        nodeName: 'span',
                        attributes: {y: 2},
                        children: [],
                        key: null,
                        node: null
                    },
                    {
                        type: 'element',
                        nodeName: 'em',
                        attributes: {z: 3},
                        children: [],
                        key: null,
                        node: null
                    }
                ],
                key: null,
                node: null
            });
        });

        it('should support a dynamic child', () => {
            expect(html`<div>${'foo'}</div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    }
                ],
                key: null,
                node: null
            });
        });

        it('should support mixed type children', () => {
            expect(html`<div>${'foo'}bar</div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    },
                    {
                        type: 'text',
                        text: 'bar',
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div>before${'foo'}after</div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: 'before',
                        node: null
                    },
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    },
                    {
                        type: 'text',
                        text: 'after',
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div>foo<span /></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    },
                    {
                        type: 'element',
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

            expect(html`<div><span />foo</div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'element',
                        nodeName: 'span',
                        attributes: {},
                        children: [],
                        key: null,
                        node: null
                    },
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div>foo<span />bar</div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    },
                    {
                        type: 'element',
                        nodeName: 'span',
                        attributes: {},
                        children: [],
                        key: null,
                        node: null
                    },
                    {
                        type: 'text',
                        text: 'bar',
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`<div>foo<span a="b" /></div>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    },
                    {
                        type: 'element',
                        nodeName: 'span',
                        attributes: {a: 'b'},
                        children: [],
                        key: null,
                        node: null
                    }
                ],
                key: null,
                node: null
            });

            expect(html`
                <div>
                    before
                    ${'foo'}
                    <span />
                    ${'bar'}
                    after
                </div>
            `).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {},
                children: [
                    {
                        type: 'text',
                        text: 'before',
                        node: null
                    },
                    {
                        type: 'text',
                        text: 'foo',
                        node: null
                    },
                    {
                        type: 'element',
                        nodeName: 'span',
                        attributes: {},
                        children: [],
                        key: null,
                        node: null
                    },
                    {
                        type: 'text',
                        text: 'bar',
                        node: null
                    },
                    {
                        type: 'text',
                        text: 'after',
                        node: null
                    }
                ],
                key: null,
                node: null
            });
        });

        it('should support functional components', () => {
            const Component = sinon.spy((attributes, children) => html`<div ...${attributes}>${children[0]}</div>`);

            expect(html`<${Component} foo=${1} bar=${2}, baz=${3}>foo</${Component}>`).to.deep.equal({
                type: 'element',
                nodeName: 'div',
                attributes: {foo: 1, bar: 2, baz: 3},
                children: [
                    {
                        type: 'text',
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
    });

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
});
