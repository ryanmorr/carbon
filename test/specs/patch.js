import { h, patch } from '../../src/velvet';

describe('patch', () => {
    let prevVNode = null;
    const root = document.createElement('div');
    document.body.appendChild(root);

    function render(el, vnode) {
        const rootEl = patch(el, vnode, prevVNode);
        prevVNode = vnode;
        return rootEl;
    }

    function expectHTML(html) {
        expect(root.innerHTML).to.equal(html.replace(/\s{2,}/g, ''));
    }

    function keyedSpans(...elements) {
        return elements.map((element) => <span key={element}>{element}</span>);
    }

    afterEach(() => {
        prevVNode = null;
        root.innerHTML = '';
    });

    after(() => {
        document.body.removeChild(root);
    });

    describe('nodes', () => {
        it('should append child to the root', () => {
            const el = render(root,
                <div></div>
            );

            expectHTML('<div></div>');
            expect(el).to.equal(root.firstChild);
        });

        it('should remove root child', () => {
            render(root,
                <span></span>
            );

            expectHTML('<span></span>');
            
            const el = render(root,
                null
            );

            expectHTML('');
            expect(el).to.equal(null);
        });

        it('should replace the root child', () => {
            render(root,
                <span></span>
            );

            expectHTML('<span></span>');
            
            const el = render(root,
                <div></div>
            );

            expectHTML('<div></div>');
            expect(el).to.equal(root.firstChild);
        });

        it('should append with attributes', () => {
            render(root,
                <div id="foo" class="bar"></div>
            );

            expectHTML('<div id="foo" class="bar"></div>');
        });

        it('should support SVG', () => {
            render(root,
                <svg><circle cx="50" cy="50" r="40" fill="red"></circle></svg>
            );

            expectHTML('<svg><circle cx="50" cy="50" r="40" fill="red"></circle></svg>');

            const svg = root.querySelector('svg');
            expect(svg.nodeType).to.equal(1);
            expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg');
            expect(svg).to.be.instanceof(SVGElement);

            const circle = svg.querySelector('circle');
            expect(circle.nodeType).to.equal(1);
            expect(circle.namespaceURI).to.equal('http://www.w3.org/2000/svg');
            expect(circle).to.be.instanceof(SVGElement);
        });

        it('should render an array of multiple root nodes', () => {
            const elements = render(root, [
                <div></div>,
                <span></span>,
                <em></em>
            ]);

            expectHTML('<div></div><span></span><em></em>');
            expect(elements).to.deep.equal(Array.from(root.childNodes));
        });

        it('should render an array containing a root single node', () => {
            const el = render(root, [
                <div></div>
            ]);

            expectHTML('<div></div>');
            expect(el).to.equal(root.firstChild);
        });

        it('should render an array of multiple mixed-type root nodes', () => {
            const elements = render(root, [
                {type: 3, text: 'foo'},
                <span></span>,
                {type: 3, text: 'bar'}
            ]);

            expectHTML('foo<span></span>bar');
            expect(elements).to.deep.equal(Array.from(root.childNodes));
        });

        it('should remove multiple root nodes with null', () => {
            render(root, [
                <div></div>,
                <span></span>,
                <em></em>
            ]);

            expectHTML('<div></div><span></span><em></em>');

            const el = render(root,
                null
            );

            expectHTML('');
            expect(el).to.equal(null);
        });

        it('should remove multiple root nodes with an empty array', () => {
            render(root, [
                <div></div>,
                <span></span>
            ]);

            expectHTML('<div></div><span></span>');

            const el = render(root,
                null
            );

            expectHTML('');
            expect(el).to.equal(null);
        });

        it('should replace a single root node with multiple root nodes', () => {
            render(root, 
                <div></div>
            );

            expectHTML('<div></div>');

            render(root, [
                <span></span>,
                <em></em>,
                <i></i>
            ]);

            expectHTML('<span></span><em></em><i></i>');
        });

        it('should replace multiple root nodes with a root single node', () => {
            render(root, [
                <span></span>,
                <em></em>,
                <i></i>
            ]);

            expectHTML('<span></span><em></em><i></i>');

            render(root, 
                <div></div>
            );

            expectHTML('<div></div>');
        });

        it('should replace multiple root nodes with greater multiple root nodes', () => {
            render(root, [
                <span></span>,
                <em></em>

            ]);

            expectHTML('<span></span><em></em>');

            render(root, [
                <div></div>,
                <i></i>,
                <section></section>,
                <span></span>
            ]);

            expectHTML('<div></div><i></i><section></section><span></span>');
        });

        it('should replace multiple root nodes with lesser multiple root nodes', () => {
            render(root, [
                <div></div>,
                <i></i>,
                <section></section>,
                <span></span>,
                <article></article>
            ]);

            expectHTML('<div></div><i></i><section></section><span></span><article></article>');

            render(root, [
                <span></span>,
                <em></em>

            ]);

            expectHTML('<span></span><em></em>');
        });

        it('should filter out null and undefined values from an array of root vnodes', () => {
            render(root, [
                <div></div>,
                null,
                <section></section>,
                <span></span>,
                void 0
            ]);

            expectHTML('<div></div><section></section><span></span>');
        });
    });

    describe('attributes', () => {
        it('should add an attribute', () => {
            render(root,
                <div></div>
            );

            expectHTML('<div></div>');

            render(root,
                <div id="foo"></div>
            );

            expectHTML('<div id="foo"></div>');
        });

        it('should remove an attribute', () => {
            render(root,
                <div foo="bar"></div>
            );

            expectHTML('<div foo="bar"></div>');

            render(root,
                <div></div>
            );

            expectHTML('<div></div>');
        });

        it('should remove an attribute if the value assigned is undefined, null, or false', () => {
            render(root,
                <div foo="1" bar="2" baz="3"></div>
            );

            expectHTML('<div foo="1" bar="2" baz="3"></div>');

            render(root,
                <div foo={void 0} bar={null} baz={false}></div>
            );

            expectHTML('<div></div>');
        });

        it('should update an attribute', () => {
            render(root,
                <div foo="bar"></div>
            );

            expectHTML('<div foo="bar"></div>');

            render(root,
                <div foo="baz"></div>
            );

            expectHTML('<div foo="baz"></div>');
        });

        it('should not remove an element if only an attribute is changed', () => {
            const div = render(root,
                <div foo="1" bar="2"></div>
            );

            expectHTML('<div foo="1" bar="2"></div>');

            const div2 = render(root,
                <div foo="1" bar="2" baz="3"></div>,
            );

            expect(div).to.equal(div2);
            expectHTML('<div foo="1" bar="2" baz="3"></div>');
        });

        it('should add CSS styles as a string', () => {
            render(root,
                <div style={'background-color: rgb(20, 20, 20); position: static;'}></div>
            );

            expectHTML('<div style="background-color: rgb(20, 20, 20); position: static;"></div>');
        });

        it('should add CSS styles as a key/value map', () => {
            render(root,
                <div style={{display: 'inline', position: 'absolute'}}></div>
            );

            expectHTML('<div style="display: inline; position: absolute;"></div>');
        });

        it('should support CSS variables', () => {
            render(root,
                <div style={{color: 'var(--color)', '--color': 'red'}}></div>
            );

            const div = root.firstChild;
            expect(div.style.color).to.equal('var(--color)');
            expect(window.getComputedStyle(div).getPropertyValue('color')).to.equal('rgb(255, 0, 0)');
            expect(window.getComputedStyle(div).getPropertyValue('--color')).to.equal('red');
        });

        it('should remove CSS styles', () => {
            render(root,
                <div style={{zIndex: 2, display: 'inline', position: 'absolute'}}></div>
            );

            const div = root.firstChild;
            expect(div.style.zIndex).to.equal('2');
            expect(div.style.display).to.equal('inline');
            expect(div.style.position).to.equal('absolute');

            render(root,
                <div style={{zIndex: 3}}></div>
            );

            expect(div.style.zIndex).to.equal('3');
            expect(div.style.display).to.equal('');
            expect(div.style.position).to.equal('');
        });

        it('should support boolean attributes', () => {
            render(root,
                <div>
                    <input type="radio" checked={true} />
                    <input type="checkbox" checked={false} />
                    <select multiple>
                        <option value="foo" selected={true}>foo</option>
                        <option value="bar" selected={false}>bar</option>
                        <option value="baz" selected={true}>baz</option>
                    </select>
                </div>
            );

            expectHTML(`
                <div>
                    <input type="radio">
                    <input type="checkbox">
                    <select multiple="">
                        <option value="foo">foo</option>
                        <option value="bar">bar</option>
                        <option value="baz">baz</option>
                    </select>
                </div>
            `);

            const radio = root.querySelector('[type=radio]');
            const checkbox = root.querySelector('[type=checkbox]');
            const select = root.querySelector('select');
            const option1 = select.children[0];
            const option2 = select.children[1];
            const option3 = select.children[2];

            expect(radio.checked).to.equal(true);
            expect(checkbox.checked).to.equal(false);
            expect(select.selectedIndex).to.equal(0);
            expect(Array.from(select.selectedOptions)).to.deep.equal([option1, option3]);
            expect(option1.selected).to.equal(true);
            expect(option2.selected).to.equal(false);
            expect(option3.selected).to.equal(true);
        });

        it('should support dynamic properties', () => {
            render(root,
                <input type="text" value="foo" />
            );

            expectHTML(`
                <input type="text">
            `);

            expect(root.firstChild.value).to.equal('foo');

            render(root,
                <input type="text" value="bar" />
            );

            expectHTML(`
                <input type="text">
            `);

            expect(root.firstChild.value).to.equal('bar');
        });

        it('should add an event listener', () => {
            const div = render(root,
                <div></div>
            );

            const callback = () => {};
            const addEventSpy = sinon.spy(div, 'addEventListener');

            render(root,
                <div onclick={callback}></div>
            );

            expect(addEventSpy.called).to.equal(true);
            expect(addEventSpy.calledWith('click', callback)).to.equal(true);
            addEventSpy.restore();
        });

        it('should remove an event listener', () => {
            const callback = () => {};

            const div = render(root,
                <div onclick={callback}></div>,
            );

            const removeEventSpy = sinon.spy(div, 'removeEventListener');

            render(root,
                <div></div>
            );

            expect(removeEventSpy.called).to.equal(true);
            expect(removeEventSpy.calledWith('click', callback)).to.equal(true);
            removeEventSpy.restore();
        });

        it('should support custom events', (done) => {
            let event = new CustomEvent('foo');

            const callback = sinon.spy((e) => {
                expect(e).to.equal(event);
                done();
            });

            const div = render(root,
                <div onfoo={callback}></div>
            );

            div.dispatchEvent(event);
        });

        it('should ignore keys', () => {
            render(root,
                <div key="foo"></div>
            );

            expectHTML('<div></div>');
        });

        it('should patch deeply nested attributes', () => {
            render(root,
                <section>
                    <div>
                        <span foo="1" bar="2"></span>
                    </div>
                </section>
            );

            expectHTML(`
                <section>
                    <div>
                        <span foo="1" bar="2"></span>
                    </div>
                </section>
            `);

            render(root,
                <section>
                    <div qux="4">
                        <span foo="2" baz="3"></span>
                    </div>
                </section>
            );

            expectHTML(`
                <section>
                    <div qux="4">
                        <span foo="2" baz="3"></span>
                    </div>
                </section>
            `);
        });
    });
    
    describe('non-keyed children', () => {
        it('should append nodes', () => {
            render(root, 
                <div><span>Hello</span></div>
            );

            expectHTML('<div><span>Hello</span></div>');

            render(root, 
                <div><span>Hello</span><span>World</span></div>
            );

            expectHTML('<div><span>Hello</span><span>World</span></div>');
        });

        it('should prepend nodes', () => {
            render(root, 
                <div><span>World</span></div>
            );

            expectHTML('<div><span>World</span></div>');

            render(root, 
                <div><span>Hello</span><span>World</span></div>
            );

            expectHTML('<div><span>Hello</span><span>World</span></div>');
        });

        it('should change text nodes', () => {
            render(root, 
                <div><span>foo</span><span>bar</span></div>
            );

            expectHTML('<div><span>foo</span><span>bar</span></div>');

            render(root, 
                <div><span>baz</span><span>qux</span></div>
            );

            expectHTML('<div><span>baz</span><span>qux</span></div>');
        });

        it('should handle numeric nodes', () => {
            render(root,
                <div>{123}</div>
            );

            expectHTML('<div>123</div>');
        });

        it('should handle empty text nodes', () => {
            render(root,
                <div>{''}</div>
            );

            expectHTML('<div></div>');
        });

        it('should replace a text node with an element node', () => {
            render(root,
                <div>foo</div>
            );

            expectHTML('<div>foo</div>');

            render(root,
                <div><span></span></div>
            );

            expectHTML('<div><span></span></div>');
        });

        it('should replace an element node with a text node', () => {
            render(root,
                <div><span></span></div>
            );

            expectHTML('<div><span></span></div>');

            render(root,
                <div>foo</div>
            );

            expectHTML('<div>foo</div>');
        });

        it('should replace an element node with a different element node', () => {
            render(root,
                <div><span></span></div>
            );

            expectHTML('<div><span></span></div>');
            
            render(root,
                <div><em></em></div>
            );

            expectHTML('<div><em></em></div>');
        });

        it('should not render null and undefined children', () => {            
            render(root,
                <div>
                    {null}
                    foo
                    {undefined}
                    bar
                </div>
            );

            expectHTML('<div>foobar</div>');
        });
    });

    describe('keyed children', () => {
        it('should append keyed nodes', () => {
            render(root,
                <div>{keyedSpans('a', 'b')}</div>
            );

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                </div>
            `);

            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
            );

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                </div>
            `);
        });

        it('should prepend keyed nodes', () => {
            render(root,
                <div>{keyedSpans('d', 'e')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const d1 = keyed1[0];
            const e1 = keyed1[1];

            expectHTML(`
                <div>
                    <span>d</span>
                    <span>e</span>
                </div>
            `);

            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd', 'e')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const d2 = keyed2[3];
            const e2 = keyed2[4];

            expect(d1).to.equal(d2);
            expect(e1).to.equal(e2);

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                    <span>e</span>
                </div>
            `);
        });

        it('should add keyed nodes in the middle', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'd', 'e')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const a1 = keyed1[0];
            const b1 = keyed1[1];
            const d1 = keyed1[2];
            const e1 = keyed1[3];

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>d</span>
                    <span>e</span>
                </div>
            `);

            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd', 'e')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const a2 = keyed2[0];
            const b2 = keyed2[1];
            const d2 = keyed2[3];
            const e2 = keyed2[4];

            expect(a1).to.equal(a2);
            expect(b1).to.equal(b2);
            expect(d1).to.equal(d2);
            expect(e1).to.equal(e2);

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                    <span>e</span>
                </div>
            `);
        });

        it('should add keyed nodes at both ends', () => {
            render(root,
                <div>{keyedSpans('b', 'c', 'd')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const b1 = keyed1[0];
            const c1 = keyed1[1];
            const d1 = keyed1[2];

            expectHTML(`
                <div>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                </div>
            `);

            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd', 'e')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const b2 = keyed2[1];
            const c2 = keyed2[2];
            const d2 = keyed2[3];

            expect(b1).to.equal(b2);
            expect(c1).to.equal(c2);
            expect(d1).to.equal(d2);

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                    <span>e</span>
                </div>
            `);
        });

        it('should remove keyed nodes', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
            );

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                </div>
            `);

            render(root,
                <div></div>
            );

            expectHTML(`
                <div></div>
            `);
        });

        it('should remove keyed nodes from the beginning', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const c1 = keyed1[2];
            const d1 = keyed1[3];

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                </div>
            `);

            render(root,
                <div>{keyedSpans('c', 'd')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const c2 = keyed2[0];
            const d2 = keyed2[1];

            expect(c1).to.equal(c2);
            expect(d1).to.equal(d2);

            expectHTML(`
                <div>
                    <span>c</span>
                    <span>d</span>
                </div>
            `);
        });

        it('should remove keyed nodes from the middle', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd', 'e')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const a1 = keyed1[0];
            const b1 = keyed1[1];
            const d1 = keyed1[3];
            const e1 = keyed1[4];

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                    <span>e</span>
                </div>
            `);

            render(root,
                <div>{keyedSpans('a', 'b', 'd', 'e')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const a2 = keyed2[0];
            const b2 = keyed2[1];
            const d2 = keyed2[2];
            const e2 = keyed2[3];

            expect(a1).to.equal(a2);
            expect(b1).to.equal(b2);
            expect(d1).to.equal(d2);
            expect(e1).to.equal(e2);

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>d</span>
                    <span>e</span>
                </div>
            `);
        });

        it('should remove keyed nodes at both ends', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd', 'e')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const b1 = keyed1[1];
            const c1 = keyed1[2];
            const d1 = keyed1[3];

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                    <span>e</span>
                </div>
            `);
            
            render(root,
                <div>{keyedSpans('b', 'c', 'd')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const b2 = keyed2[0];
            const c2 = keyed2[1];
            const d2 = keyed2[2];

            expect(b1).to.equal(b2);
            expect(c1).to.equal(c2);
            expect(d1).to.equal(d2);

            expectHTML(`
                <div>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                </div>
            `);
        });

        it('should move keyed nodes forward', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const a1 = keyed1[0];
            const b1 = keyed1[1];
            const c1 = keyed1[2];
            const d1 = keyed1[3];

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                </div>
            `);
            
            render(root,
                <div>{keyedSpans('b', 'c', 'a', 'd')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const a2 = keyed2[2];
            const b2 = keyed2[0];
            const c2 = keyed2[1];
            const d2 = keyed2[3];

            expect(a1).to.equal(a2);
            expect(b1).to.equal(b2);
            expect(c1).to.equal(c2);
            expect(d1).to.equal(d2);

            expectHTML(`
                <div>
                    <span>b</span>
                    <span>c</span>
                    <span>a</span>
                    <span>d</span>
                </div>
            `);
        });

        it('should move keyed nodes to the end', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const a1 = keyed1[0];
            const b1 = keyed1[1];
            const c1 = keyed1[2];
            const d1 = keyed1[3];

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                </div>
            `);
            
            render(root,
                <div>{keyedSpans('b', 'c', 'd', 'a')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const a2 = keyed2[3];
            const b2 = keyed2[0];
            const c2 = keyed2[1];
            const d2 = keyed2[2];

            expect(a1).to.equal(a2);
            expect(b1).to.equal(b2);
            expect(c1).to.equal(c2);
            expect(d1).to.equal(d2);

            expectHTML(`
                <div>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                    <span>a</span>
                </div>
            `);
        });

        it('should move keyed nodes backwards', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const a1 = keyed1[0];
            const b1 = keyed1[1];
            const c1 = keyed1[2];
            const d1 = keyed1[3];

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                </div>
            `);
            
            render(root,
                <div>{keyedSpans('a', 'd', 'b', 'c')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const a2 = keyed2[0];
            const b2 = keyed2[2];
            const c2 = keyed2[3];
            const d2 = keyed2[1];

            expect(a1).to.equal(a2);
            expect(b1).to.equal(b2);
            expect(c1).to.equal(c2);
            expect(d1).to.equal(d2);

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>d</span>
                    <span>b</span>
                    <span>c</span>
                </div>
            `);
        });

        it('should move keyed nodes to the beginning', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const a1 = keyed1[0];
            const b1 = keyed1[1];
            const c1 = keyed1[2];
            const d1 = keyed1[3];

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                </div>
            `);
            
            render(root,
                <div>{keyedSpans('d', 'a', 'b', 'c')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const a2 = keyed2[1];
            const b2 = keyed2[2];
            const c2 = keyed2[3];
            const d2 = keyed2[0];

            expect(a1).to.equal(a2);
            expect(b1).to.equal(b2);
            expect(c1).to.equal(c2);
            expect(d1).to.equal(d2);

            expectHTML(`
                <div>
                    <span>d</span>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                </div>
            `);
        });

        it('should swap the first and last keyed nodes', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const a1 = keyed1[0];
            const b1 = keyed1[1];
            const c1 = keyed1[2];
            const d1 = keyed1[3];

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                </div>
            `);
            
            render(root,
                <div>{keyedSpans('d', 'b', 'c', 'a')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const a2 = keyed2[3];
            const b2 = keyed2[1];
            const c2 = keyed2[2];
            const d2 = keyed2[0];

            expect(a1).to.equal(a2);
            expect(b1).to.equal(b2);
            expect(c1).to.equal(c2);
            expect(d1).to.equal(d2);

            expectHTML(`
                <div>
                    <span>d</span>
                    <span>b</span>
                    <span>c</span>
                    <span>a</span>
                </div>
            `);
        });

        it('should reverse the order of keyed nodes', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd', 'e', 'f', 'g')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const a1 = keyed1[0];
            const b1 = keyed1[1];
            const c1 = keyed1[2];
            const d1 = keyed1[3];
            const e1 = keyed1[4];
            const f1 = keyed1[5];
            const g1 = keyed1[6];

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                    <span>e</span>
                    <span>f</span>
                    <span>g</span>
                </div>
            `);
            
            render(root,
                <div>{keyedSpans('g', 'f', 'e', 'd', 'c', 'b', 'a')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const a2 = keyed2[6];
            const b2 = keyed2[5];
            const c2 = keyed2[4];
            const d2 = keyed2[3];
            const e2 = keyed2[2];
            const f2 = keyed2[1];
            const g2 = keyed2[0];

            expect(a1).to.equal(a2);
            expect(b1).to.equal(b2);
            expect(c1).to.equal(c2);
            expect(d1).to.equal(d2);
            expect(e1).to.equal(e2);
            expect(f1).to.equal(f2);
            expect(g1).to.equal(g2);

            expectHTML(`
                <div>
                    <span>g</span>
                    <span>f</span>
                    <span>e</span>
                    <span>d</span>
                    <span>c</span>
                    <span>b</span>
                    <span>a</span>
                </div>
            `);
        });

        it('should support reordering, addition, and removal of keyed nodes', () => {
            render(root,
                <div>{keyedSpans('a', 'b', 'c', 'd', 'e', 'f', 'g')}</div>
            );

            const keyed1 = Array.from(root.getElementsByTagName('span'));
            const a1 = keyed1[0];
            const c1 = keyed1[2];
            const d1 = keyed1[3];
            const f1 = keyed1[5];

            expectHTML(`
                <div>
                    <span>a</span>
                    <span>b</span>
                    <span>c</span>
                    <span>d</span>
                    <span>e</span>
                    <span>f</span>
                    <span>g</span>
                </div>
            `);
            
            render(root,
                <div>{keyedSpans('c', 'j', 'a', 'i', 'f', 'd', 'h')}</div>
            );

            const keyed2 = Array.from(root.getElementsByTagName('span'));
            const a2 = keyed2[2];
            const c2 = keyed2[0];
            const d2 = keyed2[5];
            const f2 = keyed2[4];

            expect(a1).to.equal(a2);
            expect(c1).to.equal(c2);
            expect(d1).to.equal(d2);
            expect(f1).to.equal(f2);

            expectHTML(`
                <div>
                    <span>c</span>
                    <span>j</span>
                    <span>a</span>
                    <span>i</span>
                    <span>f</span>
                    <span>d</span>
                    <span>h</span>
                </div>
            `);
        });

        it('should support reordering, addition, and removal of mixed keyed/non-keyed nodes', () => {
            render(root,
                <section>
                    <div key="a"></div>
                    <span></span>
                    <div key="b"></div>
                    <span></span>
                    <div key="c"></div>
                    <span></span>
                    <span></span>
                    <div key="d"></div>
                    <div key="e"></div>
                </section>
            );

            expectHTML(`
                <section>
                    <div></div>
                    <span></span>
                    <div></div>
                    <span></span>
                    <div></div>
                    <span></span>
                    <span></span>
                    <div></div>
                    <div></div>
                </section>
            `);

            const keyed1 = Array.from(root.getElementsByTagName('div'));
            const a1 = keyed1[0];
            const b1 = keyed1[1];
            const d1 = keyed1[3];

            render(root,
                <section>
                    <span></span>
                    <div key="d"></div>
                    <span></span>
                    <div key="f"></div>
                    <span></span>
                    <div key="a"></div>
                    <div key="b"></div>
                    <em></em>
                    <span></span>
                    <div key="g"></div>
                </section>
            );

            const keyed2 = Array.from(root.getElementsByTagName('div'));
            const a2 = keyed2[2];
            const b2 = keyed2[3];
            const d2 = keyed2[0];

            expect(a1).to.equal(a2);
            expect(b1).to.equal(b2);
            expect(d1).to.equal(d2);

            expectHTML(`
                <section>
                    <span></span>
                    <div></div>
                    <span></span>
                    <div></div>
                    <span></span>
                    <div></div>
                    <div></div>
                    <em></em>
                    <span></span>
                    <div></div>
                </section>
            `);
        });

        it('should support root keyed nodes', () => {
            render(root, [
                <div key="a"></div>,
                <div key="b"></div>,
                <span></span>,
                <div key="c"></div>,
                <span></span>,
                <span></span>,
                <div key="d"></div>
            ]);

            expectHTML(`
                <div></div>
                <div></div>
                <span></span>
                <div></div>
                <span></span>
                <span></span>
                <div></div>
            `);

            const keyed1 = Array.from(root.getElementsByTagName('div'));
            const a1 = keyed1[0];
            const c1 = keyed1[2];
            const d1 = keyed1[3];

            render(root, [
                <span></span>,
                <div key="c"></div>,
                <span></span>,
                <div key="d"></div>,
                <div key="a"></div>,
                <span></span>,
                <em></em>
            ]);

            const keyed2 = Array.from(root.getElementsByTagName('div'));
            const a2 = keyed2[2];
            const c2 = keyed2[0];
            const d2 = keyed2[1];

            expect(a1).to.equal(a2);
            expect(c1).to.equal(c2);
            expect(d1).to.equal(d2);

            expectHTML(`
                <span></span>
                <div></div>
                <span></span>
                <div></div>
                <div></div>
                <span></span>
                <em></em>
            `);
        });
    });
});
