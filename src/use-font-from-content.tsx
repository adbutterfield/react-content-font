import React, { useEffect, useReducer, useCallback } from 'react';
import getUniqueCharsInPage from './get-unique-chars-in-page';
import reducer from './reducer';
import type { Action } from './reducer';
import useMutationObserver from './use-mutation-observer';

const filter = {
  acceptNode: function (node: Node) {
    if (node.parentNode && (node.parentNode.nodeName === 'SCRIPT' || node.parentNode.nodeName === 'STYLE')) {
      return NodeFilter.FILTER_REJECT;
    } else {
      return NodeFilter.FILTER_ACCEPT;
    }
  },
};

export default function useFontFromContent(
  fontName: string,
  onLoad?: () => void,
): {
  state: {
    linkTags: React.ReactElement<HTMLLinkElement, string | React.JSXElementConstructor<any>>[];
  };
  dispatch: React.Dispatch<Action>;
} {
  const [state, dispatch] = useReducer(reducer, {
    fontName,
    linkTags: [<link rel="preconnect" href="https://fonts.gstatic.com/" key="preconnect" />],
    requestedChars: new Set<string>(),
    onLoad,
  });

  const mutationCallback = useCallback((mutations: MutationRecord[]) => {
    const addedNodes: Node[] = [];
    const updatedNodes: Node[] = [];

    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((addedNode) => {
          if (addedNode.nodeType === Node.TEXT_NODE || addedNode.nodeType === Node.ELEMENT_NODE) {
            addedNodes.push(addedNode);
          }
        });
      } else if (mutation.type === 'characterData') {
        if (mutation.target.nodeType === Node.TEXT_NODE || mutation.target.nodeType === Node.ELEMENT_NODE) {
          updatedNodes.push(mutation.target);
        }
      }
    });

    const allChangedNodes = [...addedNodes, ...updatedNodes];
    if (allChangedNodes.length > 0) {
      const newChars = getUniqueCharsInPage(allChangedNodes);
      if (newChars.size > 0) {
        dispatch({ type: 'ADD_LINK_TAG', newChars });
      }
    }
  }, []);

  useMutationObserver(mutationCallback);

  useEffect(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, filter);

    dispatch({
      type: 'INITIALIZE',
      uniqueChars: getUniqueCharsInPage(walker),
    });
  }, []);

  return { state: { linkTags: state.linkTags }, dispatch };
}
