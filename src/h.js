import { ELEMENT_NODE, TEXT_NODE } from './constants';
import { flatten, isValidNodeType } from './util';

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

export function getVNode(vnode) {
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

export function recycle(node) {
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

export function h(nodeName, attributes, ...children) {
    if (!attributes || attributes.nodeType || typeof attributes.concat === 'function') {
        children = [].concat(attributes || [], ...children);
        attributes = {};
    }
    attributes = attributes || {};
    children = getVNode(children);
    if (typeof nodeName === 'function') {
        return nodeName({children: children, ...attributes});
    }
    return createVNode(nodeName, attributes, children);
}
