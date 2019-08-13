function flatten(arr) {
    return [].concat.apply([], arr);
}

function updateAttribute(element, name, newVal, oldVal = null) {
    if (name[0] === 'o' && name[1] === 'n') {
        name = name.slice(2).toLowerCase();
        if (newVal == null) {
            element.removeEventListener(name, oldVal);
        } else if (oldVal == null) {
            element.addEventListener(name, newVal);
        }
        return;
    }
    if (newVal == null || newVal === false) {
        element.removeAttribute(name);
    } else {
        element.setAttribute(name, newVal);
    }
}

function createElement(vnode) {
    if (typeof vnode === 'string') {
        return document.createTextNode(vnode);
    }
    const element = document.createElement(vnode.nodeName);
    const attributes = vnode.attributes;
    if (attributes) {
        Object.keys(attributes).forEach((name) => {
            updateAttribute(element, name, attributes[name], null);
        });
    }
    vnode.children.map(createElement).forEach((node) => element.appendChild(node));
    return element;
}

export function render(parent, newNode, oldNode = null, index = 0) {
    const element = parent.childNodes[index];
    if (oldNode == null) {
        return parent.appendChild(createElement(newNode));
    }
    if (newNode == null) {
        return parent.removeChild(element);
    } else if (typeof newNode !== typeof oldNode
        || typeof newNode === 'string' && newNode !== oldNode
        || newNode.nodeName !== oldNode.nodeName) {
        return parent.replaceChild(createElement(newNode), element);
    }
    if (newNode.nodeName) {
        for (const name in Object.assign({}, newNode.attributes, oldNode.attributes)) {
            updateAttribute(element, name, newNode.attributes[name], oldNode.attributes[name]);
        }
        for (let i = 0; i < Math.max(newNode.children.length, oldNode.children.length); ++i) {
            render(element, newNode.children[i], oldNode.children[i], i);
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
