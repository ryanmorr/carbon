import { h } from '../../src/velvet';
import { root, render, expectHTML } from '../setup';

describe('patch children', () => {
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
