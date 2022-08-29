import { TEXT_NODE } from './constants';

export function merge(...objects) {
    return Object.assign({}, ...objects);
}

export function getKey(vnode) {
    return vnode.attributes && vnode.attributes.key || null;
}

export function isValidNodeType(obj) {
    return obj != null && typeof obj !== 'boolean';
}

export function isSameNode(a, b) {
    return a.nodeName === b.nodeName && getKey(a) === getKey(b);
}

export function isSameNodeType(a, b) {
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

export function flatten(array) {
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

export function createClass(value) {
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

export function createKeyToIndexMap(children, beginIndex, endIndex) {
    const map = {};
    for (let i = beginIndex; i <= endIndex; ++i) {
        const child = children[i];
        const key = child && getKey(child);
        if (key != null) {
            map[key] = i;
        }
    }
    return map;
}
