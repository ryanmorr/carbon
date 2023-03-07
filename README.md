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

Carbon is a tiny, low-level, no-nonsense, but extendable virtual DOM implementation. It provides only efficient DOM rendering, but with the ability to add middleware to expand functionality:

```javascript
import { h, render } from '@ryanmorr/carbon';

const element = render(parentElement,
    h('div', 
        h('h1', 'Hello World'),
        h('p', 'mi bibendum neque egestas congue quisque egestas diam in arcu')
    )
);
```

Supports patching of attributes and properties, including CSS styles as a string or object and event listeners indicated by a prefix of "on":

```javascript
render(parentElement,
    h('div', {
        class: ['foo, bar'],
        style: {width: '100px', height: '100px', backgroundColor: 'red'},
        onclick: (e) => console.log('clicked')
    })
);
```

Supports keyed nodes to efficiently move elements instead of unnecessarily destroying and re-creating them:

```javascript
render(parentElement,
    h('ul', null, 
        h('li', {key: 'foo'}, 'foo'),
        h('li', {key: 'bar'}, 'bar'),
        h('li', {key: 'baz'}, 'baz'),
        h('li', {key: 'qux'}, 'qux')
    )
);
```

Supports element middleware for adding functionality, such as components or refs:

```javascript
const middleware = (vnode) => {
    // Alter the virtual node before element creation

    return (element) => {
        // Gain access to the DOM element after creation
    };
};

render(parentElement, h('div'), [middleware]);
```

Supports SVG elements:

```javascript
render(parentElement,
    h('svg', {width: 200, height: 200}, 
        h('circle', {cx: 50, cy: 50, r: 40, fill: "yellow"})
    )
);
```

Supports [JSX](https://reactjs.org/docs/introducing-jsx.html) syntax:

```javascript
render(parentElement,
    <div>
        <h1>{title}</h1>
        <button onclick={handleEvent}>Click Me</button>
    </div>
);
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/carbon
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/carbon?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/carbon/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/carbon/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/carbon?color=blue&style=flat-square
[license-url]: UNLICENSE
