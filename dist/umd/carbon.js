/*! @ryanmorr/carbon v0.2.2 | https://github.com/ryanmorr/carbon */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).carbon={})}(this,(function(e){"use strict";const n=1,t=3;function o(...e){return Object.assign({},...e)}function r(e){return e.attributes&&e.attributes.key||null}function l(e){return null!=e&&"boolean"!=typeof e}function i(e,n){return e.nodeName===n.nodeName&&r(e)===r(n)}function s(e){if("string"==typeof e)return e;let n="";if(Array.isArray(e)&&e.length>0)for(let t,o=0,r=e.length;o<r;o++)""!==(t=s(e[o]))&&(n+=(n&&" ")+t);else for(const t in e)e[t]&&(n+=(n&&" ")+t);return n}function u(e,n,t){const o={};for(let l=n;l<=t;++l){const n=e[l],t=n&&r(n);null!=t&&(o[t]=l)}return o}function f(e,t,o,r=null){return{nodeType:n,node:r,nodeName:e,attributes:t,children:o}}function c(e,n=null){return{nodeType:t,node:n,text:e}}function d(e){const n=typeof e;return"boolean"===n?null:"string"===n||"number"===n?c(e):Array.isArray(e)?function(e){for(let n=0;n<e.length;){const t=e[n];Array.isArray(t)?t.length>0?(t.unshift(n,1),e.splice.apply(e,t),t.splice(0,2)):e.splice(n,1):n++}return e}(e).reduce(((e,n)=>(l(n)&&e.push(d(n)),e)),[]):e}function a(e,n){if(3===e.nodeType)return c(e.data,e);if(1===e.nodeType){if(n){const t=n.map((e=>e(null)));t&&t.forEach((n=>n&&n(e)))}return f(e.nodeName.toLowerCase(),Array.from(e.attributes).reduce(((n,t)=>{const o=t.name,r=t.value;return"style"!==o&&(n[o]=r),"key"===o&&e.removeAttribute("key"),n}),{}),Array.from(e.childNodes).map((e=>a(e,n))),e)}}const y=new Map;function p(e,n,o){let r;if(e.nodeType===t)r=document.createTextNode(e.text);else{let t;o&&(t=o.map((n=>n(e))));const l=e.nodeName;r=(n=n||"svg"===l)?document.createElementNS("http://www.w3.org/2000/svg",l):document.createElement(l);const i=e.attributes;Object.keys(i).forEach((e=>m(r,e,null,i[e],n))),e.children.forEach((e=>r.appendChild(p(e,n,o)))),t&&t.forEach((e=>e&&e(r)))}return e.node=r,r}function m(e,n,t,r,l){if("key"!==n&&"children"!==n)if(l?"className"===n&&(n="class"):"class"===n&&(n="className"),"class"!==n&&"className"!==n||(r=s(r)),"style"===n)if("string"==typeof r)e.style.cssText=r;else for(const n in o(r,t)){const t=null==r||null==r[n]?"":r[n];n.includes("-")?e.style.setProperty(n,t):e.style[n]=t}else!n.startsWith("on")||"function"!=typeof t&&"function"!=typeof r?!l&&"list"!==n&&"form"!==n&&n in e?e[n]=null==r?"":r:null==r||!1===r?e.removeAttribute(n):"function"!=typeof r&&e.setAttribute(n,r):(n=n.slice(2),r&&e.addEventListener(n,r),t&&e.removeEventListener(n,t))}function h(e,n,t,o,l){let s,f=0,c=n.length-1,d=n[0],a=n[c],y=0,m=t.length-1,h=t[0],b=t[m];for(;f<=c&&y<=m;)if(d)if(a)if(i(d,h))g(e,d,h,o,l),d=n[++f],h=t[++y];else if(i(a,b))g(e,a,b,o,l),a=n[--c],b=t[--m];else if(i(d,b))g(e,d,b,o,l),e.insertBefore(d.node,a.node.nextSibling),d=n[++f],b=t[--m];else if(i(a,h))g(e,a,h,o,l),e.insertBefore(a.node,d.node),a=n[--c],h=t[++y];else{s||(s=u(n,f,c));let i=r(h),a=i?s[i]:null;if(null==a)e.insertBefore(p(h,o,l),d.node),h=t[++y];else{let r=n[a];g(e,r,h,o,l),n[a]=void 0,e.insertBefore(r.node,d.node),h=t[++y]}}else a=n[--c];else d=n[++f];if(f>c){let n=t[m+1]?t[m+1].node:null;for(let r=y;r<=m;r++)e.insertBefore(p(t[r],o,l),n)}else if(y>m)for(let t=f;t<=c;t++){let o=n[t];o&&o.node&&e.removeChild(o.node)}return t}function g(e,n,r,l,i){if(n===r)return null==n?null:n.node;if(null==n)return e.appendChild(p(r,l,i));let s=n.node;if(null==r)return e.removeChild(s)&&null;if(n.nodeType===t&&r.nodeType===t)n.text!==r.text&&(s.data=r.text);else if(f=n,(u=r).nodeType!==f.nodeType||u.nodeType===t&&u.text!==f.text||u.nodeName!==f.nodeName){const n=p(r,l,i);e.replaceChild(n,s),s=n}else{l=l||"svg"===r.nodeName;const e=document.activeElement,t=n.attributes,u=r.attributes;for(const e in o(u,t))("value"===e||"selected"===e||"checked"===e?s[e]:t[e])!==u[e]&&m(s,e,t[e],u[e],l);h(s,n.children,r.children,l,i),e.focus()}var u,f;return r.node=s,s}e.h=function(e,n,...t){return n&&!n.nodeType&&"function"!=typeof n.concat||(t=[].concat(n||[],...t),n={}),f(e,n||{},d(t))},e.render=function(e,n,t){n=d(n);let o=y.get(e);o||(o=e.childNodes.length>0?Array.from(e.childNodes).map((e=>a(e,t))):null);const r=Array.isArray(o),i=Array.isArray(n);if(y.set(e,n),r||i){o=(r?o:[o]).filter(l);const s=h(e,o,n=(i?n:[n]).filter(l),null,t);return 0===s.length?null:1===s.length?s[0].node:s.map((e=>e.node))}return g(e,o,n,null,t)}}));
