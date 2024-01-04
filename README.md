# carbon

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> The building blocks of UI

## Install

Download the [CJS](https://github.com/ryanmorr/carbon/raw/master/dist/cjs/carbon.js), [ESM](https://github.com/ryanmorr/carbon/raw/master/dist/esm/carbon.js), [UMD](https://github.com/ryanmorr/carbon/raw/master/dist/umd/carbon.js) versions or install via NPM:

```sh
npm install @ryanmorr/carbon
```

## Usage

Carbon is a tiny, low-level, no-nonsense, virtual DOM implementation that offers robust and efficient DOM rendering:

```javascript
import { h, text, render } from '@ryanmorr/carbon';

const setCount = (count) => {
    render(document.body,
        h('div', [
            h('p', text('Count: ' + count)),
            h('button', {onclick: () => setCount(count + 1)}, text('Increment')),
        ])
    );
};

setCount(0);
```

Render a single element and return the element reference:

```javascript
const element = render(parent, 
    h('div')
);
```

Render an array of elements and return an array of the element references:

```javascript
const elements = render(parent, [
    h('span'),
    h('span'),
    h('span')
]);
```

Set attributes using key/value pairs of an object:

```javascript
render(parent,
    h('img', {
        src: '/path/to/file',
        alt: 'Image description'
    })
);
```

Set an element class name with a string, array, or object:

```javascript
render(parent, [
    h('div', {class: 'foo'}),
    h('div', {class: ['foo', 'bar']}),
    h('div', {class: {foo: true, bar: false}})
]);
```

Set CSS styles with a string or object:

```javascript
render(parent, [
    h('div', {style: 'width: 100px; height: 100px; background-color: red'}),
    h('div', {style: {width: '100px', height: '100px', backgroundColor: 'red'}})
]);
```

Set CSS custom properties:

```javascript
render(parent,
    h('section', {style: {'--color': 'red'}},
        h('p', {color: 'var(--color)'}, 'Hello World'),
    )
);
```

Set event listeners as attributes indicated by a prefix of "on":

```javascript
render(parent,
    h('div', {
        onclick: (e) => console.log('clicked')
    })
);
```

Use the `text` function to explicitly create virtual text nodes:

```javascript
render(parent,
    h('h1', text('Hello World'))
);
```

Add a unique `key` to sibling elements to facilitate efficient reordering:

```javascript
render(parent,
    h('ul', 
        h('li', {key: 'foo'}, 'foo'),
        h('li', {key: 'bar'}, 'bar'),
        h('li', {key: 'baz'}, 'baz'),
        h('li', {key: 'qux'}, 'qux')
    )
);
```

Supports SVG elements:

```javascript
render(parent,
    h('svg', {width: 200, height: 200}, 
        h('circle', {cx: 50, cy: 50, r: 40, fill: 'yellow'})
    )
);
```

Supports stateless functional components:

```javascript
const Component = ({id, children}) => {
    return h('div', {id}, children);
};

render(parent, 
    h(Component, {id: 'foo'}, text('Hello World'))
);
```

Supports [JSX](https://react.dev/learn/writing-markup-with-jsx) syntax:

```javascript
render(parent,
    <div>
        <h1>{title}</h1>
        <button onclick={handleEvent}>Click Me</button>
    </div>
);
```

Carbon will automatically recycle and patch over pre-existing DOM nodes, such as those generated from server-side rendered HTML.

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/carbon
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/carbon?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/carbon/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/carbon/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/carbon?color=blue&style=flat-square
[license-url]: UNLICENSE
