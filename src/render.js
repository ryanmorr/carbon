import { TEXT_NODE } from './constants';
import { recycle, getVNode } from './h';
import { isSameNode, isSameNodeType, isValidNodeType, merge, createClass, getKey, createKeyToIndexMap } from './util';

const cache = new Map();

function createElement(vnode, isSvg, middleware) {
    let node;
    if (vnode.nodeType === TEXT_NODE) {
        node = document.createTextNode(vnode.text);
    } else {
        let callbacks;
        if (middleware) {
            callbacks = middleware.map((callback) => callback(vnode));
        }
        const nodeName = vnode.nodeName;
        isSvg = (isSvg || nodeName === 'svg');
        node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
        const attributes = vnode.attributes;
        Object.keys(attributes).forEach((name) => patchAttribute(node, name, null, attributes[name], isSvg));
        vnode.children.forEach((vchild) => node.appendChild(createElement(vchild, isSvg, middleware)));
        if (callbacks) {
            callbacks.forEach((callback) => callback && callback(node));
        }
    }
    vnode.node = node;
    return node;
}

function setStyle(element, name, value) {
    if (name.startsWith('--')) {
        element.style.setProperty(name, value == null ? '' : value);
    } else if (value == null) {
        element.style[name] = '';
    } else {
        element.style[name] = value;
    }
}

function patchAttribute(element, name, prevVal, nextVal, isSvg) {
    if (name === 'key' || name === 'children') {
        return;
    }
    if (name === 'style') {
        if (typeof nextVal === 'string') {
            element.style.cssText = nextVal;
        } else {
            if (typeof prevVal === 'string') {
				element.style.cssText = prevVal = '';
			}
            for (const key in merge(nextVal, prevVal)) {
                setStyle(element, key, nextVal == null ? '' : nextVal[key]);
            }
        }
    } else if (name.startsWith('on') && (typeof prevVal === 'function' || typeof nextVal === 'function')) {
        name = (name.toLowerCase() in element) ? name.toLowerCase().slice(2) : name.slice(2);
        if (nextVal) {
            element.addEventListener(name, nextVal);
        }
        if (prevVal) {
            element.removeEventListener(name, prevVal);
        }
    } else if (typeof nextVal !== 'function') {
        if (nextVal != null && (name === 'class' || name === 'className')) {
            nextVal = createClass(nextVal);
        }
        if (!isSvg && name === 'class') {
            name = 'className';
        }
        if (
            !isSvg &&
            name !== 'width' &&
            name !== 'height' &&
            name !== 'href' &&
            name !== 'list' &&
            name !== 'form' &&
            name !== 'tabIndex' &&
            name !== 'download' &&
            name in element
        ) {
            try {
                element[name] = nextVal == null ? '' : nextVal;
                return;
            } catch (e) {} // eslint-disable-line no-empty
        }
        if (nextVal != null && (nextVal !== false || name.indexOf('-') != -1)) {
            element.setAttribute(name, nextVal);
        } else {
            element.removeAttribute(name);
        }
    } 
}

