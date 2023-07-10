import createFontLinkTags from './create-font-link-tags';
import type { FontWeights } from './create-font-link-tags';

export type State = {
  fontName: string;
  linkTags: React.ReactElement<HTMLLinkElement>[];
  requestedChars: Set<string>;
  onLoad?: () => void;
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  fontWeights?: FontWeights;
};

export type Action =
  | { type: 'INITIALIZE'; uniqueChars: Set<string> }
  | { type: 'ADD_LINK_TAG'; newChars: Set<string> };

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INITIALIZE': {
      const linkTags = createFontLinkTags({
        fontName: state.fontName,
        newChars: [...action.uniqueChars],
        onLoad: state.onLoad,
        display: state.display,
        fontWeights: state.fontWeights,
      });
      return {
        ...state,
        linkTags: [...state.linkTags, ...linkTags],
        requestedChars: action.uniqueChars,
      };
    }
    case 'ADD_LINK_TAG': {
      const newChars = [...action.newChars].filter((char) => !state.requestedChars.has(char));
      if (newChars.length > 0) {
        const newLinkTags = createFontLinkTags({
          fontName: state.fontName,
          newChars,
          onLoad: state.onLoad,
          display: state.display,
          fontWeights: state.fontWeights,
        });
        return {
          ...state,
          linkTags: [...state.linkTags, ...newLinkTags],
          requestedChars: new Set([...state.requestedChars, ...newChars]),
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
}
