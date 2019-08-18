const cache = new Map();
const newLineRe = /^\s*\n\s*|\s*\n\s*$/g;

export const ELEMENT_NODE = 1;
export const TEXT_NODE = 3;

const TAG_SET = 1;
const PROPS_SET = 2;
const PROPS_ASSIGN = 3;
const CHILD_RECURSE = 4;
const CHILD_APPEND = 0;

const MODE_SLASH = 0;
const MODE_TEXT = 1;
const MODE_WHITESPACE = 2;
const MODE_TAGNAME = 3;
const MODE_ATTRIBUTE = 4;

function flatten(arr) {
    return [].concat.apply([], arr);
}

function evaluate(current, fields, args) {
    for (let i = 1; i < current.length; i++) {
        const field = current[i++];
        const value = typeof field === 'number' ? fields[field] : field;
        if (current[i] === TAG_SET) {
            args[0] = value;
        } else if (current[i] === PROPS_SET) {
            (args[1] = args[1] || {})[current[++i]] = value;
        } else if (current[i] === PROPS_ASSIGN) {
            args[1] = Object.assign(args[1] || {}, value);
        } else if (current[i]) {
            args.push(createVNode.apply(null, evaluate(value, fields, ['', null])));
        } else {
            args.push(value);
        }
    }
    return args;
}

function build(statics) {
    let mode = MODE_TEXT;
    let buffer = '';
    let quote = '';
    let current = [0];
    let char, propName;

    function commit(field) {
        if (mode === MODE_TEXT && (field || (buffer = buffer.replace(newLineRe, '')))) {
            current.push(field || buffer, CHILD_APPEND);
        } else if (mode === MODE_TAGNAME && (field || buffer)) {
            current.push(field || buffer, TAG_SET);
            mode = MODE_WHITESPACE;
        } else if (mode === MODE_WHITESPACE && buffer === '...' && field) {
            current.push(field, PROPS_ASSIGN);
        } else if (mode === MODE_WHITESPACE && buffer && !field) {
            current.push(true, PROPS_SET, buffer);
        } else if (mode === MODE_ATTRIBUTE && propName) {
            current.push(field || buffer, PROPS_SET, propName);
            propName = '';
        }
        buffer = '';
    }

    for (let i = 0; i < statics.length; i++) {
        if (i) {
            if (mode === MODE_TEXT) {
                commit();
            }
            commit(i);
        }
        for (let j = 0; j < statics[i].length; j++) {
            char = statics[i][j];
            if (mode === MODE_TEXT) {
                if (char === '<') {
                    commit();
                    current = [current];
                    mode = MODE_TAGNAME;
                } else {
                    buffer += char;
                }
            } else if (quote) {
                if (char === quote) {
                    quote = '';
                } else {
                    buffer += char;
                }
            } else if (char === '"' || char === "'") { // eslint-disable-line quotes
                quote = char;
            } else if (char === '>') {
                commit();
                mode = MODE_TEXT;
            } else if (!mode) {
                // eslint-disable-line no-empty
            } else if (char === '=') {
                mode = MODE_ATTRIBUTE;
                propName = buffer;
                buffer = '';
            } else if (char === '/') {
                commit();
                if (mode === MODE_TAGNAME) {
                    current = current[0];
                }
                mode = current;
                (current = current[0]).push(mode, CHILD_RECURSE);
                mode = MODE_SLASH;
            } else if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
                commit();
                mode = MODE_WHITESPACE;
            } else {
                buffer += char;
            }
        }
    }
    commit();
    return current;
}

function createVNode(nodeName, attributes, ...children) {
    attributes = attributes || {};
    if (typeof nodeName === 'function') {
        return nodeName(attributes, children);
    }
    children = flatten(children).map((vchild) => typeof vchild === 'object' ? vchild : createTextVNode(vchild));
    return {
        type: ELEMENT_NODE,
        node: null,
        nodeName,
        attributes,
        children,
        key: attributes.key || null
    };
}

function createTextVNode(text) {
    return {
        type: TEXT_NODE,
        node: null,
        text
    };
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
    if (nodeName.hasOwnProperty('raw')) {
        let tpl = cache.get(nodeName);
        if (!tpl) {
            cache.set(nodeName, tpl = build(nodeName));
        }
        const result = evaluate(tpl, arguments, []);
        return result.length > 1 ? result : result[0];
    }
    return createVNode(nodeName, attributes, ...children);
}
