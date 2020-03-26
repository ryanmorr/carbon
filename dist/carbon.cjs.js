/*! @ryanmorr/carbon v0.1.0 | https://github.com/ryanmorr/carbon */'use strict';function _typeof2(a){return _typeof2="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof2(a)}Object.defineProperty(exports,"__esModule",{value:!0});function _typeof(a){return _typeof="function"==typeof Symbol&&"symbol"===_typeof2(Symbol.iterator)?function(a){return _typeof2(a)}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":_typeof2(a)},_typeof(a)}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_nonIterableSpread()}function _arrayWithoutHoles(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}}function _iterableToArray(a){if(Symbol.iterator in Object(a)||"[object Arguments]"===Object.prototype.toString.call(a))return Array.from(a)}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}var ELEMENT_NODE=1,TEXT_NODE=3;function flatten(a){for(var b,c=0;c<a.length;)b=a[c],Array.isArray(b)?0<b.length?(b.unshift(c,1),a.splice.apply(a,b),b.splice(0,2)):a.splice(c,1):c++;return a}function createClass(a){var b="";if("string"==typeof a)return a;if(Array.isArray(a)&&0<a.length)for(var c,d=0,e=a.length;d<e;d++)""!==(c=createClass(a[d]))&&(b+=(b&&" ")+c);else for(var f in a)a[f]&&(b+=(b&&" ")+f);return b}function merge(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];return Object.assign.apply(Object,[{}].concat(b))}function getKey(a){return a.attributes&&a.attributes.key||null}function isValidNodeType(a){return null!=a&&"boolean"!=typeof a}function isSameNode(c,a){return c.nodeName===a.nodeName&&getKey(c)===getKey(a)}function isSameNodeType(c,a){return!(c.nodeType!==a.nodeType)&&(c.nodeType!==TEXT_NODE||c.text===a.text)&&!(c.nodeName!==a.nodeName)}function createKeyToIndexMap(a,b,c){for(var d={},e=b;e<=c;++e){var f=a[e],g=f&&getKey(f);null!=g&&(d[g]=e)}return d}function getVNode(a){var b=_typeof(a);return"boolean"===b?null:"string"===b||"number"===b?createTextVNode(a):Array.isArray(a)?flatten(a).reduce(function(a,b){return isValidNodeType(b)&&a.push(getVNode(b)),a},[]):a}function recycle(a){return 3===a.nodeType?createTextVNode(a.data,a):1===a.nodeType?createVNode(a.nodeName.toLowerCase(),Array.from(a.attributes).reduce(function(b,c){var d=c.name,e=c.value;return"style"!==d&&(b[d]=e),"key"===d&&a.removeAttribute("key"),b},{}),Array.from(a.childNodes).map(recycle),a):void 0}function createVNode(a,b,c){var d=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{nodeType:ELEMENT_NODE,node:d,nodeName:a,attributes:b,children:c}}function createTextVNode(a){var b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:null;return{nodeType:TEXT_NODE,node:b,text:a}}function createElement(a){var b,c=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1];if(a.nodeType===TEXT_NODE)b=document.createTextNode(a.text);else{var d=a.nodeName;c=c||"svg"===d,b=c?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d);var e=a.attributes;Object.keys(e).forEach(function(a){return patchAttribute(b,a,null,e[a],c)}),a.children.forEach(function(a){return b.appendChild(createElement(a,c))})}return a.node=b,b}function patchAttribute(a,b,c,d){var e=!!(4<arguments.length&&void 0!==arguments[4])&&arguments[4];if("key"!==b&&"children"!==b)if(e?"className"===b&&(b="class"):"class"===b&&(b="className"),("class"===b||"className"===b)&&(d=createClass(d)),"style"!==b)b.startsWith("on")&&("function"==typeof c||"function"==typeof d)?(b=b.slice(2).toLowerCase(),d&&a.addEventListener(b,d),c&&a.removeEventListener(b,c)):!e&&"list"!==b&&"form"!==b&&b in a?a[b]=null==d?"":d:null==d||!1===d?a.removeAttribute(b):"function"!=typeof d&&a.setAttribute(b,d);else if("string"==typeof d)a.style.cssText=d;else for(var f in merge(d,c)){var g=null==d||null==d[f]?"":d[f];f.includes("-")?a.style.setProperty(f,g):a.style[f]=g}}function patchChildren(a,b,c,d){for(var e,f=0,g=b.length-1,h=b[0],j=b[g],k=0,l=c.length-1,m=c[0],n=c[l];f<=g&&k<=l;)if(!h)h=b[++f];else if(!j)j=b[--g];else if(isSameNode(h,m))patchElement(a,h,m,d),h=b[++f],m=c[++k];else if(isSameNode(j,n))patchElement(a,j,n,d),j=b[--g],n=c[--l];else if(isSameNode(h,n))patchElement(a,h,n,d),a.insertBefore(h.node,j.node.nextSibling),h=b[++f],n=c[--l];else if(isSameNode(j,m))patchElement(a,j,m,d),a.insertBefore(j.node,h.node),j=b[--g],m=c[++k];else{e||(e=createKeyToIndexMap(b,f,g));var o=getKey(m),p=o?e[o]:null;if(null==p)a.insertBefore(createElement(m,d),h.node),m=c[++k];else{var q=b[p];patchElement(a,q,m,d),b[p]=void 0,a.insertBefore(q.node,h.node),m=c[++k]}}if(f>g)for(var r=c[l+1]?c[l+1].node:null,s=k;s<=l;s++)a.insertBefore(createElement(c[s],d),r);else if(k>l)for(var t,u=f;u<=g;u++)t=b[u],t&&t.node&&a.removeChild(t.node);return c}function patchElement(a,b,c){var d=!!(3<arguments.length&&void 0!==arguments[3])&&arguments[3];if(b===c)return null==b?null:b.node;if(null==b)return a.appendChild(createElement(c,d));var e=b.node;if(null==c)return a.removeChild(e)&&null;if(b.nodeType===TEXT_NODE&&c.nodeType===TEXT_NODE)b.text!==c.text&&(e.data=c.text);else if(!isSameNodeType(c,b)){var f=createElement(c,d);a.replaceChild(f,e),e=f}else{d=d||"svg"===c.nodeName;var g=document.activeElement,h=b.attributes,i=c.attributes;for(var j in merge(i,h))("value"==j||"selected"===j||"checked"===j?e[j]:h[j])!==i[j]&&patchAttribute(e,j,h[j],i[j],d);patchChildren(e,b.children,c.children,d),g.focus()}return c.node=e,e}function h(a,b){for(var c=arguments.length,d=Array(2<c?c-2:0),e=2;e<c;e++)d[e-2]=arguments[e];if(!b||b.nodeType||"function"==typeof b.concat){var f;d=(f=[]).concat.apply(f,[b||[]].concat(_toConsumableArray(d))),b={}}return createVNode(a,b||{},getVNode(d))}function render(a,b){b=getVNode(b);var c=a.vdom||(0<a.childNodes.length?Array.from(a.childNodes).map(recycle):null),d=Array.isArray(c),e=Array.isArray(b);if(a.vdom=b,d||e){c=(d?c:[c]).filter(isValidNodeType),b=(e?b:[b]).filter(isValidNodeType);var f=patchChildren(a,c,b);return 0===f.length?null:1===f.length?f[0].node:f.map(function(a){return a.node})}return patchElement(a,c,b)}exports.h=h,exports.render=render;