function flatten(arr) {
    return [].concat.apply([], arr);
}

function merge(...objects) {
    return Object.assign({}, ...objects);
}

function isSameNodeType(a, b) {
    if (typeof a !== typeof b) {
        return false;
    }
    if (typeof a === 'string' && a !== b) {
        return false;
    }
    if (a.nodeName !== b.nodeName) {
        return false;
    }
    return true;
}

function createElement(vnode, isSvg = false) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return document.createTextNode(vnode);
    }
    const nodeName = vnode.nodeName;
    isSvg = (isSvg || nodeName === 'svg');
    const element = isSvg
        ? document.createElementNS('http://www.w3.org/2000/svg', nodeName)
        : document.createElement(nodeName);
    const attributes = vnode.attributes;
    if (attributes) {
        Object.keys(attributes).forEach((name) => patchAttribute(element, name, attributes[name], null));
    }
    vnode.children.forEach((vchild) => element.appendChild(createElement(vchild, isSvg)));
    return element;
}

function patchAttribute(element, name, newVal, oldVal = null) {
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
    } else if (name[0] === 'o' && name[1] === 'n') {
        name = name.slice(2).toLowerCase();
        if (newVal == null) {
            element.removeEventListener(name, oldVal);
        } else if (oldVal == null) {
            element.addEventListener(name, newVal);
        }
        return;
    } else {
        if (newVal == null || newVal === false) {
            element.removeAttribute(name);
        } else {
            element.setAttribute(name, newVal);
        }
    }
}

export function render(parent, newVNode, oldVNode = null, index = 0) {
    const element = parent.childNodes[index];
    if (oldVNode == null) {
        return parent.appendChild(createElement(newVNode));
    }
    if (newVNode == null) {
        return parent.removeChild(element);
    } else if (!isSameNodeType(newVNode, oldVNode)) {
        return parent.replaceChild(createElement(newVNode), element);
    }
    if (newVNode.nodeName) {
        for (const name in merge(newVNode.attributes, oldVNode.attributes)) {
            patchAttribute(element, name, newVNode.attributes[name], oldVNode.attributes[name]);
        }
        for (let i = 0; i < Math.max(newVNode.children.length, oldVNode.children.length); ++i) {
            render(element, newVNode.children[i], oldVNode.children[i], i);
        }
    }
}

export function html(nodeName, attributes, ...children) {
    attributes = attributes || {};
    children = flatten(children);
    if (typeof nodeName === 'function') {
        return nodeName(attributes, children);
    }
    return {
        nodeName,
        attributes,
        children
    };
}
