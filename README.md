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

Carbon is a tiny, low-level, no-nonsense, virtual DOM implementation. No components, no hooks, no special functionality, just efficient DOM rendering:

``` javascript
import { h, render } from '@ryanmorr/carbon';

const element = render(parentElement,
    h('div', 
        h('h1', 'Hello World'),
        h('p', 'mi bibendum neque egestas congue quisque egestas diam in arcu')
    )
);
```

Supports patching of attributes and properties, including CSS styles as a string or object and event listeners indicated by a prefix of "on":

``` javascript
render(parentElement,
    h('div', {
        class: 'foo bar',
        style: 'width: 100px; height: 100px; background-color: red',
        onClick: (e) => console.log('clicked')
    })
);
```

Supports keyed nodes to efficiently move elements instead of unnecessarily destroying and re-creating them:

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
        h('circle', {cx: 50, cy: 50, r: 40, fill: "yellow"})
    )
);
```

Supports [JSX](https://reactjs.org/docs/introducing-jsx.html) syntax:

``` javascript
render(parentElement,
    <div>
        <h1>{title}</h1>
        <button onClick={handleEvent}>Click Me</button>
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
