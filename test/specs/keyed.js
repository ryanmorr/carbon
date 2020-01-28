import { h, render } from '../../src/velvet';
import { root, expectHTML } from '../setup';

describe('keyed', () => {
    function keyedSpans(...elements) {
        return elements.map((element) => <span key={element}>{element}</span>);
    }

    it('should append keyed nodes', () => {
        render(root,
            <div>{keyedSpans('a', 'b')}</div>
        );

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
            </div>
        `);

        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
        );

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
            </div>
        `);
    });

    it('should prepend keyed nodes', () => {
        render(root,
            <div>{keyedSpans('d', 'e')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const d1 = keyed1[0];
        const e1 = keyed1[1];

        expectHTML(`
            <div>
                <span>d</span>
                <span>e</span>
            </div>
        `);

        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd', 'e')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const d2 = keyed2[3];
        const e2 = keyed2[4];

        expect(d1).to.equal(d2);
        expect(e1).to.equal(e2);

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
                <span>e</span>
            </div>
        `);
    });

    it('should add keyed nodes in the middle', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'd', 'e')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const a1 = keyed1[0];
        const b1 = keyed1[1];
        const d1 = keyed1[2];
        const e1 = keyed1[3];

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>d</span>
                <span>e</span>
            </div>
        `);

        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd', 'e')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const a2 = keyed2[0];
        const b2 = keyed2[1];
        const d2 = keyed2[3];
        const e2 = keyed2[4];

        expect(a1).to.equal(a2);
        expect(b1).to.equal(b2);
        expect(d1).to.equal(d2);
        expect(e1).to.equal(e2);

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
                <span>e</span>
            </div>
        `);
    });

    it('should add keyed nodes at both ends', () => {
        render(root,
            <div>{keyedSpans('b', 'c', 'd')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const b1 = keyed1[0];
        const c1 = keyed1[1];
        const d1 = keyed1[2];

        expectHTML(`
            <div>
                <span>b</span>
                <span>c</span>
                <span>d</span>
            </div>
        `);

        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd', 'e')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const b2 = keyed2[1];
        const c2 = keyed2[2];
        const d2 = keyed2[3];

        expect(b1).to.equal(b2);
        expect(c1).to.equal(c2);
        expect(d1).to.equal(d2);

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
                <span>e</span>
            </div>
        `);
    });

    it('should remove keyed nodes', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
        );

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
            </div>
        `);

        render(root,
            <div></div>
        );

        expectHTML(`
            <div></div>
        `);
    });

    it('should remove keyed nodes from the beginning', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const c1 = keyed1[2];
        const d1 = keyed1[3];

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
            </div>
        `);

        render(root,
            <div>{keyedSpans('c', 'd')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const c2 = keyed2[0];
        const d2 = keyed2[1];

        expect(c1).to.equal(c2);
        expect(d1).to.equal(d2);

        expectHTML(`
            <div>
                <span>c</span>
                <span>d</span>
            </div>
        `);
    });

    it('should remove keyed nodes from the middle', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd', 'e')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const a1 = keyed1[0];
        const b1 = keyed1[1];
        const d1 = keyed1[3];
        const e1 = keyed1[4];

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
                <span>e</span>
            </div>
        `);

        render(root,
            <div>{keyedSpans('a', 'b', 'd', 'e')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const a2 = keyed2[0];
        const b2 = keyed2[1];
        const d2 = keyed2[2];
        const e2 = keyed2[3];

        expect(a1).to.equal(a2);
        expect(b1).to.equal(b2);
        expect(d1).to.equal(d2);
        expect(e1).to.equal(e2);

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>d</span>
                <span>e</span>
            </div>
        `);
    });

    it('should remove keyed nodes at both ends', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd', 'e')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const b1 = keyed1[1];
        const c1 = keyed1[2];
        const d1 = keyed1[3];

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
                <span>e</span>
            </div>
        `);
        
        render(root,
            <div>{keyedSpans('b', 'c', 'd')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const b2 = keyed2[0];
        const c2 = keyed2[1];
        const d2 = keyed2[2];

        expect(b1).to.equal(b2);
        expect(c1).to.equal(c2);
        expect(d1).to.equal(d2);

        expectHTML(`
            <div>
                <span>b</span>
                <span>c</span>
                <span>d</span>
            </div>
        `);
    });

    it('should move keyed nodes forward', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const a1 = keyed1[0];
        const b1 = keyed1[1];
        const c1 = keyed1[2];
        const d1 = keyed1[3];

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
            </div>
        `);
        
        render(root,
            <div>{keyedSpans('b', 'c', 'a', 'd')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const a2 = keyed2[2];
        const b2 = keyed2[0];
        const c2 = keyed2[1];
        const d2 = keyed2[3];

        expect(a1).to.equal(a2);
        expect(b1).to.equal(b2);
        expect(c1).to.equal(c2);
        expect(d1).to.equal(d2);

        expectHTML(`
            <div>
                <span>b</span>
                <span>c</span>
                <span>a</span>
                <span>d</span>
            </div>
        `);
    });

    it('should move keyed nodes to the end', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const a1 = keyed1[0];
        const b1 = keyed1[1];
        const c1 = keyed1[2];
        const d1 = keyed1[3];

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
            </div>
        `);
        
        render(root,
            <div>{keyedSpans('b', 'c', 'd', 'a')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const a2 = keyed2[3];
        const b2 = keyed2[0];
        const c2 = keyed2[1];
        const d2 = keyed2[2];

        expect(a1).to.equal(a2);
        expect(b1).to.equal(b2);
        expect(c1).to.equal(c2);
        expect(d1).to.equal(d2);

        expectHTML(`
            <div>
                <span>b</span>
                <span>c</span>
                <span>d</span>
                <span>a</span>
            </div>
        `);
    });

    it('should move keyed nodes backwards', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const a1 = keyed1[0];
        const b1 = keyed1[1];
        const c1 = keyed1[2];
        const d1 = keyed1[3];

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
            </div>
        `);
        
        render(root,
            <div>{keyedSpans('a', 'd', 'b', 'c')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const a2 = keyed2[0];
        const b2 = keyed2[2];
        const c2 = keyed2[3];
        const d2 = keyed2[1];

        expect(a1).to.equal(a2);
        expect(b1).to.equal(b2);
        expect(c1).to.equal(c2);
        expect(d1).to.equal(d2);

        expectHTML(`
            <div>
                <span>a</span>
                <span>d</span>
                <span>b</span>
                <span>c</span>
            </div>
        `);
    });

    it('should move keyed nodes to the beginning', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const a1 = keyed1[0];
        const b1 = keyed1[1];
        const c1 = keyed1[2];
        const d1 = keyed1[3];

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
            </div>
        `);
        
        render(root,
            <div>{keyedSpans('d', 'a', 'b', 'c')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const a2 = keyed2[1];
        const b2 = keyed2[2];
        const c2 = keyed2[3];
        const d2 = keyed2[0];

        expect(a1).to.equal(a2);
        expect(b1).to.equal(b2);
        expect(c1).to.equal(c2);
        expect(d1).to.equal(d2);

        expectHTML(`
            <div>
                <span>d</span>
                <span>a</span>
                <span>b</span>
                <span>c</span>
            </div>
        `);
    });

    it('should swap the first and last keyed nodes', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const a1 = keyed1[0];
        const b1 = keyed1[1];
        const c1 = keyed1[2];
        const d1 = keyed1[3];

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
            </div>
        `);
        
        render(root,
            <div>{keyedSpans('d', 'b', 'c', 'a')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const a2 = keyed2[3];
        const b2 = keyed2[1];
        const c2 = keyed2[2];
        const d2 = keyed2[0];

        expect(a1).to.equal(a2);
        expect(b1).to.equal(b2);
        expect(c1).to.equal(c2);
        expect(d1).to.equal(d2);

        expectHTML(`
            <div>
                <span>d</span>
                <span>b</span>
                <span>c</span>
                <span>a</span>
            </div>
        `);
    });

    it('should reverse the order of keyed nodes', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd', 'e', 'f', 'g')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const a1 = keyed1[0];
        const b1 = keyed1[1];
        const c1 = keyed1[2];
        const d1 = keyed1[3];
        const e1 = keyed1[4];
        const f1 = keyed1[5];
        const g1 = keyed1[6];

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
                <span>e</span>
                <span>f</span>
                <span>g</span>
            </div>
        `);
        
        render(root,
            <div>{keyedSpans('g', 'f', 'e', 'd', 'c', 'b', 'a')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const a2 = keyed2[6];
        const b2 = keyed2[5];
        const c2 = keyed2[4];
        const d2 = keyed2[3];
        const e2 = keyed2[2];
        const f2 = keyed2[1];
        const g2 = keyed2[0];

        expect(a1).to.equal(a2);
        expect(b1).to.equal(b2);
        expect(c1).to.equal(c2);
        expect(d1).to.equal(d2);
        expect(e1).to.equal(e2);
        expect(f1).to.equal(f2);
        expect(g1).to.equal(g2);

        expectHTML(`
            <div>
                <span>g</span>
                <span>f</span>
                <span>e</span>
                <span>d</span>
                <span>c</span>
                <span>b</span>
                <span>a</span>
            </div>
        `);
    });

    it('should support reordering, addition, and removal of keyed nodes', () => {
        render(root,
            <div>{keyedSpans('a', 'b', 'c', 'd', 'e', 'f', 'g')}</div>
        );

        const keyed1 = Array.from(root.getElementsByTagName('span'));
        const a1 = keyed1[0];
        const c1 = keyed1[2];
        const d1 = keyed1[3];
        const f1 = keyed1[5];

        expectHTML(`
            <div>
                <span>a</span>
                <span>b</span>
                <span>c</span>
                <span>d</span>
                <span>e</span>
                <span>f</span>
                <span>g</span>
            </div>
        `);
        
        render(root,
            <div>{keyedSpans('c', 'j', 'a', 'i', 'f', 'd', 'h')}</div>
        );

        const keyed2 = Array.from(root.getElementsByTagName('span'));
        const a2 = keyed2[2];
        const c2 = keyed2[0];
        const d2 = keyed2[5];
        const f2 = keyed2[4];

        expect(a1).to.equal(a2);
        expect(c1).to.equal(c2);
        expect(d1).to.equal(d2);
        expect(f1).to.equal(f2);

        expectHTML(`
            <div>
                <span>c</span>
                <span>j</span>
                <span>a</span>
                <span>i</span>
                <span>f</span>
                <span>d</span>
                <span>h</span>
            </div>
        `);
    });

    it('should support reordering, addition, and removal of mixed keyed/non-keyed nodes', () => {
        render(root,
            <section>
                <div key="a"></div>
                <span></span>
                <div key="b"></div>
                <span></span>
                <div key="c"></div>
                <span></span>
                <span></span>
                <div key="d"></div>
                <div key="e"></div>
            </section>
        );

        expectHTML(`
            <section>
                <div></div>
                <span></span>
                <div></div>
                <span></span>
                <div></div>
                <span></span>
                <span></span>
                <div></div>
                <div></div>
            </section>
        `);

        const keyed1 = Array.from(root.getElementsByTagName('div'));
        const a1 = keyed1[0];
        const b1 = keyed1[1];
        const d1 = keyed1[3];

        render(root,
            <section>
                <span></span>
                <div key="d"></div>
                <span></span>
                <div key="f"></div>
                <span></span>
                <div key="a"></div>
                <div key="b"></div>
                <em></em>
                <span></span>
                <div key="g"></div>
            </section>
        );

        const keyed2 = Array.from(root.getElementsByTagName('div'));
        const a2 = keyed2[2];
        const b2 = keyed2[3];
        const d2 = keyed2[0];

        expect(a1).to.equal(a2);
        expect(b1).to.equal(b2);
        expect(d1).to.equal(d2);

        expectHTML(`
            <section>
                <span></span>
                <div></div>
                <span></span>
                <div></div>
                <span></span>
                <div></div>
                <div></div>
                <em></em>
                <span></span>
                <div></div>
            </section>
        `);
    });

    it('should support root keyed nodes', () => {
        render(root, [
            <div key="a"></div>,
            <div key="b"></div>,
            <span></span>,
            <div key="c"></div>,
            <span></span>,
            <span></span>,
            <div key="d"></div>
        ]);

        expectHTML(`
            <div></div>
            <div></div>
            <span></span>
            <div></div>
            <span></span>
            <span></span>
            <div></div>
        `);

        const keyed1 = Array.from(root.getElementsByTagName('div'));
        const a1 = keyed1[0];
        const c1 = keyed1[2];
        const d1 = keyed1[3];

        render(root, [
            <span></span>,
            <div key="c"></div>,
            <span></span>,
            <div key="d"></div>,
            <div key="a"></div>,
            <span></span>,
            <em></em>
        ]);

        const keyed2 = Array.from(root.getElementsByTagName('div'));
        const a2 = keyed2[2];
        const c2 = keyed2[0];
        const d2 = keyed2[1];

        expect(a1).to.equal(a2);
        expect(c1).to.equal(c2);
        expect(d1).to.equal(d2);

        expectHTML(`
            <span></span>
            <div></div>
            <span></span>
            <div></div>
            <div></div>
            <span></span>
            <em></em>
        `);
    });

    it('should maintain focus when moving the input around', () => {
        const div = render(root,
            <div>
                <input type="text" key="focused" />
                <span></span>
                <span></span>
            </div>
        );

        const input = div.querySelector('input');
        input.value = 'foo bar baz';
		input.focus();
		input.setSelectionRange(2, 5);

        render(root, 
            <div>
                <span></span>
                <span></span>
                <input type="text" key="focused" />
            </div>
        );
        
        expect(document.activeElement).to.equal(input);
		expect(input.selectionStart).to.equal(2);
		expect(input.selectionEnd).to.equal(5);
    });

    it('should maintain focus when adding sibling nodes around the input', () => {
        const div = render(root,
            <div>
                <input type="text" key="focused" />
            </div>
        );

        const input = div.querySelector('input');
        input.value = 'foo bar baz';
		input.focus();
		input.setSelectionRange(2, 5);

        render(root, 
            <div>
                <span></span>
                <span></span>
                <input type="text" key="focused" />
                <span></span>
                <span></span>
            </div>
        );
        
        expect(document.activeElement).to.equal(input);
		expect(input.selectionStart).to.equal(2);
		expect(input.selectionEnd).to.equal(5);
    });
});
