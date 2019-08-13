function flatten(arr) {
    return [].concat.apply([], arr);
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
