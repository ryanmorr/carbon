import { html, render } from '../../src/velvet';

describe('render', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    function compact(html) {
        return html.replace(/\s{2,}/g, '');
    }

    function setHTML(html) {
        root.innerHTML = compact(html);
    }

    function expectHTML(html) {
        expect(root.innerHTML).to.equal(compact(html));
    }

    function keyedSpans(...elements) {
        return elements.map((element) => <span key={element}>{element}</span>);
    }

    afterEach(() => {
        root.innerHTML = '';
        root._prevVNode = null;
    });

    after(() => {
        document.body.removeChild(root);
    });

    describe('nodes', () => {
        it('should append to an empty root', () => {
            const el = render(root,
                <div></div>
            );

            expectHTML('<div></div>');
            expect(el).to.equal(root.firstChild);
        });

        it('should remove all root children', () => {
            setHTML('<span></span>');
            
            const el = render(root, null);

            expectHTML('');
            expect(el).to.equal(null);
        });

        it('should replace the first element', () => {
            setHTML('<span></span>');
            
            const el = render(root,
                <div></div>
            );

            expectHTML('<div></div>');
            expect(el).to.equal(root.firstChild);
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

        it('should support refs', () => {
            const { foo, bar, baz, qux } = render(root,
                <div ref="foo">
                    <span ref="bar"></span>
                    <em ref="baz"></em>
                    <section>
                        <i ref="qux"></i>
                    </section>
                </div>
            );

            expectHTML(`
                <div>
                    <span></span>
                    <em></em>
                    <section>
                        <i></i>
                    </section>
                </div>
            `);

            expect(foo).to.equal(root.querySelector('div'));
            expect(bar).to.equal(root.querySelector('span'));
            expect(baz).to.equal(root.querySelector('em'));
            expect(qux).to.equal(root.querySelector('i'));
        });

        it('should skip equal vnodes', () => {
            setHTML('');

            const vnode = <div></div>;

            render(root,
                vnode
            );

            expectHTML('<div></div>');

            vnode.nodeName = 'span';

            render(root,
                vnode
            );

            expectHTML('<div></div>');
        });
    });

    describe('attributes', () => {
        it('should add an attribute', () => {
            setHTML('<div></div>');

            render(root,
                <div id="foo"></div>
            );

            expectHTML('<div id="foo"></div>');
        });

        it('should remove an attribute', () => {
            setHTML('<div foo="bar"></div>');

            render(root,
                <div></div>
            );

            expectHTML('<div></div>');
        });

        it('should remove an attribute if the value assigned is undefined, null, or false', () => {
            setHTML('<div foo="1" bar="2" baz="3"></div>');

            render(root,
                <div foo={void 0} bar={null} baz={false}></div>
            );

            expectHTML('<div></div>');
        });

        it('should update an attribute', () => {
            setHTML('<div foo="bar"></div>');

            render(root,
                <div foo="baz"></div>
            );

            expectHTML('<div foo="baz"></div>');
        });

        it('should not remove an element if only an attribute is changed', () => {
            setHTML('<div foo="1" bar="2"></div>');
            const div = root.firstChild;

            render(root,
                <div foo="1" bar="2" baz="3"></div>
            );

            expect(root.children[0]).to.equal(div);
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
            const div = root.appendChild(document.createElement('div'));

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
            const div = root.appendChild(document.createElement('div'));

            const callback = () => {};
            const removeEventSpy = sinon.spy(div, 'removeEventListener');

            render(root,
                <div onclick={callback}></div>
            );

            render(root,
                <div></div>
            );

            expect(removeEventSpy.called).to.equal(true);
            expect(removeEventSpy.calledWith('click', callback)).to.equal(true);
            removeEventSpy.restore();
        });

        it('should ignore keys', () => {
            render(root,
                <div key="foo"></div>
            );

            expectHTML('<div></div>');
        });

        it('should patch deeply nested attributes', () => {
            setHTML(`
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
            setHTML('<div><span>Hello</span></div>');

            render(root, 
                <div><span>Hello</span><span>World</span></div>
            );

            expectHTML('<div><span>Hello</span><span>World</span></div>');
        });

        it('should prepend nodes', () => {            
            setHTML('<div><span>World</span></div>');

            render(root, 
                <div><span>Hello</span><span>World</span></div>
            );

            expectHTML('<div><span>Hello</span><span>World</span></div>');
        });

        it('should change text nodes', () => {            
            setHTML('<div><span>foo</span><span>bar</span></div>');

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
            setHTML('<div>foo</div>');

            render(root,
                <div><span></span></div>
            );

            expectHTML('<div><span></span></div>');
        });

        it('should replace an element node with a text node', () => {
            setHTML('<div><span></span></div>');

            render(root,
                <div>foo</div>
            );

            expectHTML('<div>foo</div>');
        });

        it('should replace an element node with a different element node', () => {
            setHTML('<div><span></span></div>');
            
            render(root,
                <div><em></em></div>
            );

            expectHTML('<div><em></em></div>');
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
    });
});
