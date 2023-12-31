const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

function merge(...objects) {
    return Object.assign({}, ...objects);
}

function isValidNodeType(obj) {
    return obj != null && typeof obj !== 'boolean';
}

function isSameNode(a, b) {
    return a.tag === b.tag && a.key === b.key;
}

function isSameNodeType(a, b) {
    if (a.type !== b.type) {
        return false;
    }
    if (a.type === TEXT_NODE && a.text !== b.text) {
        return false;
    }
    if (a.tag !== b.tag) {
        return false;
    }
    return true;
}

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

function createKeyToIndexMap(children, beginIndex, endIndex) {
    const map = {};
    for (let i = beginIndex; i <= endIndex; ++i) {
        const child = children[i];
        const key = child && child.key;
        if (key != null) {
            map[key] = i;
        }
    }
    return map;
}

function createVNode(tag, props, children, node = null) {
    return {
        type: ELEMENT_NODE,
        tag,
        props,
        children,
        key: props.key || null,
        node
    };
}

function createTextVNode(text, node = null) {
    return {
        type: TEXT_NODE,
        text,
        node
    };
}

function normalizeVNode(vnode) {
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
                vnodes.push(normalizeVNode(vn));
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

function createElement(vnode, isSvg) {
    let node;
    if (vnode.type === TEXT_NODE) {
        node = document.createTextNode(vnode.text);
    } else {
        const tag = vnode.tag;
        isSvg = (isSvg || tag === 'svg');
        node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag);
        const props = vnode.props;
        Object.keys(props).forEach((name) => patchProperty(node, name, null, props[name], isSvg));
        vnode.children.forEach((vchild) => node.appendChild(createElement(vchild, isSvg)));
    }
    vnode.node = node;
    return node;
}

function setStyle(element, name, value) {
    if (name.startsWith('--')) {
        element.style.setProperty(name, value == null ? '' : value);
    } else if (value == null) {
        element.style[name] = '';
    } else if (typeof value != 'number' || IS_NON_DIMENSIONAL.test(name)) {
        element.style[name] = value;
    } else {
        element.style[name] = value + 'px';
    }
}

function patchProperty(element, name, prevVal, nextVal, isSvg) {
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
            const key = nextStartChild.key;
            const prevIndex = key ? prevKeyToIdx[key] : null;
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
        const subsequentElement = nextChildren[nextEndIndex + 1] ? nextChildren[nextEndIndex + 1].node : null;
        for (let i = nextStartIndex; i <= nextEndIndex; i++) {
            parent.insertBefore(createElement(nextChildren[i], isSvg), subsequentElement);
        }
    } else if (nextStartIndex > nextEndIndex) {
        for (let i = prevStartIndex; i <= prevEndIndex; i++) {
            const child = prevChildren[i];
            if (child && child.node) {
                parent.removeChild(child.node);
            }
        }
    }
    return nextChildren;
}

function patchElement(parent, prevVNode, nextVNode, isSvg) {
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
    if (prevVNode.type === TEXT_NODE && nextVNode.type === TEXT_NODE) {
        if (prevVNode.text !== nextVNode.text) {
            element.data = nextVNode.text;
        }
    } else if (!isSameNodeType(nextVNode, prevVNode)) {
        const nextElement = createElement(nextVNode, isSvg);
        parent.replaceChild(nextElement, element);
        element = nextElement;
    } else {
        isSvg = isSvg || nextVNode.tag === 'svg';
        const activeElement = document.activeElement;
        const prevVProps = prevVNode.props;
        const nextVProps = nextVNode.props;
        for (const name in merge(nextVProps, prevVProps)) {
            if ((name === 'value' || name === 'selected' || name === 'checked' ? element[name] : prevVProps[name]) !== nextVProps[name]) {
                patchProperty(element, name, prevVProps[name], nextVProps[name], isSvg);
            }
        }
        patchChildren(element, prevVNode.children, nextVNode.children, isSvg);
        activeElement.focus();
    }
    nextVNode.node = element;
    return element;
}

export function render(parent, nextVNode) {
    nextVNode = normalizeVNode(nextVNode);
    let prevVNode = parent._vnode || null;
    if (!prevVNode && parent.childNodes.length > 0) {
        prevVNode = Array.from(parent.childNodes).map(recycle);
    }
    const prevIsArray = Array.isArray(prevVNode);
    const nextIsArray = Array.isArray(nextVNode);
    parent._vnode = nextVNode;
    if (prevIsArray || nextIsArray) {
        prevVNode = (prevIsArray ? prevVNode : [prevVNode]).filter(isValidNodeType);
        nextVNode = (nextIsArray ? nextVNode : [nextVNode]).filter(isValidNodeType);
        const root = patchChildren(parent, prevVNode, nextVNode);
        return root.length === 0 ? null : root.length === 1 ? root[0].node : root.map((vnode) => vnode.node);
    }
    return patchElement(parent, prevVNode, nextVNode);
}

export function h(tag, props, ...children) {
    if (!props || props.type === ELEMENT_NODE || props.type === TEXT_NODE || typeof props.concat === 'function') {
        children = [].concat(props || [], ...children);
        props = null;
    }
    props = props || {};
    children = normalizeVNode(children);
    if (typeof tag === 'function') {
        return tag({children, ...props});
    }
    return createVNode(tag, props, children);
}
