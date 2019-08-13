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
