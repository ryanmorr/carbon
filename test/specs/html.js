import { html } from '../../src/velvet';

describe('html', () => {
    it('should create an element', () => {
        expect(html('div')).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: []
        });
    });

    it('should create an element with attributes', () => {
        expect(html('div', {id: 'foo', class: 'bar'})).to.deep.equal({
            nodeName: 'div',
            attributes: {id: 'foo', class: 'bar'},
            children: []
        });
    });

    it('should create an element with a single text child', () => {
        expect(html('div', null, 'foo')).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: ['foo']
        });
    });

    it('should create an element with a single element child', () => {
        expect(html('div', null, html('span'))).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [{
                nodeName: 'span',
                attributes: {},
                children: []
            }]
        });
    });

    it('should create an element with multiple children', () => {
        expect(html('div', null, html('i'), 'foo', html('em'))).to.deep.equal({
            nodeName: 'div',
            attributes: {},
            children: [
                {
                    nodeName: 'i',
                    attributes: {},
                    children: []
                },
                'foo',
                {
                    nodeName: 'em',
                    attributes: {},
                    children: []
                }
            ]
        });
    });
});
