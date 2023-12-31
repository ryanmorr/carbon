import { h, render } from '../../src/carbon';
import { root, expectHTML } from '../setup';

describe('nodes', () => {    
    it('should render an element', () => {
        const element = render(root,
            <div />
        );

        expectHTML('<div></div>');
        expect(root.childNodes).to.have.length(1);
        expect(root.firstChild).to.equal(element);
    });

    it('should render an array of multiple elements', () => {
        const elements = render(root, [
            <div />,
            <span />,
            <em />
        ]);

        expectHTML('<div></div><span></span><em></em>');
        expect(elements).to.deep.equal(Array.from(root.childNodes));
    });

    it('should render an array containing a single element', () => {
        const el = render(root, [
            <div />
        ]);

        expectHTML('<div></div>');
        expect(el).to.equal(root.firstChild);
    });

    it('should render a string as a text node', () => {
        const el = render(root, 
            <div>{'foo'}</div>    
        );
        
        expectHTML('<div>foo</div>');
        const textNode = el.firstChild;
        expect(textNode.nodeType).to.equal(3);
        expect(textNode.data).to.equal('foo');
    });

    it('should render an empty string as a text node', () => {
        const el = render(root, 
            <div>{''}</div>    
        );
        
        expectHTML('<div></div>');
        const textNode = el.firstChild;
        expect(textNode.nodeType).to.equal(3);
        expect(textNode.data).to.equal('');
    });

    it('should render a number as a text node', () => {
        const el = render(root, 
            <div>{123}</div>    
        );
        
        expectHTML('<div>123</div>');
        const textNode = el.firstChild;
        expect(textNode.nodeType).to.equal(3);
        expect(textNode.data).to.equal('123');
    });

    it('should render zero as a text node', () => {
        const el = render(root, 
            <div>{0}</div>    
        );
        
        expectHTML('<div>0</div>');
        const textNode = el.firstChild;
        expect(textNode.nodeType).to.equal(3);
        expect(textNode.data).to.equal('0');
    });
    
    it('should not render boolean true', () => {
        const el = render(root, 
            <div>{true}</div>    
        );

        expectHTML('<div></div>');
        expect(el.childNodes).to.have.length(0);
    });

    it('should not render boolean false', () => {
        const el = render(root, 
            <div>{false}</div>    
        );

        expectHTML('<div></div>');
        expect(el.childNodes).to.have.length(0);
    });


    it('should render an array of multiple text nodes', () => {
        const el = render(root,
            <div>{['foo', 'bar', 123]}</div> 
        );

        expectHTML('<div>foobar123</div>');
        expect(el.childNodes).to.have.length(3);
    });

    it('should render an array of multiple mixed-type nodes', () => {
        const el = render(root, 
            <div>
                {[
                    'foo',
                    <span />,
                    123,
                    <em />
                ]}
            </div>
        );

        expectHTML('<div>foo<span></span>123<em></em></div>');
        expect(el.childNodes).to.have.length(4);
    });

    it('should remove an element with null', () => {
        render(root,
            <span />
        );

        expectHTML('<span></span>');
        
        const el = render(root,
            null
        );

        expectHTML('');
        expect(el).to.equal(null);
    });

    it('should remove a text node with null', () => {
        const el1 = render(root,
            <div>foo</div>
        );

        expectHTML('<div>foo</div>');
        
        const el2 = render(root,
            <div></div>
        );

        expectHTML('<div></div>');
        expect(el1).to.equal(el2);
    });

    it('should remove multiple nodes with null', () => {
        render(root, [
            <div />,
            <span />,
            <em />
        ]);

        expectHTML('<div></div><span></span><em></em>');

        const el = render(root,
            null
        );

        expectHTML('');
        expect(el).to.equal(null);
    });

    it('should remove multiple nodes with an empty array', () => {
        render(root, [
            <div />,
            <span />
        ]);

        expectHTML('<div></div><span></span>');

        const el = render(root, [
            null
        ]);

        expectHTML('');
        expect(el).to.equal(null);
    });

    it('should replace an element with an element', () => {
        render(root,
            <span />
        );

        expectHTML('<span></span>');
        
        const el = render(root,
            <div />
        );

        expectHTML('<div></div>');
        expect(el).to.equal(root.firstChild);
    });

    it('should replace a text node with a text node', () => {
        const el1 = render(root,
            <div>foo</div>
        );

        expectHTML('<div>foo</div>');
        
        const el2 = render(root,
            <div>bar</div>
        );

        expectHTML('<div>bar</div>');
        expect(el1).to.equal(el2);
    });

    it('should use the same text node when updating its value', () => {
        const el1 = render(root,
            <div>foo</div>
        );
        
        const el2 = render(root,
            <div>bar</div>
        );

        const textNode1 = el1.firstChild;
        const textNode2 = el2.firstChild;
        expect(textNode1).to.equal(textNode2);
    });

    it('should replace a text node with an element', () => {
        render(root,
            <div>foo</div>
        );

        expectHTML('<div>foo</div>');
        
        render(root,
            <div><span /></div>
        );

        expectHTML('<div><span></span></div>');
    });

    it('should replace an element with a text node', () => {
        render(root,
            <div><span /></div>
        );

        expectHTML('<div><span></span></div>');
        
        render(root,
            <div>foo</div>
        );

        expectHTML('<div>foo</div>');
    });

    it('should replace a single node with multiple nodes', () => {
        render(root, 
            <div />
        );

        expectHTML('<div></div>');

        render(root, [
            <span />,
            <em />,
            <i />
        ]);

        expectHTML('<span></span><em></em><i></i>');
    });

    it('should replace multiple nodes with a single node', () => {
        render(root, [
            <span />,
            <em />,
            <i />
        ]);

        expectHTML('<span></span><em></em><i></i>');

        render(root, 
            <div />
        );

        expectHTML('<div></div>');
    });

    it('should replace multiple nodes with greater multiple nodes', () => {
        render(root, [
            <span />,
            <em />

        ]);

        expectHTML('<span></span><em></em>');

        render(root, [
            <div />,
            <i />,
            <section />,
            <span />
        ]);

        expectHTML('<div></div><i></i><section></section><span></span>');
    });

    it('should replace multiple root nodes with lesser multiple nodes', () => {
        render(root, [
            <div />,
            <i />,
            <section />,
            <span />,
            <article />
        ]);

        expectHTML('<div></div><i></i><section></section><span></span><article></article>');

        render(root, [
            <span />,
            <em />
        ]);

        expectHTML('<span></span><em></em>');
    });

    it('should not render null, undefined, true, or false', () => {
        render(root, 
            <div>
				{null},{undefined},{true},{false},{0},{NaN}
			</div>
        );

        expectHTML('<div>,,,,0,NaN</div>');
    });

    it('should render deep node changes', () => {
        render(root,
            <div />
        );

        expectHTML('<div></div>');

        render(root,
            <div>
                <span>foo</span>
                bar
                <em>baz</em>
            </div>
        );

        expectHTML('<div><span>foo</span>bar<em>baz</em></div>');

        render(root,
            <div>
                <section>
                    <p>{123}</p>
                </section>
                qux
                <em />
                <i>{false}</i>
            </div>
        );

        expectHTML('<div><section><p>123</p></section>qux<em></em><i></i></div>');
    });

    it('should support SVG', () => {
        render(root,
            <svg><circle class="foo" cx="50" cy="50" r="40" fill="red" /></svg>
        );

        expectHTML('<svg><circle class="foo" cx="50" cy="50" r="40" fill="red"></circle></svg>');

        const svg = root.querySelector('svg');
        expect(svg.nodeType).to.equal(1);
        expect(svg.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        expect(svg).to.be.instanceof(SVGElement);

        const circle = svg.querySelector('circle');
        expect(circle.nodeType).to.equal(1);
        expect(circle.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        expect(circle).to.be.instanceof(SVGElement);
        expect(circle.getAttribute('class')).to.equal('foo');
    });

    it('should support custom tag names', () => {
		const element = render(root,
            <x-foo />
        );

        expectHTML('<x-foo></x-foo>');
        expect(element.nodeName).to.equal('X-FOO');
    });

    it('should not render equal vnodes', () => {
        const vnode = <div />;

        const div = render(root,
            vnode
        );

        expectHTML('<div></div>');

        vnode.nodeName = 'span';

        render(root,
            vnode
        );

        expect(vnode.node).to.equal(div);
        expectHTML('<div></div>');
    });
});
