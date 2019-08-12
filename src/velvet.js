export function html(nodeName, attributes, ...children) {
    attributes = attributes || {};
    return {
        nodeName,
        attributes,
        children
    };
}
