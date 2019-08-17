function isFunction(obj) {
    return typeof obj === 'function';
}

function flatten(arr) {
    return [].concat.apply([], arr);
}

function merge(...objects) {
    return Object.assign({}, ...objects);
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

function patchChildren(element, oldVChildren, newVChildren, isSvg) {
    for (let i = 0; i < Math.max(newVChildren.length, oldVChildren.length); ++i) {
        patchElement(element, oldVChildren[i], newVChildren[i], isSvg);
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
        nodeName,
        attributes,
        children,
        key: attributes.key || null
    };
}

function createTextVNode(text) {
    return {
        type: 'text',
        text
    };
}

export function html(nodeName, attributes, ...children) {
    if (isFunction(nodeName)) {
        return nodeName(attributes, children);
    }
    return createVNode(nodeName, attributes, children);
}
