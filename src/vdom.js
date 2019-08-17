const events = [];
for (const prop in document) {
    if (prop.substring(0,2) === 'on' && (document[prop] === null || typeof document[prop] === 'function')) {
        events.push(prop);
    }
}

function isFunction(obj) {
    return typeof obj === 'function';
}

function flatten(arr) {
    return [].concat.apply([], arr);
}

function merge(...objects) {
    return Object.assign({}, ...objects);
}

function getKey(vnode) {
    return vnode.attributes ? vnode.attributes.key : null;
}

function isSameNode(a, b) {
    return getKey(a) === getKey(b) && a.nodeName === b.nodeName;
}

function isSameNodeType(a, b) {
    if (a.type !== b.type) {
        return false;
    }
    if (a.type === 'text' && a.text !== b.text) {
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
        const key = child && child.key;
        if (key != null) {
            map[key] = i;
        }
    }
    return map;
}

function createVNode(nodeName, attributes, children) {
    attributes = attributes || {};
    children = flatten(children).map((vchild) => typeof vchild === 'object' ? vchild : createTextVNode(vchild));
    return {
        type: 'element',
        node: null,
        nodeName,
        attributes,
        children,
        key: attributes.key || null
    };
}

function createTextVNode(text) {
    return {
        type: 'text',
        node: null,
        text
    };
}

function createElement(vnode, refs, isSvg = false) {
    let node;
    if (vnode.type === 'text') {
        node = document.createTextNode(vnode.text);
    } else {
        const nodeName = vnode.nodeName;
        isSvg = (isSvg || nodeName === 'svg');
        node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
        const attributes = vnode.attributes;
        Object.keys(attributes).forEach((name) => patchAttribute(node, name, attributes[name], null, isSvg));
        const ref = attributes.ref;
        if (ref) {
            refs[ref] = node;
        }
        vnode.children.forEach((vchild) => node.appendChild(createElement(vchild, refs, isSvg)));
    }
    vnode.node = node;
    return node;
}

function patchAttribute(element, name, newVal, oldVal, isSvg = false) {
    if (name === 'key' || name === 'ref') {
        return;
    }
    if (name === 'style') {
        if (typeof newVal === 'string') {
            element.style.cssText = newVal;
        } else {
            for (const key in merge(newVal, oldVal)) {
                const style = newVal == null || newVal[key] == null ? '' : newVal[key];
                if (key[0] === '-') {
                    element.style.setProperty(key, style);
                } else {
                    element.style[key] = style;
                }
            }
        }
    } else if (events.includes(name)) {
        name = name.slice(2).toLowerCase();
        if (newVal == null) {
            element.removeEventListener(name, oldVal);
        } else if (oldVal == null) {
            element.addEventListener(name, newVal);
        }
    } else if (!isSvg && name in element) {
        element[name] = newVal == null ? '' : newVal;
    } else if (newVal == null || newVal === false) {
        element.removeAttribute(name);
    } else {
        element.setAttribute(name, newVal);
    }
}

