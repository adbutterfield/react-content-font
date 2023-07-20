import createFontLinkTags from './create-font-link-tags';
import type { FontWeights, Display } from './create-font-link-tags';

export type State = {
  fontName: string;
  linkTags: React.ReactElement<HTMLLinkElement>[];
  requestedChars: Set<string>;
  display: Display;
  isFontUpdating: boolean;
  isFontLoaded: boolean;
  fontWeights?: FontWeights;
};

export type Action =
  | { type: 'INITIALIZE'; uniqueChars: Set<string>; onLoad: () => void }
  | { type: 'ADD_LINK_TAG'; newChars: Set<string>; onLoad: () => void }
  | { type: 'FONT_UPDATING' }
  | { type: 'FONT_UPDATED' }
  | { type: 'FONT_LOADED' };

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INITIALIZE': {
      const linkTags = createFontLinkTags({
        fontName: state.fontName,
        newChars: [...action.uniqueChars],
        onLoad: action.onLoad,
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
          onLoad: action.onLoad,
          display: state.display,
          fontWeights: state.fontWeights,
        });
        return {
          ...state,
          linkTags: [...state.linkTags, ...newLinkTags],
          requestedChars: new Set([...state.requestedChars, ...newChars]),
          isFontUpdating: true,
        };
      }
      return { ...state, isFontUpdating: false };
    }
    case 'FONT_UPDATING': {
      return {
        ...state,
        isFontUpdating: true,
      };
    }
    case 'FONT_UPDATED': {
      return {
        ...state,
        isFontUpdating: false,
      };
    }
    case 'FONT_LOADED': {
      return {
        ...state,
        isFontLoaded: true,
      };
    }
    default: {
      return state;
    }
  }
}
