export default function* textNodes(nodes: TreeWalker | Node[]): Generator<Node> {
  if (nodes instanceof TreeWalker) {
    let node;
    while ((node = nodes.nextNode())) {
      yield node;
    }
  } else {
    for (const node of nodes) {
      yield node;
    }
  }
}
