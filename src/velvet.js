const VNODE = Symbol('vnode');
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

function isDefined(obj) {
    return obj != null;
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

function merge(...objects) {
    return Object.assign({}, ...objects);
}

function getKey(vnode) {
    return vnode.attributes && vnode.attributes.key || null;
}

function isSameNode(a, b) {
    return a.nodeName === b.nodeName && getKey(a) === getKey(b);
}

function isSameNodeType(a, b) {
    if (a.type !== b.type) {
        return false;
    }
    if (a.type === TEXT_NODE && a.text !== b.text) {
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
    if (type === 'string' || type === 'number' || type === 'boolean') {
        return createTextVNode(vnode);
    }
    if (Array.isArray(vnode)) {
        return flatten(vnode).reduce((vnodes, vn) => {
            if (isDefined(vn)) {
                vnodes.push(getVNode(vn));
            }
            return vnodes;
        }, []);
    }
    return vnode;
}

function recycle(node) {
    if (node.nodeType === 3) {
        return createTextVNode(node.nodeValue, node);
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
        [VNODE]: true,
        type: ELEMENT_NODE,
        node,
        nodeName,
        attributes,
        children
    };
}

function createTextVNode(text, node = null) {
    return {
        [VNODE]: true,
        type: TEXT_NODE,
        node,
        text
    };
}

function createElement(vnode, isSvg = false) {
    let node;
    if (vnode.type === TEXT_NODE) {
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

function patchAttribute(element, name, oldVal, newVal, isSvg = false) {
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
    if (name === 'style') {
        if (typeof newVal === 'string') {
            element.style.cssText = newVal;
        } else {
            for (const key in merge(newVal, oldVal)) {
                const style = newVal == null || newVal[key] == null ? '' : newVal[key];
                if (key.includes('-')) {
                    element.style.setProperty(key, style);
                } else {
                    element.style[key] = style;
                }
            }
        }
    } else if (name.startsWith('on') && (typeof oldVal === 'function' || typeof newVal === 'function')) {
        name = name.slice(2).toLowerCase();
        if (newVal) {
            element.addEventListener(name, newVal);
        }
        if (oldVal) {
            element.removeEventListener(name, oldVal);
        }
    } else if (!isSvg && name !== 'list' && name !== 'form' && name in element) {
        element[name] = newVal == null ? '' : newVal;
    } else if (newVal == null || newVal === false) {
        element.removeAttribute(name);
    } else if (typeof newVal !== 'function') {
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
    let oldKeyToIdx;
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartChild) {
            oldStartChild = oldChildren[++oldStartIndex];
        } else if (!oldEndChild) {
            oldEndChild = oldChildren[--oldEndIndex];
        } else if (isSameNode(oldStartChild, newStartChild)) {
            patchElement(parent, oldStartChild, newStartChild, isSvg);
            oldStartChild = oldChildren[++oldStartIndex];
            newStartChild = newChildren[++newStartIndex];
        } else if (isSameNode(oldEndChild, newEndChild)) {
            patchElement(parent, oldEndChild, newEndChild, isSvg);
            oldEndChild = oldChildren[--oldEndIndex];
            newEndChild = newChildren[--newEndIndex];
        } else if (isSameNode(oldStartChild, newEndChild)) {
            patchElement(parent, oldStartChild, newEndChild, isSvg);
            parent.insertBefore(oldStartChild.node, oldEndChild.node.nextSibling);
            oldStartChild = oldChildren[++oldStartIndex];
            newEndChild = newChildren[--newEndIndex];
        } else if (isSameNode(oldEndChild, newStartChild)) {
            patchElement(parent, oldEndChild, newStartChild, isSvg);
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
            if (child && child.node) {
                parent.removeChild(child.node);
            }
        }
    }
    return newChildren;
}

function patchElement(parent, oldVNode, newVNode, isSvg = false) {
    if (oldVNode === newVNode) {
        return oldVNode.node;
    }
    if (oldVNode == null) {
        return parent.appendChild(createElement(newVNode, isSvg));
    }
    let element = oldVNode.node;
    if (newVNode == null) {
        return parent.removeChild(element) && null;
    }
    if (oldVNode.type === TEXT_NODE && newVNode.type === TEXT_NODE) {
        if (oldVNode.text !== newVNode.text) {
            element.nodeValue = newVNode.text;
        }
    } else if (!isSameNodeType(newVNode, oldVNode)) {
        const newElement = createElement(newVNode, isSvg);
        parent.replaceChild(newElement, element);
        element = newElement;
    } else {
        isSvg = isSvg || newVNode.nodeName === 'svg';
        const activeElement = document.activeElement;
        const oldVAttrs = oldVNode.attributes;
        const newVAttrs = newVNode.attributes;
        for (const name in merge(newVAttrs, oldVAttrs)) {
            if ((name === 'value' || name === 'selected' || name === 'checked' ? element[name] : oldVAttrs[name]) !== newVAttrs[name]) {
                patchAttribute(element, name, oldVAttrs[name], newVAttrs[name], isSvg);
            }
        }
        patchChildren(element, oldVNode.children, newVNode.children, isSvg);
        activeElement.focus();
    }
    newVNode.node = element;
    return element;
}

export function h(nodeName, attributes, ...children) {
    if (!attributes || attributes[VNODE] === true || typeof attributes.concat === 'function') {
        children = [].concat(attributes || [], ...children);
        attributes = {};
    }
    return createVNode(nodeName, attributes || {}, getVNode(children));
}

export function render(parent, newVNode) {
    newVNode = getVNode(newVNode);
    let oldVNode = parent.vdom || (parent.childNodes.length > 0 ? Array.from(parent.childNodes).map(recycle) : null);
    const oldIsArray = Array.isArray(oldVNode);
    const newIsArray = Array.isArray(newVNode);
    parent.vdom = newVNode;
    if (oldIsArray || newIsArray) {
        oldVNode = (oldIsArray ? oldVNode : [oldVNode]).filter(isDefined);
        newVNode = (newIsArray ? newVNode : [newVNode]).filter(isDefined);
        const root = patchChildren(parent, oldVNode, newVNode);
        return root.length === 0 ? null : root.length === 1 ? root[0].node : root.map((vnode) => vnode.node);
    }
    return patchElement(parent, oldVNode, newVNode);
}
