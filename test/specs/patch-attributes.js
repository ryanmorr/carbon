import { h } from '../../src/velvet';
import { root, render, expectHTML } from '../setup';

describe('patch attributes', () => {
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

    it('should support the input list attribute', () => {
        render(root,
            <input list="foo" />
        );

        expectHTML('<input list="foo">');
    });

    it('should support the input form attribute', () => {
        render(root,
            <input form="foo" />
        );

        expectHTML('<input form="foo">');
    });
});
