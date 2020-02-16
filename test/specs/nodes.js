import { h, render } from '../../src/carbon';
import { root, expectHTML } from '../setup';

describe('nodes', () => {
    it('should render a text node given a string', () => {
        const node = render(root, 'foo');
        
        expectHTML('foo');
        expect(root.childNodes).to.have.length(1);
        expect(root.firstChild).to.equal(node);
    });

    it('should render an empty text node given an empty string', () => {
        const node = render(root, '');
        
        expectHTML('');
        expect(root.childNodes).to.have.length(1);
        expect(root.firstChild).to.equal(node);
    });

    it('should render a text node given a number', () => {
        const node = render(root, 123);
        
        expectHTML('123');
        expect(root.childNodes).to.have.length(1);
        expect(root.firstChild).to.equal(node);
    });

    it('should render a text node given the number zero', () => {
        const node = render(root, 0);
        
        expectHTML('0');
        expect(root.childNodes).to.have.length(1);
        expect(root.firstChild).to.equal(node);
    });
    
    it('should render a text node given a boolean true', () => {
        const node = render(root, true);
        
        expectHTML('true');
        expect(root.childNodes).to.have.length(1);
        expect(root.firstChild).to.equal(node);
    });
    
    it('should render a text node given a boolean false', () => {
        const node = render(root, false);
        
        expectHTML('false');
        expect(root.childNodes).to.have.length(1);
        expect(root.firstChild).to.equal(node);
    });
    
    it('should render an element', () => {
        const element = render(root,
            <div />
        );

        expectHTML('<div></div>');
        expect(root.childNodes).to.have.length(1);
        expect(root.firstChild).to.equal(element);
    });

    it('should render an array of multiple text nodes', () => {
        const elements = render(root, [
            'foo',
            'bar',
            123
        ]);

        expectHTML('foobar123');
        expect(elements).to.deep.equal(Array.from(root.childNodes));
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

    it('should render an array of multiple mixed-type nodes', () => {
        const elements = render(root, [
            'foo',
            <span />,
            123,
            <em />
        ]);

        expectHTML('foo<span></span>123<em></em>');
        expect(elements).to.deep.equal(Array.from(root.childNodes));
    });

    it('should remove a text node with null', () => {
        render(root,
            'foo'
        );

        expectHTML('foo');
        
        const el = render(root,
            null
        );

        expectHTML('');
        expect(el).to.equal(null);
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

    it('should replace a text node with a text node', () => {
        render(root,
            'foo'
        );

        expectHTML('foo');
        
        const el = render(root,
            'bar'
        );

        expectHTML('bar');
        expect(el).to.equal(root.firstChild);
    });

    it('should use the same text node when updating its value', () => {
        const foo = render(root,
            'foo'
        );

        expectHTML('foo');
        
        const bar = render(root,
            'bar'
        );

        expectHTML('bar');
        expect(foo).to.equal(bar);
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

    it('should replace a text node with an element', () => {
        render(root,
            'foo'
        );

        expectHTML('foo');
        
        const el = render(root,
            <div />
        );

        expectHTML('<div></div>');
        expect(el).to.equal(root.firstChild);
    });

    it('should replace an element with a text node', () => {
        render(root,
            <span />
        );

        expectHTML('<span></span>');
        
        const el = render(root,
            'foo'
        );

        expectHTML('foo');
        expect(el).to.equal(root.firstChild);
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

    it('should not render null and undefined', () => {
        render(root, 
            <div>
				{null},{undefined},{true},{false},{0},{NaN}
			</div>
        );

        expectHTML('<div>,,true,false,0,NaN</div>');
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
            </div>
        );

        expectHTML('<div><section><p>123</p></section>qux<em></em></div>');
    });

    it('should support SVG', () => {
        render(root,
            <svg><circle cx="50" cy="50" r="40" fill="red" /></svg>
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