function patchChildren(parent, prevChildren, nextChildren, isSvg, middleware) {
    let prevStartIndex = 0;
    let prevEndIndex = prevChildren.length - 1;
    let prevStartChild = prevChildren[0];
    let prevEndChild = prevChildren[prevEndIndex];
    let nextStartIndex = 0;
    let nextEndIndex = nextChildren.length - 1;
    let nextStartChild = nextChildren[0];
    let nextEndChild = nextChildren[nextEndIndex];
    let prevKeyToIdx;
    while (prevStartIndex <= prevEndIndex && nextStartIndex <= nextEndIndex) {
        if (!prevStartChild) {
            prevStartChild = prevChildren[++prevStartIndex];
        } else if (!prevEndChild) {
            prevEndChild = prevChildren[--prevEndIndex];
        } else if (isSameNode(prevStartChild, nextStartChild)) {
            patchElement(parent, prevStartChild, nextStartChild, isSvg, middleware);
            prevStartChild = prevChildren[++prevStartIndex];
            nextStartChild = nextChildren[++nextStartIndex];
        } else if (isSameNode(prevEndChild, nextEndChild)) {
            patchElement(parent, prevEndChild, nextEndChild, isSvg, middleware);
            prevEndChild = prevChildren[--prevEndIndex];
            nextEndChild = nextChildren[--nextEndIndex];
        } else if (isSameNode(prevStartChild, nextEndChild)) {
            patchElement(parent, prevStartChild, nextEndChild, isSvg, middleware);
            parent.insertBefore(prevStartChild.node, prevEndChild.node.nextSibling);
            prevStartChild = prevChildren[++prevStartIndex];
            nextEndChild = nextChildren[--nextEndIndex];
        } else if (isSameNode(prevEndChild, nextStartChild)) {
            patchElement(parent, prevEndChild, nextStartChild, isSvg, middleware);
            parent.insertBefore(prevEndChild.node, prevStartChild.node);
            prevEndChild = prevChildren[--prevEndIndex];
            nextStartChild = nextChildren[++nextStartIndex];
        } else {
            if (!prevKeyToIdx) {
                prevKeyToIdx = createKeyToIndexMap(prevChildren, prevStartIndex, prevEndIndex);
            }
            let key = getKey(nextStartChild);
            let prevIndex = key ? prevKeyToIdx[key] : null;
            if (prevIndex == null) {
                parent.insertBefore(createElement(nextStartChild, isSvg, middleware), prevStartChild.node);
                nextStartChild = nextChildren[++nextStartIndex];
            } else {
                let prevChildToMove = prevChildren[prevIndex];
                patchElement(parent, prevChildToMove, nextStartChild, isSvg, middleware);
                prevChildren[prevIndex] = undefined;
                parent.insertBefore(prevChildToMove.node, prevStartChild.node);
                nextStartChild = nextChildren[++nextStartIndex];
            }
        }
    }
    if (prevStartIndex > prevEndIndex) {
        let subsequentElement = nextChildren[nextEndIndex + 1] ? nextChildren[nextEndIndex + 1].node : null;
        for (let i = nextStartIndex; i <= nextEndIndex; i++) {
            parent.insertBefore(createElement(nextChildren[i], isSvg, middleware), subsequentElement);
        }
    } else if (nextStartIndex > nextEndIndex) {
        for (let i = prevStartIndex; i <= prevEndIndex; i++) {
            let child = prevChildren[i];
            if (child && child.node) {
                parent.removeChild(child.node);
            }
        }
    }
    return nextChildren;
}

function patchElement(parent, prevVNode, nextVNode, isSvg, middleware) {
    if (prevVNode === nextVNode) {
        if (prevVNode == null) {
            return null;
        }
        return prevVNode.node;
    }
    if (prevVNode == null) {
        return parent.appendChild(createElement(nextVNode, isSvg, middleware));
    }
    let element = prevVNode.node;
    if (nextVNode == null) {
        return parent.removeChild(element) && null;
    }
    if (prevVNode.nodeType === TEXT_NODE && nextVNode.nodeType === TEXT_NODE) {
        if (prevVNode.text !== nextVNode.text) {
            element.data = nextVNode.text;
        }
    } else if (!isSameNodeType(nextVNode, prevVNode)) {
        const nextElement = createElement(nextVNode, isSvg, middleware);
        parent.replaceChild(nextElement, element);
        element = nextElement;
    } else {
        isSvg = isSvg || nextVNode.nodeName === 'svg';
        const activeElement = document.activeElement;
        const prevVAttrs = prevVNode.attributes;
        const nextVAttrs = nextVNode.attributes;
        for (const name in merge(nextVAttrs, prevVAttrs)) {
            if ((name === 'value' || name === 'selected' || name === 'checked' ? element[name] : prevVAttrs[name]) !== nextVAttrs[name]) {
                patchAttribute(element, name, prevVAttrs[name], nextVAttrs[name], isSvg);
            }
        }
        patchChildren(element, prevVNode.children, nextVNode.children, isSvg, middleware);
        activeElement.focus();
    }
    nextVNode.node = element;
    return element;
}

export function render(parent, nextVNode, middleware) {
    nextVNode = getVNode(nextVNode);
    let prevVNode = cache.get(parent);
    if (!prevVNode) {
        prevVNode = (parent.childNodes.length > 0 ? Array.from(parent.childNodes).map((child) => recycle(child, middleware)) : null);
    }
    const prevIsArray = Array.isArray(prevVNode);
    const nextIsArray = Array.isArray(nextVNode);
    cache.set(parent, nextVNode);
    if (prevIsArray || nextIsArray) {
        prevVNode = (prevIsArray ? prevVNode : [prevVNode]).filter(isValidNodeType);
        nextVNode = (nextIsArray ? nextVNode : [nextVNode]).filter(isValidNodeType);
        const root = patchChildren(parent, prevVNode, nextVNode, null, middleware);
        return root.length === 0 ? null : root.length === 1 ? root[0].node : root.map((vnode) => vnode.node);
    }
    return patchElement(parent, prevVNode, nextVNode, null, middleware);
}
