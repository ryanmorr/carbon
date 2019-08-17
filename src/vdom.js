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

function isEqualVNode(oldVNode, newVNode) {
    return getKey(oldVNode) === getKey(newVNode) && oldVNode.nodeName === newVNode.nodeName;
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
        if (child != null) {
            key = child.key;
            if (key !== undefined) {
                map[key] = i;
            }
        }
    }
    return map;
}

function createElement(vnode, isSvg = false) {
    let node;
    if (vnode.type === 'text') {
        node = document.createTextNode(vnode.text);
    } else {
        const nodeName = vnode.nodeName;
        isSvg = (isSvg || nodeName === 'svg');
        node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
        const attributes = vnode.attributes;
        if (attributes) {
            Object.keys(attributes).forEach((name) => patchAttribute(node, name, attributes[name], null, isSvg));
        }
        vnode.children.forEach((vchild) => node.appendChild(createElement(vchild, isSvg)));
    }
    vnode.node = node;
    return node;
}

function patchAttribute(element, name, newVal, oldVal, isSvg = false) {
    if (name === 'key') {
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
    } else if (name[0] === 'o' && name[1] === 'n' && (isFunction(oldVal) || isFunction(newVal))) {
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

function patchChildren(parent, oldChildren, newChildren, isSvg) {
    let oldStartIndex = 0;
    let oldEndIndex = oldChildren.length - 1;
    let oldStartChild = oldChildren[0];
    let oldEndChild = oldChildren[oldEndIndex];
    let newStartIndex = 0;
    let newEndIndex = newChildren.length - 1;
    let newStartChild = newChildren[0];
    let newEndChild = newChildren[newEndIndex];
    let oldIndicesByKey
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartChild) {
            oldStartChild = oldChildren[++oldStartIndex];
        } else if (!oldEndChild) {
            oldEndChild = oldChildren[--oldEndIndex];
        } else if (isEqualVNode(oldStartChild, newStartChild)) {
            patchElement(parent, oldStartChild, newStartChild, isSvg);
            oldStartChild = oldChildren[++oldStartIndex];
            newStartChild = newChildren[++newStartIndex];
        } else if (isEqualVNode(oldEndChild, newEndChild)) {
            patchElement(parent, oldEndChild, newEndChild, isSvg);
            oldEndChild = oldChildren[--oldEndIndex];
            newEndChild = newChildren[--newEndIndex];
        } else if (isEqualVNode(oldStartChild, newEndChild)) {
            patchElement(parent, oldStartChild, newEndChild, isSvg);
            parent.insertBefore(oldStartChild.node, oldEndChild.node.nextSibling);
            oldStartChild = oldChildren[++oldStartIndex];
            newEndChild = newChildren[--newEndIndex];
        } else if (isEqualVNode(oldEndChild, newStartChild)) {
            patchElement(parent, oldEndChild, newStartChild, isSvg);
            parent.insertBefore(oldEndChild.node, oldStartChild.node);
            oldEndChild = oldChildren[--oldEndIndex];
            newStartChild = newChildren[++newStartIndex];
        } else {
            if (!oldIndicesByKey) {
                oldIndicesByKey = createKeyToIndexMap(oldChildren, oldStartIndex, oldEndIndex);
            }
            let key = getKey(newStartChild);
            let oldIndex = key ? oldIndicesByKey[key] : null;
            if (oldIndex == null) {
                parent.insertBefore(createElement(newStartChild, isSvg), oldStartChild.node);
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
            parent.insertBefore(createElement(newChildren[i], isSvg), subsequentElement);
        }
    } else if (newStartIndex > newEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            let child = oldChildren[i];
            if (child && child.node) child.node.remove();
        }
    }
}

function patchElement(parent, oldVNode, newVNode, isSvg = false) {
    if (oldVNode == null) {
        return parent.appendChild(createElement(newVNode));
    }
    let element = oldVNode.node;
    if (newVNode == null) {
        parent.removeChild(element);
    } else if (!isSameNodeType(newVNode, oldVNode)) {
        const newElement = createElement(newVNode, isSvg);
        parent.replaceChild(newElement, element);
        element = newElement;
    } else if (newVNode.type === 'element') {
        isSvg = isSvg || newVNode.nodeName === 'svg';
        const oldVAttrs = oldVNode.attributes;
        const newVAttrs = newVNode.attributes;
        for (const name in merge(newVAttrs, oldVAttrs)) {
            if ((name === 'value' || name === 'selected' || name === 'checked '? element[name] : oldVAttrs[name]) !== newVAttrs[name]) {
                patchAttribute(element, name, newVAttrs[name], oldVAttrs[name], isSvg);
            }
        }
        patchChildren(element, oldVNode.children, newVNode.children, isSvg);
    }
    if (newVNode) {
        newVNode.node = element;
    }
    return element;
}

export function render(parent, newVNode) {
    const oldVNode = parent._prevVNode || recycle((parent && parent.childNodes[0]) || null);
    const element = patchElement(parent, oldVNode, newVNode);
    parent._prevVNode = newVNode;
    return element;
}

export function recycle(element) {
    if (element == null) {
        return null;
    }
    if (element.nodeType === 3) {
        return {
            type: 'text',
            node: element,
            text: element.nodeValue
        };
    }
    return {
        type: 'element',
        node: element,
        nodeName: element.nodeName.toLowerCase(),
        attributes: Array.from(element.attributes).reduce((map, attr) => {
            const name = attr.name, value = attr.value;
            if (name === 'style') {
                return map;
            }
            map[name] = value;
            return map;
        }, {}),
        children: Array.from(element.childNodes).map(recycle),
        key: element.getAttribute('key') || null
    };
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

export function html(nodeName, attributes, ...children) {
    if (isFunction(nodeName)) {
        return nodeName(attributes, children);
    }
    return createVNode(nodeName, attributes, children);
}
