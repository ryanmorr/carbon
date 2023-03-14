import { h, render } from '../../src/carbon';
import { root, expectHTML } from '../setup';

describe('attributes', () => {
    it('should render an element with attributes', () => {
        const div = render(root,
            <div id="foo" class="bar" data-baz="qux" />
        );

        expect(div.attributes.length).to.equal(3);
        expectHTML('<div id="foo" class="bar" data-baz="qux"></div>');
    });
    
    it('should add an attribute', () => {
        const div = render(root,
            <div />
        );

        expect(div.attributes.length).to.equal(0);
        expectHTML('<div></div>');

        render(root,
            <div id="foo" />
        );
        
        expect(div.attributes.length).to.equal(1);
        expectHTML('<div id="foo"></div>');
    });

    it('should remove an attribute', () => {
        const div = render(root,
            <div foo="bar" />
        );

        expect(div.attributes.length).to.equal(1);
        expectHTML('<div foo="bar"></div>');

        render(root,
            <div />
        );

        expect(div.attributes.length).to.equal(0);
        expectHTML('<div></div>');
    });

    it('should remove an attribute if the value assigned is undefined, null, or false', () => {
        const div = render(root,
            <div foo="1" bar="2" baz="3" />
        );
        
        expect(div.attributes.length).to.equal(3);
        expectHTML('<div foo="1" bar="2" baz="3"></div>');

        render(root,
            <div foo={void 0} bar={null} baz={false} />
        );
        
        expect(div.attributes.length).to.equal(0);
        expectHTML('<div></div>');
    });

    it('should update an attribute', () => {
        render(root,
            <div foo="bar" />
        );

        expectHTML('<div foo="bar"></div>');

        render(root,
            <div foo="baz" />
        );

        expectHTML('<div foo="baz"></div>');
    });

    it('should not remove an attribute node if only the value has changed', () => {
        const div1 = render(root,
            <div foo="bar" />
        );
        
        const attrNode1 = div1.attributes[0];
        expectHTML('<div foo="bar"></div>');

        const div2 = render(root,
            <div foo="baz" />
        );
        
        const attrNode2 = div2.attributes[0];
        expect(attrNode1).to.equal(attrNode2);
        expectHTML('<div foo="baz"></div>');
    });

    it('should not remove an element if only an attribute is changed', () => {
        const div = render(root,
            <div foo="1" bar="2" />
        );
        
        expectHTML('<div foo="1" bar="2"></div>');

        const div2 = render(root,
            <div foo="1" bar="2" baz="3" />
        );

        expect(div).to.equal(div2);
        expectHTML('<div foo="1" bar="2" baz="3"></div>');
    });

    it('should patch deeply nested attributes', () => {
        render(root,
            <section>
                <div>
                    <span foo="1" bar="2" />
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
                    <span foo="2" baz="3" />
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

    it('should set the class attribute', () => {
        const div = render(root,
            <div class="foo" />
        );
        
        expect(div.className).to.equal('foo');
        expect(div.getAttribute('class')).to.equal('foo');
        expectHTML('<div class="foo"></div>');

        render(root,
            <div class="bar" />
        );
        
        expect(div.className).to.equal('bar');
        expect(div.getAttribute('class')).to.equal('bar');
        expectHTML('<div class="bar"></div>');
    });

    it('should support the class attribute as an array', () => {
        const div = render(root,
            <div class={['foo', 'bar', 'baz']} />
        );
        
        expect(div.className).to.equal('foo bar baz');
        expect(div.getAttribute('class')).to.equal('foo bar baz');
        expectHTML('<div class="foo bar baz"></div>');

        render(root,
            <div class={['foo', 'baz']} />
        );
        
        expect(div.className).to.equal('foo baz');
        expect(div.getAttribute('class')).to.equal('foo baz');
        expectHTML('<div class="foo baz"></div>');
    });

    it('should support the class attribute as an object', () => {
        const div = render(root,
            <div class={{foo: true, bar: true, baz: true}} />
        );
        
        expect(div.className).to.equal('foo bar baz');
        expect(div.getAttribute('class')).to.equal('foo bar baz');
        expectHTML('<div class="foo bar baz"></div>');

        render(root,
            <div class={{foo: false, bar: true, baz: true}} />
        );
        
        expect(div.className).to.equal('bar baz');
        expect(div.getAttribute('class')).to.equal('bar baz');
        expectHTML('<div class="bar baz"></div>');
    });

    it('should alias className to class', () => {
        const div = render(root,
            <div className="foo" />
        );
        
        expect(div.className).to.equal('foo');
        expect(div.getAttribute('class')).to.equal('foo');
        expectHTML('<div class="foo"></div>');

        render(root,
            <div className="bar" />
        );
        
        expect(div.className).to.equal('bar');
        expect(div.getAttribute('class')).to.equal('bar');
        expectHTML('<div class="bar"></div>');
    });

    it('should remove the class attribute by providing null or undefined as the value', () => {
        const div = render(root,
            <div class="foo" />
        );

        expectHTML('<div class="foo"></div>');

        render(root,
            <div class={null} />
        );

        expect(div.className).to.equal('');
        expect(div.getAttribute('class')).to.equal('');
        expectHTML('<div class=""></div>');

        render(root,
            <div class="bar" />
        );

        expectHTML('<div class="bar"></div>');

        render(root,
            <div class={undefined} />
        );

        expect(div.className).to.equal('');
        expect(div.getAttribute('class')).to.equal('');
        expectHTML('<div class=""></div>');
    });

    it('should add CSS styles as a string', () => {
        const styles = `
            color: rgb(255, 255, 255);
            background: rgb(255, 100, 0);
            background-position: 10px 10px;
            background-size: cover;
        `;

        const div = render(root,
            <div style={styles} />
        );

        const style = div.style;
        expect(style.color).to.equal('rgb(255, 255, 255)');
        expect(style.background).to.contain('rgb(255, 100, 0)');
        expect(style.backgroundPosition).to.equal('10px 10px');
        expect(style.backgroundSize).to.equal('cover');
    });

    it('should add CSS styles as an object', () => {
        const styles = {
            color: 'rgb(255, 255, 255)',
            backgroundPosition: '10px 10px',
            'background-size': 'cover'
        };

        const div = render(root,
            <div style={styles} />
        );

        const style = div.style;
        expect(style.color).to.equal('rgb(255, 255, 255)');
        expect(style.backgroundPosition).to.equal('10px 10px');
        expect(style.backgroundSize).to.equal('cover');
    });

    it('should properly switch from string styles to object styles and back', () => {
		const div = render(root, 
            <div style="display: inline;">test</div>
        );

		expect(div.style.cssText).to.equal('display: inline;');

		render(root, 
            <div style={{ color: 'red' }} />
        );

		expect(div.style.cssText).to.equal('color: red;');

		render(root, 
            <div style="color: blue" />
        );

		expect(div.style.cssText).to.equal('color: blue;');

		render(root, 
            <div style={{ color: 'yellow' }} />
        );

		expect(div.style.cssText).to.equal('color: yellow;');

		render(root,
            <div style="display: block" />
        );

		expect(div.style.cssText).to.equal('display: block;');
	});

    it('should support CSS variables', () => {
        render(root,
            <div style={{color: 'var(--color)', '--color': 'red'}} />
        );

        const div = root.firstChild;
        expect(div.style.color).to.equal('var(--color)');
        expect(window.getComputedStyle(div).getPropertyValue('color')).to.equal('rgb(255, 0, 0)');
        expect(window.getComputedStyle(div).getPropertyValue('--color')).to.equal('red');
    });

    it('should not add "px" suffix for custom properties', () => {
        const div = render(root, 
            <div style={{'--foo': '100px', width: 'var(--foo)'}} />
        );

        expect(div.style.width).to.equal('var(--foo)');
        expect(window.getComputedStyle(div).getPropertyValue('--foo')).to.equal('100px');
    });

    it('should support opacity 0', () => {
        const div = render(root,
            <div style={{opacity: 1}} />
        );

        expect(div.style.opacity).to.equal('1');

        render(root,
            <div style={{opacity: 0}} />
        );

        expect(div.style.opacity).to.equal('0');
    });

    it('should remove old CSS styles', () => {
        const div = render(root,
            <div style={{color: 'red'}} />
        );

        expect(div.style.color).to.equal('red');

        render(root,
            <div style={{backgroundColor: 'blue'}} />
        );

        expect(div.style.color).to.equal('');
        expect(div.style.backgroundColor).to.equal('blue');
    });

    it('should remove empty CSS styles', () => {
        const div = render(root,
            <div style={{color: 'red', backgroundColor: 'blue'}} />
        );

        expect(div.style.color).to.equal('red');
        expect(div.style.backgroundColor).to.equal('blue');

        render(root,
            <div style={{color: null, backgroundColor: undefined}} />
        );

        expect(div.style.color).to.equal('');
        expect(div.style.backgroundColor).to.equal('');
    });

    it('should remove all CSS styles by providing null or undefined', () => {
        const div = render(root, 
            <div style={{width: '20px', height: '30px'}} />
        );

        expect(div.style.cssText).to.equal('width: 20px; height: 30px;');

        render(root, 
            <div style={null} />
        );

        expect(div.style.cssText).to.equal('');

        render(root, 
            <div style={{width: '5px', height: '15px'}} />
        );

        expect(div.style.cssText).to.equal('width: 5px; height: 15px;');

        render(root, 
            <div style={undefined} />
        );

        expect(div.style.cssText).to.equal('');
    });

    it('should replace CSS styles', () => {
        const div = render(root,
            <div style={{display: 'inline'}} />
        );

        expect(div.style.display).to.equal('inline');

        render(root,
            <div style={{zIndex: 1, position: 'absolute'}} />
        );

        expect(div.style.zIndex).to.equal('1');
        expect(div.style.position).to.equal('absolute');
        expect(div.style.display).to.equal('');

        render(root,
            <div style={{zIndex: 2, display: 'inline'}} />
        );

        expect(div.style.zIndex).to.equal('2');
        expect(div.style.display).to.equal('inline');
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

    it('should support DOM properties', () => {
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

    it('should reconcile mutated DOM properties', () => {
		const check = (val) => render(root, <input type="checkbox" checked={val} />);
		const getValue = () => root.firstChild.checked;
        const setValue = (val) => (root.firstChild.checked = val);
        
		check(true);
        expect(getValue()).to.equal(true);
        
		check(false);
        expect(getValue()).to.equal(false);
        
		check(true);
        expect(getValue()).to.equal(true);
        
		setValue(true);
		check(false);
        expect(getValue()).to.equal(false);
        
		setValue(false);
		check(true);
		expect(getValue()).to.equal(true);
	});

    it('should add an event listener', () => {
        const div = render(root,
            <div />
        );

        const event = new CustomEvent('click');
        const onClick = sinon.spy();
        const addEventSpy = sinon.spy(div, 'addEventListener');

        render(root,
            <div onclick={onClick} />
        );

        expect(onClick.callCount).to.equal(0);
        div.dispatchEvent(event);
        expect(addEventSpy.callCount).to.equal(1);
        expect(onClick.callCount).to.equal(1);
        const call = onClick.getCall(0);
        expect(call.thisValue).to.equal(div);
        expect(call.args[0]).to.equal(event);
    });

    it('should remove an event listener', () => {
        const onClick = sinon.spy();

        const div = render(root,
            <div onclick={onClick} />
        );

        div.dispatchEvent(new CustomEvent('click'));
        expect(onClick.callCount).to.equal(1);

        const removeEventSpy = sinon.spy(div, 'removeEventListener');

        render(root,
            <div></div>
        );

        div.dispatchEvent(new CustomEvent('click'));
        expect(onClick.callCount).to.equal(1);
        expect(removeEventSpy.callCount).to.equal(1);
    });

    it('should update event listeners', () => {
        const div = render(root,
            <div />
        );

        const event1 = new CustomEvent('click');
        const onClick1 = sinon.spy();
        const addEventSpy = sinon.spy(div, 'addEventListener');
        const removeEventSpy = sinon.spy(div, 'removeEventListener');

        render(root,
            <div onclick={onClick1} />
        );

        div.dispatchEvent(event1);
        expect(onClick1.callCount).to.equal(1);
        expect(addEventSpy.callCount).to.equal(1);
        expect(removeEventSpy.callCount).to.equal(0);

        const event2 = new CustomEvent('click');
        const onClick2 = sinon.spy();

        render(root,
            <div onclick={onClick2} />
        );

        div.dispatchEvent(event2);
        expect(onClick1.callCount).to.equal(1);
        expect(onClick2.callCount).to.equal(1);
        expect(addEventSpy.callCount).to.equal(2);
        expect(removeEventSpy.callCount).to.equal(1);

        const call = onClick2.getCall(0);
        expect(call.thisValue).to.equal(div);
        expect(call.args[0]).to.equal(event2);
    });

    it('should support custom events', (done) => {
        let event = new CustomEvent('Foo');

        const callback = (e) => {
            expect(e).to.equal(event);
            done();
        };

        const div = render(root,
            <div onFoo={callback} />
        );

        div.dispatchEvent(event);
    });

    it('should support camel-case event names', (done) => {
        const event = new MouseEvent('mousedown');
        const onMouseDown = (e) => {
            expect(e).to.equal(event);
            done();
        };

        const div = render(root, 
            <div onMouseDown={onMouseDown}></div>
        );
        div.dispatchEvent(event);
	});

    it('should allow attributes with a prefix of "on" if the value is not a function', () => {
        render(root,
            <div onfoo="bar" />
        );

        expectHTML('<div onfoo="bar"></div>');
    });

    it('should ignore keys', () => {
        render(root,
            <div key="foo" />
        );

        expectHTML('<div></div>');
    });

    it('should ignore a children attribute if it exists', () => {
        render(root,
            <div children="foo" />
        );

        expectHTML('<div></div>');
    });

    it('should not render falsy attributes', () => {
        render(root, 
            <div
                a={null}
                b={undefined}
                c={false}
                d={NaN}
                e={0}
			/>
        );

        expectHTML('<div d="NaN" e="0"></div>');
    });

    it('should remove falsy attributes', () => {
        render(root, 
            <div
                a="null"
                b="undefined"
                c="false"
                d="NaN"
                e="0"
			/>
        );

        expectHTML('<div a="null" b="undefined" c="false" d="NaN" e="0"></div>');

        render(root, 
            <div
                a={null}
                b={undefined}
                c={false}
                d={NaN}
                e={0}
			/>
        );

        expectHTML('<div d="NaN" e="0"></div>');
    });

    it('should clear falsy input values', () => {
		const inputs = render(root, [
            <input value={0} />,
            <input value={false} />,
            <input value={null} />,
            <input value={undefined} />
        ]);

        expect(inputs[0].value).to.equal('0');
        expect(inputs[1].value).to.equal('false');
        expect(inputs[2].value).to.equal('');
        expect(inputs[3].value).to.equal('');
    });
    
    it('should set enumerable boolean attribute', () => {
		const input = render(root,
            <input spellcheck={false} />
        );

		expect(input.spellcheck).to.equal(false);
    });
    
    it('should not serialize functions as attributes', () => {
		const div = render(root,
            <div foo={() => {}} />
        );

		expect(div.attributes.length).to.equal(0);
    });
    
    it('should serialize object properties as attributes', () => {
		const div = render(root,
			<div
				foo={{ a: 'b' }}
				bar={{
					toString() {
						return 'abc';
					}
				}}
			/>
		);

        expect(div.attributes.length).to.equal(2);
        expectHTML('<div foo="[object Object]" bar="abc"></div>');
    });
    
    it('should support innerHTML', () => {
        render(root,
			<div innerHTML="<span>foo</span>" />
		);

        expectHTML('<div><span>foo</span></div>');
    });

    it('should support the form attribute', () => {
		const div = render(root, 
			<div>
				<form id="foo" />
				<button form="foo">test</button>
				<input form="foo" />
			</div>
        );

		const form = div.childNodes[0];
		const button = div.childNodes[1];
		const input = div.childNodes[2];

		expect(button).to.have.property('form', form);
		expect(input).to.have.property('form', form);
	});

    it('should set the download attribute', () => {
		const anchor = render(root, 
            <a download=""></a>
        );

		expect(anchor.getAttribute('download')).to.equal('');

		render(root, 
            <a download={null}></a>
        );

		expect(anchor.getAttribute('download')).to.equal(null);
	});

    it('should set the list attribute', () => {
        const div = render(root, 
            <div>
                <input type="range" min="0" max="100" list="steplist" />
                <datalist id="steplist">
                    <option>0</option>
                    <option>50</option>
                    <option>100</option>
                </datalist>
            </div>
        );

        const input = div.firstElementChild;
        expect(input.outerHTML).to.equal('<input type="range" min="0" max="100" list="steplist">');
    });

    it('should support false string aria attributes', () => {
		const div = render(root, 
            <div aria-checked="false"></div>
        );

		expect(div.getAttribute('aria-checked')).to.equal('false');
	});

	it('should support false aria attributes', () => {
		const div = render(root,
            <div aria-checked={false}></div>
        );

		expect(div.getAttribute('aria-checked')).to.equal('false');
	});

	it('should support false data attributes', () => {
		const div = render(root,
            <div data-checked={false}></div>
        );

		expect(div.getAttribute('data-checked')).to.equal('false');
	});

	it('should set checked attribute on custom elements without checked property', () => {
		const div = render(root,
            <o-checkbox checked />
        );

		expect(div.outerHTML).to.equal('<o-checkbox checked="true"></o-checkbox>');
	});

	it('should set value attribute on custom elements without value property', () => {
		const div = render(root, 
            <o-input value="test" />
        );

		expect(div.outerHTML).to.equal('<o-input value="test"></o-input>');
	});

    it('should not set tagName', () => {
		expect(() => render(root, <input tagName="div" />)).not.to.throw();
	});

    it('should not throw when setting size to an invalid value', () => {
		expect(() => render(root, <input size={undefined} />)).to.not.throw();
		expect(() => render(root, <input size={null} />)).to.not.throw();
		expect(() => render(root, <input size={0} />)).to.not.throw();
	});
    
    it('should always diff `checked` and `value` properties against the DOM', () => {
		const div = render(root, 
            <div>
                <input value={'Hello'} />
                <input type="checkbox" checked />
            </div>
        );
        
        const text = div.firstElementChild;
        const checkbox = div.lastElementChild;

		expect(text.value).to.equal('Hello');
		expect(checkbox.checked).to.equal(true);

		text.value = 'World';
		checkbox.checked = false;

		render(root, 
            <div>
                <input value={'Hello'} />
                <input type="checkbox" checked />
            </div>
        );

		expect(text.value).to.equal('Hello');
		expect(checkbox.checked).to.equal(true);
	}); 
    
    it('should remove attributes on pre-existing DOM', () => {
		const div = document.createElement('div');
		div.setAttribute('foo', 'bar');
		const span = document.createElement('span');
		const text = document.createTextNode('baz');
		span.appendChild(text);
		div.appendChild(span);
		root.appendChild(div);

		render(root, 
            <div>
				<span>qux</span>
			</div>
        );
		expectHTML('<div><span>qux</span></div>');
	});
        
    it('should support animation-iteration-count as a number', () => {
		const div = render(root, 
            <div style={{animationIterationCount: 1}} />
        );

		expect(div.style.animationIterationCount).to.equal('1');

		render(root, 
            <div style={{animationIterationCount: 2.5}} />
        );

        expect(div.style.animationIterationCount).to.equal('2.5');
	});
});
