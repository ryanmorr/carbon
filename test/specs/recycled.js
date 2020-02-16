import { h, render } from '../../src/velvet';
import { root, expectHTML } from '../setup';

describe('recycled', () => {
    it('should recycle a pre-existing text node', () => {
        root.innerHTML = 'foo';
        const text = root.firstChild;
        
        const node = render(root,
            'bar'
        );

        expect(node).to.equal(text);
        expectHTML('bar');
    });

    it('should recycle a pre-existing element', () => {
        root.innerHTML = '<div></div>';
        
        render(root,
            <span />
        );

        expectHTML('<span></span>');
    });

    it('should recycle pre-existing attributes', () => {
        root.innerHTML = '<div id="foo" class="bar" data-baz="qux" style="width: 100px; height: 100px;"></div>';
        const div = root.firstChild;
        
        const element = render(root,
            <div id="baz" class="qux" style="width: 200px" />
        );

        expect(element).to.equal(div);
        expectHTML('<div id="baz" class="qux" style="width: 200px;"></div>');
    });

    it('should recycle pre-existing DOM properties', () => {
        root.innerHTML = '<input type="checkbox" />';
        const checkbox = root.firstChild;
        checkbox.checked = false;

        const element = render(root,
            <input type="checkbox" checked={true} />
        );

        expect(element).to.equal(checkbox);
        expectHTML('<input type="checkbox">');
        expect(checkbox.checked).to.equal(true);
    });

    it('should recycle multiple pre-existing child nodes', () => {
        root.innerHTML = 'foo<div id="bar"></div>baz<span></span>';
        const text = root.childNodes[0];
        const div = root.childNodes[1];
        
        const nodes = render(root, [
            'baz',
            <div id="qux" />,
            <em />
        ]);

        expect(nodes[0]).to.equal(text);
        expect(nodes[1]).to.equal(div);
        expectHTML('baz<div id="qux"></div><em></em>');
    });

    it('should recycle pre-existing keyed elements', () => {
        root.innerHTML = '<section><div key="a"></div><span key="b"></span></section>';
        const div = root.firstChild.childNodes[0];
        const span = root.firstChild.childNodes[1];
        
        const section = render(root,
            <section>
                <span key="b" />
                <em />
                <div key="a" />
            </section>
        );

        expect(section.childNodes[0]).to.equal(span);
        expect(section.childNodes[2]).to.equal(div);
        expectHTML('<section><span></span><em></em><div></div></section>');
    });
});
