import { h } from '../../src/velvet';
import { root, render, expectHTML } from '../setup';

describe('patch nodes', () => {
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

    it('should skip equal vnodes', () => {
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
