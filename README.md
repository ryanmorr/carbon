# carbon

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> The building blocks of UI

## Install

Download the [CJS](https://github.com/ryanmorr/carbon/raw/master/dist/carbon.cjs.js), [ESM](https://github.com/ryanmorr/carbon/raw/master/dist/carbon.esm.js), [UMD](https://github.com/ryanmorr/carbon/raw/master/dist/carbon.umd.js) versions or install via NPM:

``` sh
npm install @ryanmorr/carbon
```

## Usage

Create a virtual DOM node:

``` javascript
import { h } from '@ryanmorr/carbon';

const vnode = h('div', {id: 'foo', class: 'bar'},
    h('h1', 'Hello World'),
    h('p', 'nisl suscipit adipiscing bibendum est ultricies integer quis auctor elit')
);
```

Render an element's content by providing the parent DOM element as the first argument and ethier a virtual DOM node or an array of virtual DOM nodes as the second argument. The root DOM node(s) of the newly created DOM tree is returned:

``` javascript
import { render } from '@ryanmorr/carbon';

const element = render(parentElement,
    h('div', 
        h('h1', 'Hello World'),
        h('p', 'mi bibendum neque egestas congue quisque egestas diam in arcu')
    )
);

const elements = render(parentElement, [
    h('div', 'foo'),
    h('div', 'bar'),
    h('div', 'baz')
]);
```

Supports patching of attributes and properties, including CSS styles as a string or object and event listeners indicated by a prefix of "on":

``` javascript
render(parentElement,
    h('div', {
        class: 'foo bar',
        style: 'width: 100px; height: 100px; background-color: red',
        onClick: (e) => handleEvent(e)
    })
);
```

Supports keyed nodes to efficiently move elements instead of re-creating them:

``` javascript
render(parentElement,
    h('ul', null, 
        h('li', {key: 'foo'}, 'foo'),
        h('li', {key: 'bar'}, 'bar'),
        h('li', {key: 'baz'}, 'baz'),
        h('li', {key: 'qux'}, 'qux')
    )
);
```

Supports SVG elements:

``` javascript
render(parentElement,
    h('svg', {width: 200, height: 200}, 
        h('circle', {cx: 50, cy: 50, r: 40, stroke: "green" stroke-width: 4, fill: "yellow"})
    )
);
```

Supports basic [JSX](https://reactjs.org/docs/introducing-jsx.html) syntax (not components):

``` javascript
render(parentElement,
    <div>
        <h1>{title}</h1>
        <button onClick={handleEvent}>Submit</button>
    </div>
);
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/carbon
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fcarbon.svg
[build-url]: https://travis-ci.org/ryanmorr/carbon
[build-image]: https://travis-ci.org/ryanmorr/carbon.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE
