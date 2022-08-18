const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const VDOM = Symbol('vdom');

function flatten(array) {
    for (let i = 0; i < array.length;) {
        const value = array[i];
        if (Array.isArray(value)) {
            if (value.length > 0) {
                value.unshift(i, 1);
                array.splice.apply(array, value);
                value.splice(0, 2);
            } else {
                array.splice(i, 1);
            }
        } else {
            i++;
        }
    }
    return array;
}

function createClass(value) {
    if (typeof value === 'string') {
        return value;
    }
    let output = '';
    if (Array.isArray(value) && value.length > 0) {
        for (let i = 0, len = value.length, tmp; i < len; i++) {
            if ((tmp = createClass(value[i])) !== '') {
                output += (output && ' ') + tmp;
            }
        }
    } else {
        for (const cls in value) {
            if (value[cls]) {
                output += (output && ' ') + cls;
            }
        }
    }
    return output;
}

function merge(...objects) {
    return Object.assign({}, ...objects);
}

function getKey(vnode) {
    return vnode.attributes && vnode.attributes.key || null;
}

function isValidNodeType(obj) {
    return obj != null && typeof obj !== 'boolean';
}

function isSameNode(a, b) {
    return a.nodeName === b.nodeName && getKey(a) === getKey(b);
}

function isSameNodeType(a, b) {
    if (a.nodeType !== b.nodeType) {
        return false;
    }
    if (a.nodeType === TEXT_NODE && a.text !== b.text) {
        return false;
    }
    if (a.nodeName !== b.nodeName) {
        return false;
    }
    return true;
}

function createKeyToIndexMap(children, beginIdx, endIdx) {
    const map = {};
    for (let i = beginIdx; i <= endIdx; ++i) {
        const child = children[i];
        const key = child && getKey(child);
        if (key != null) {
            map[key] = i;
        }
    }
    return map;
}

function getVNode(vnode) {
    const type = typeof vnode;
    if (type === 'boolean') {
        return null;
    }
    if (type === 'string' || type === 'number') {
        return createTextVNode(vnode);
    }
    if (Array.isArray(vnode)) {
        return flatten(vnode).reduce((vnodes, vn) => {
            if (isValidNodeType(vn)) {
                vnodes.push(getVNode(vn));
            }
            return vnodes;
        }, []);
    }
    return vnode;
}

function recycle(node) {
    if (node.nodeType === 3) {
        return createTextVNode(node.data, node);
    }
    if (node.nodeType === 1) {
        return createVNode(
            node.nodeName.toLowerCase(),
            Array.from(node.attributes).reduce((map, attr) => {
                const name = attr.name, value = attr.value;
                if (name !== 'style') {
                    map[name] = value;
                }
                if (name === 'key') {
                    node.removeAttribute('key');
                }
                return map;
            }, {}),
            Array.from(node.childNodes).map(recycle),
            node
        );
    }
}

function createVNode(nodeName, attributes, children, node = null) {
    return {
        nodeType: ELEMENT_NODE,
        node,
        nodeName,
        attributes,
        children
    };
}

function createTextVNode(text, node = null) {
    return {
        nodeType: TEXT_NODE,
        node,
        text
    };
}

function createElement(vnode, isSvg = false) {
    let node;
    if (vnode.nodeType === TEXT_NODE) {
        node = document.createTextNode(vnode.text);
    } else {
        const nodeName = vnode.nodeName;
        isSvg = (isSvg || nodeName === 'svg');
        node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
        const attributes = vnode.attributes;
        Object.keys(attributes).forEach((name) => patchAttribute(node, name, null, attributes[name], isSvg));
        vnode.children.forEach((vchild) => node.appendChild(createElement(vchild, isSvg)));
    }
    vnode.node = node;
    return node;
}

function patchAttribute(element, name, prevVal, nextVal, isSvg = false) {
    if (name === 'key' || name === 'children') {
        return;
    }
    if (isSvg) {
		if (name === 'className') {
			name = 'class';
		}
	} else if (name === 'class') {
		name = 'className';
    }
    if (name === 'class' || name === 'className') {
        nextVal = createClass(nextVal);
    }
    if (name === 'style') {
        if (typeof nextVal === 'string') {
            element.style.cssText = nextVal;
        } else {
            for (const key in merge(nextVal, prevVal)) {
                const style = nextVal == null || nextVal[key] == null ? '' : nextVal[key];
                if (key.includes('-')) {
                    element.style.setProperty(key, style);
                } else {
                    element.style[key] = style;
                }
            }
        }
    } else if (name.startsWith('on') && (typeof prevVal === 'function' || typeof nextVal === 'function')) {
        name = name.slice(2);
        if (nextVal) {
            element.addEventListener(name, nextVal);
        }
        if (prevVal) {
            element.removeEventListener(name, prevVal);
        }
    } else if (!isSvg && name !== 'list' && name !== 'form' && name in element) {
        element[name] = nextVal == null ? '' : nextVal;
    } else if (nextVal == null || nextVal === false) {
        element.removeAttribute(name);
    } else if (typeof nextVal !== 'function') {
        element.setAttribute(name, nextVal);
    }
}

function patchChildren(parent, prevChildren, nextChildren, isSvg) {
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
            patchElement(parent, prevStartChild, nextStartChild, isSvg);
            prevStartChild = prevChildren[++prevStartIndex];
            nextStartChild = nextChildren[++nextStartIndex];
        } else if (isSameNode(prevEndChild, nextEndChild)) {
            patchElement(parent, prevEndChild, nextEndChild, isSvg);
            prevEndChild = prevChildren[--prevEndIndex];
            nextEndChild = nextChildren[--nextEndIndex];
        } else if (isSameNode(prevStartChild, nextEndChild)) {
            patchElement(parent, prevStartChild, nextEndChild, isSvg);
            parent.insertBefore(prevStartChild.node, prevEndChild.node.nextSibling);
            prevStartChild = prevChildren[++prevStartIndex];
            nextEndChild = nextChildren[--nextEndIndex];
        } else if (isSameNode(prevEndChild, nextStartChild)) {
            patchElement(parent, prevEndChild, nextStartChild, isSvg);
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
                parent.insertBefore(createElement(nextStartChild, isSvg), prevStartChild.node);
                nextStartChild = nextChildren[++nextStartIndex];
            } else {
                let prevChildToMove = prevChildren[prevIndex];
                patchElement(parent, prevChildToMove, nextStartChild, isSvg);
                prevChildren[prevIndex] = undefined;
                parent.insertBefore(prevChildToMove.node, prevStartChild.node);
                nextStartChild = nextChildren[++nextStartIndex];
            }
        }
    }
    if (prevStartIndex > prevEndIndex) {
        let subsequentElement = nextChildren[nextEndIndex + 1] ? nextChildren[nextEndIndex + 1].node : null;
        for (let i = nextStartIndex; i <= nextEndIndex; i++) {
            parent.insertBefore(createElement(nextChildren[i], isSvg), subsequentElement);
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

function patchElement(parent, prevVNode, nextVNode, isSvg = false) {
    if (prevVNode === nextVNode) {
        if (prevVNode == null) {
            return null;
        }
        return prevVNode.node;
    }
    if (prevVNode == null) {
        return parent.appendChild(createElement(nextVNode, isSvg));
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
        const nextElement = createElement(nextVNode, isSvg);
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
        patchChildren(element, prevVNode.children, nextVNode.children, isSvg);
        activeElement.focus();
    }
    nextVNode.node = element;
    return element;
}

export function h(nodeName, attributes, ...children) {
    if (!attributes || attributes.nodeType || typeof attributes.concat === 'function') {
        children = [].concat(attributes || [], ...children);
        attributes = {};
    }
    return createVNode(nodeName, attributes || {}, getVNode(children));
}

export function render(parent, nextVNode) {
    nextVNode = getVNode(nextVNode);
    let prevVNode = parent[VDOM] || (parent.childNodes.length > 0 ? Array.from(parent.childNodes).map(recycle) : null);
    const prevIsArray = Array.isArray(prevVNode);
    const nextIsArray = Array.isArray(nextVNode);
    parent[VDOM] = nextVNode;
    if (prevIsArray || nextIsArray) {
        prevVNode = (prevIsArray ? prevVNode : [prevVNode]).filter(isValidNodeType);
        nextVNode = (nextIsArray ? nextVNode : [nextVNode]).filter(isValidNodeType);
        const root = patchChildren(parent, prevVNode, nextVNode);
        return root.length === 0 ? null : root.length === 1 ? root[0].node : root.map((vnode) => vnode.node);
    }
    return patchElement(parent, prevVNode, nextVNode);
}
