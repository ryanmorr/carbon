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

    afterEach(() => {
        root.innerHTML = '';
    });

    after(() => {
        document.body.removeChild(root);
    });

    it('should patch a text node', () => {
        setHTML('foo');

        render(root,
            'bar',
            'foo'
        );

        expectHTML('bar');
    });

    it('should convert numbers to text nodes', () => {
        render(root,
            123
        );

        expect(root.innerHTML).to.equal('123');
    });

    it('should replace an element', () => {
        setHTML('<span></span>');

        render(root,
            <div></div>,
            <span></span>
        );

        expectHTML('<div></div>');
    });

    it('should add an attribute', () => {
        setHTML('<div></div>');

        render(root,
            <div id="foo"></div>,
            <div></div>
        );

        expectHTML('<div id="foo"></div>');
    });

    it('should remove an attribute', () => {
        setHTML('<div foo="bar"></div>');

        render(root,
            <div></div>,
            <div foo="bar"></div>
        );

        expectHTML('<div></div>');
    });

    it('should remove an attribute if the value assigned is undefined, null, or false', () => {
        setHTML('<div foo="1" bar="2" baz="3"></div>');

        render(root,
            <div foo={void 0} bar={null} baz={false}></div>,
            <div foo="1" bar="2" baz="3"></div>
        );

        expectHTML('<div></div>');
    });

    it('should update an attribute', () => {
        setHTML('<div foo="bar"></div>');

        render(root,
            <div foo="baz"></div>,
            <div foo="bar"></div>
        );

        expectHTML('<div foo="baz"></div>');
    });

    it('should not remove an element if only an attribute is changed', () => {
        setHTML('<div foo="1" bar="2"></div>');
        const div = root.firstChild;

        render(root,
            <div foo="1" bar="2" baz="3"></div>,
            <div foo="1" bar="2"></div>
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
            <div style={{zIndex: 3}}></div>,
            <div style={{zIndex: 2, display: 'inline', position: 'absolute'}}></div>
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

    it('should add an event listener', () => {
        const div = root.appendChild(document.createElement('div'));

        const callback = () => {};
        const addEventSpy = sinon.spy(div, 'addEventListener');

        render(root,
            <div onclick={callback}></div>,
            <div></div>
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
            <div onclick={callback}></div>,
            <div></div>
        );

        render(root,
            <div></div>,
            <div onclick={callback}></div>
        );

        expect(removeEventSpy.called).to.equal(true);
        expect(removeEventSpy.calledWith('click', callback)).to.equal(true);
        removeEventSpy.restore();
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

    it('should skip equal vnodes', () => {
        setHTML('');

        const vnode = html('div');

        render(root,
            vnode,
            vnode
        );

        expectHTML('');
    });

    it('should patch deeply nested text nodes', () => {
        setHTML(`
            <section>
                <div>foo<span>bar</span></div>
            </section>
        `);

        render(root,
            <section>
                <div>baz<span>qux</span></div>
            </section>,
            <section>
                <div>foo<span>bar</span></div>
            </section>
        );

        expectHTML(`
            <section>
                <div>baz<span>qux</span></div>
            </section>
        `);
    });

    it('should patch deeply nested elements', () => {
        setHTML(`
            <section>
                <div>
                    <span>
                        <i></i>
                    </span>
                </div>
            </section>
        `);

        render(root,
            <section>
                <div>
                    <span>
                        <em></em>
                    </span>
                    <b></b>
                </div>
            </section>,
            <section>
                <div>
                    <span>
                        <i></i>
                    </span>
                </div>
            </section>
        );

        expectHTML(`
            <section>
                <div>
                    <span>
                        <em></em>
                    </span>
                    <b></b>
                </div>
            </section>
        `);
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
            </section>,
            <section>
                <div>
                    <span foo="1" bar="2"></span>
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

    it('should support multiple patches', () => {
        setHTML(`
            <main id="foo">
                <section class="aaa bbb">
                    <i>a</i>
                    <em>b</em>
                    <span>c</span>
                </section>
                <div></div>
                <div data-foo="123">
                    <div></div>
                </div>
            </main>
        `);

        render(root,
            <main id="bar">
                <section class="aaa 111 bbb 222">
                    <i>aa</i>
                    <b>bb</b>
                    <span id="cc">cc</span>
                </section>
                <div>
                    <span></span>
                </div>
                <div data-foo="321">
                </div>
            </main>,
            <main id="foo">
                <section class="aaa bbb">
                    <i>a</i>
                    <em>b</em>
                    <span>c</span>
                </section>
                <div></div>
                <div data-foo="123">
                    <div></div>
                </div>
            </main>
        );

        expectHTML(`
            <main id="bar">
                <section class="aaa 111 bbb 222">
                    <i>aa</i>
                    <b>bb</b>
                    <span id="cc">cc</span>
                </section>
                <div>
                    <span></span>
                </div>
                <div data-foo="321">
                </div>
            </main>
        `);
    });
});