function patchChildren(parent, oldChildren, newChildren, refs, isSvg) {
    let oldStartIndex = 0;
    let oldEndIndex = oldChildren.length - 1;
    let oldStartChild = oldChildren[0];
    let oldEndChild = oldChildren[oldEndIndex];
    let newStartIndex = 0;
    let newEndIndex = newChildren.length - 1;
    let newStartChild = newChildren[0];
    let newEndChild = newChildren[newEndIndex];
    let oldKeyToIdx;
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartChild) {
            oldStartChild = oldChildren[++oldStartIndex];
        } else if (!oldEndChild) {
            oldEndChild = oldChildren[--oldEndIndex];
        } else if (isSameNode(oldStartChild, newStartChild)) {
            patchElement(parent, oldStartChild, newStartChild, refs, isSvg);
            oldStartChild = oldChildren[++oldStartIndex];
            newStartChild = newChildren[++newStartIndex];
        } else if (isSameNode(oldEndChild, newEndChild)) {
            patchElement(parent, oldEndChild, newEndChild, refs, isSvg);
            oldEndChild = oldChildren[--oldEndIndex];
            newEndChild = newChildren[--newEndIndex];
        } else if (isSameNode(oldStartChild, newEndChild)) {
            patchElement(parent, oldStartChild, newEndChild, refs, isSvg);
            parent.insertBefore(oldStartChild.node, oldEndChild.node.nextSibling);
            oldStartChild = oldChildren[++oldStartIndex];
            newEndChild = newChildren[--newEndIndex];
        } else if (isSameNode(oldEndChild, newStartChild)) {
            patchElement(parent, oldEndChild, newStartChild, refs, isSvg);
            parent.insertBefore(oldEndChild.node, oldStartChild.node);
            oldEndChild = oldChildren[--oldEndIndex];
            newStartChild = newChildren[++newStartIndex];
        } else {
            if (!oldKeyToIdx) {
                oldKeyToIdx = createKeyToIndexMap(oldChildren, oldStartIndex, oldEndIndex);
            }
            let key = getKey(newStartChild);
            let oldIndex = key ? oldKeyToIdx[key] : null;
            if (oldIndex == null) {
                parent.insertBefore(createElement(newStartChild, refs, isSvg), oldStartChild.node);
                newStartChild = newChildren[++newStartIndex];
            } else {
                let oldChildToMove = oldChildren[oldIndex];
                patchElement(parent, oldChildToMove, newStartChild, isSvg);
                oldChildren[oldIndex] = undefined;
                parent.insertBefore(oldChildToMove.node, oldStartChild.node);
                newStartChild = newChildren[++newStartIndex];
            }
        }
    }
    if (oldStartIndex > oldEndIndex) {
        let subsequentElement = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].node : null;
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            parent.insertBefore(createElement(newChildren[i], refs, isSvg), subsequentElement);
        }
    } else if (newStartIndex > newEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            let child = oldChildren[i];
            if (child && child.node) {
                child.node.remove();
            }
        }
    }
}

function patchElement(parent, oldVNode, newVNode, refs, isSvg = false) {
    isSvg = isSvg || newVNode.nodeName === 'svg';
    if (oldVNode == null) {
        return parent.appendChild(createElement(newVNode, refs, isSvg));
    }
    let element = oldVNode.node;
    if (newVNode == null) {
        parent.removeChild(element);
    } else if (!isSameNodeType(newVNode, oldVNode)) {
        const newElement = createElement(newVNode, refs, isSvg);
        parent.replaceChild(newElement, element);
        element = newElement;
    } else if (newVNode.type === 'element') {
        const oldVAttrs = oldVNode.attributes;
        const newVAttrs = newVNode.attributes;
        for (const name in merge(newVAttrs, oldVAttrs)) {
            if ((name === 'value' || name === 'selected' || name === 'checked ' ? element[name] : oldVAttrs[name]) !== newVAttrs[name]) {
                patchAttribute(element, name, newVAttrs[name], oldVAttrs[name], isSvg);
            }
        }
        patchChildren(element, oldVNode.children, newVNode.children, refs, isSvg);
    }
    if (newVNode) {
        newVNode.node = element;
    }
    return element;
}

export function render(parent, newVNode) {
    const refs = {};
    const oldVNode = parent._prevVNode || recycle((parent && parent.childNodes[0]) || null);
    const element = patchElement(parent, oldVNode, newVNode, refs);
    parent._prevVNode = newVNode;
    return Object.keys(refs).length > 0 ? refs : element;
}

export function recycle(node) {
    if (node == null) {
        return null;
    }
    let vnode = (node.nodeType === 3)
        ? createTextVNode(node.nodeValue)
        : createVNode(
            node.nodeName.toLowerCase(),
            Array.from(node.attributes).reduce((map, attr) => {
                const name = attr.name, value = attr.value;
                if (name === 'style') {
                    return map;
                }
                map[name] = value;
                return map;
            }, {}),
            Array.from(node.childNodes).map(recycle)
        );
    vnode.node = node;
    return vnode;
}

export function html(nodeName, attributes, ...children) {
    if (isFunction(nodeName)) {
        return nodeName(attributes, children);
    }
    return createVNode(nodeName, attributes, children);
}
