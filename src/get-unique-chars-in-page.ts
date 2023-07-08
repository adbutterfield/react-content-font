import textNodes from './text-nodes';

export default function getUniqueCharsInPage(nodes: TreeWalker | Node[]): Set<string> {
  const chars = new Set<string>();

  for (const node of textNodes(nodes)) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
      for (const char of node.nodeValue) {
        chars.add(char);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.textContent) {
      for (const char of node.textContent) {
        chars.add(char);
      }
    }
  }

  return chars;
}
