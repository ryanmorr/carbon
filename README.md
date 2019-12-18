# velvet

[![Version Badge][version-image]][project-url]
[![Build Status][build-image]][build-url]
[![License][license-image]][license-url]

> A thin, silky smooth view layer for declarative web interfaces

## Install

Download the [CJS](https://github.com/ryanmorr/velvet/raw/master/dist/velvet.cjs.js), [ESM](https://github.com/ryanmorr/velvet/raw/master/dist/velvet.esm.js), [UMD](https://github.com/ryanmorr/velvet/raw/master/dist/velvet.umd.js) versions or install via NPM:

``` sh
npm install @ryanmorr/velvet
```

## Usage

Create a virtual DOM tree using the hyperscript standard:

``` javascript
import { h } from '@ryanmorr/velvet';

const vtree = h('div', {id: 'foo', class: 'bar'},
    h('h1', null, 'Hello World'),
    h('p', null, 'Here is some content')
);
```


Render an element's content by providing the parent DOM element as the first argument and a virtual DOM tree as the second argument. The root DOM element of the newly patched DOM tree is returned:

``` javascript
import { render } from '@ryanmorr/velvet';

const element = render(parentElement,
    h('div', null, 
        h('h1', null, 'Hello World'),
        h('p', null, 'Here is some content')
    )
);
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

Supports keyed child nodes to efficiently move an element instead of destroying and re-creating it:

``` javascript
render(parentElement,
    h('section', null, 
        h('div', {key: 'foo'}, 'foo'),
        h('div', {key: 'bar'}, 'bar'),
        h('div', {key: 'baz'}, 'baz'),
        h('div', {key: 'qux'}, 'qux')
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

[project-url]: https://github.com/ryanmorr/velvet
[version-image]: https://badge.fury.io/gh/ryanmorr%2Fvelvet.svg
[build-url]: https://travis-ci.org/ryanmorr/velvet
[build-image]: https://travis-ci.org/ryanmorr/velvet.svg
[license-image]: https://img.shields.io/badge/license-Unlicense-blue.svg
[license-url]: UNLICENSE
