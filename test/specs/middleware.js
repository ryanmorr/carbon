import { h, render } from '../../src/carbon';
import { root, expectHTML } from '../setup';

describe('middleware', () => {
    it('should support middleware for element creation', () => {
        const middlewareInner = sinon.spy((element) => {
            element.setAttribute('bar', 'baz');
        });
        const middleware = sinon.spy((vnode) => {
            vnode.attributes.class = 'foo';
            return middlewareInner;
        });

        const vnode = <div />;
        const element = render(root, vnode, [middleware]);
        
        expect(middleware.callCount).to.equal(1);
        expect(middleware.args[0][0]).to.equal(vnode);
        expect(middlewareInner.callCount).to.equal(1);
        expect(middlewareInner.args[0][0]).to.equal(element);
        expectHTML('<div class="foo" bar="baz"></div>');
    });

    it('should support multiple middleware', () => {
        const middlewareInner = sinon.spy();
        const middleware1 = sinon.spy(() => middlewareInner);
        const middleware2 = sinon.spy(() => middlewareInner);
        const middleware3 = sinon.spy(() => middlewareInner);

        const vnode = <div />;
        const element = render(root, vnode, [middleware1, middleware2, middleware3]);
        
        expect(middleware1.callCount).to.equal(1);
        expect(middleware1.args[0][0]).to.equal(vnode);
        expect(middleware2.callCount).to.equal(1);
        expect(middleware2.args[0][0]).to.equal(vnode);
        expect(middleware3.callCount).to.equal(1);
        expect(middleware3.args[0][0]).to.equal(vnode);

        expect(middleware1.calledBefore(middleware2)).to.equal(true);
        expect(middleware2.calledBefore(middleware3)).to.equal(true);

        expect(middlewareInner.callCount).to.equal(3);
        expect(middlewareInner.args[0][0]).to.equal(element);
        expect(middlewareInner.args[1][0]).to.equal(element);
        expect(middlewareInner.args[2][0]).to.equal(element);
    });

    it('should support not returning an inner function', () => {
        const middleware1 = sinon.spy();
        const middleware2 = sinon.spy();

        const vnode = <div />;
        render(root, vnode, [middleware1, middleware2]);
        
        expect(middleware1.callCount).to.equal(1);
        expect(middleware1.args[0][0]).to.equal(vnode);
        expect(middleware2.callCount).to.equal(1);
        expect(middleware2.args[0][0]).to.equal(vnode);
    });

    it('should not support middleware for text nodes', () => {
        const middleware = sinon.spy();

        const vnode = <div>foo<span></span>bar</div>;
        render(root, vnode, [middleware]);
        
        expect(middleware.callCount).to.equal(2);
        expect(middleware.args[0][0]).to.equal(vnode);
        expect(middleware.args[1][0]).to.equal(vnode.children[1]);
    });

    it('should support middleware for recycled elements', () => {
        root.innerHTML = '<div></div>';
        
        const middlewareInner = sinon.spy((element) => {
            element.setAttribute('bar', 'baz');
        });
        const middleware = sinon.spy(() => middlewareInner);

        const vnode = <div />;
        const element = render(root, vnode, [middleware]);
        
        expect(middleware.callCount).to.equal(1);
        expect(middleware.args[0][0]).to.equal(null);
        expect(middlewareInner.callCount).to.equal(1);
        expect(middlewareInner.args[0][0]).to.equal(element);
    });

    it('should not support middleware for recycled text nodes', () => {
        root.innerHTML = '<div>foo<span></span>bar</div>';
        const span = root.querySelector('span');
        
        const middlewareInner = sinon.spy((element) => {
            element.setAttribute('bar', 'baz');
        });
        const middleware = sinon.spy(() => middlewareInner);

        const vnode = <div></div>;
        const element = render(root, vnode, [middleware]);
        
        expect(middleware.callCount).to.equal(2);
        expect(middleware.args[0][0]).to.equal(null);
        expect(middleware.args[1][0]).to.equal(null);
        expect(middlewareInner.callCount).to.equal(2);
        expect(middlewareInner.args[0][0]).to.equal(element);
        expect(middlewareInner.args[1][0]).to.equal(span);
    });
});
