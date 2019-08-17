import { createVNode, createTextVNode } from './html';

export default function recycle(node) {
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
