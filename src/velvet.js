function flatten(arr) {
    return [].concat.apply([], arr);
}

export function html(nodeName, attributes, ...children) {
    attributes = attributes || {};
    children = flatten(children);
    return {
        nodeName,
        attributes,
        children
    };
}
