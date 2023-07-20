'use client';

import React, { createContext, useContext, useEffect } from 'react';
import useFontFromContent from './use-font-from-content';

type FontContextState =
  | {
      isFontLoaded: boolean;
      isFontUpdating: boolean;
    }
  | undefined;

const context = createContext<FontContextState>(undefined);

type FontContextProps = {
  fontName: string;
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  fontWeights?: Array<
    | (100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900)
    | ['ital', 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900]
  >;
};

export default function FontContext(props: React.PropsWithChildren<FontContextProps>) {
  const { fontName, display = 'swap', fontWeights, children } = props;
  const { linkTags, isFontLoaded, isFontUpdating } = useFontFromContent({
    fontName,
    display,
    fontWeights,
  });
  const { Provider: FontContextProvider } = context;

  return (
    <FontContextProvider value={{ isFontLoaded, isFontUpdating }}>
      {linkTags}
      {children}
    </FontContextProvider>
  );
}

export function useFontContext(): {
  isFontLoaded: boolean;
  isFontUpdating: boolean;
} {
  const fontContext = useContext(context);

  useEffect(() => {
    if (!fontContext) {
      throw new Error('useFontContext must be used within a FontContext');
    }
  }, [fontContext]);

  return fontContext || { isFontLoaded: false, isFontUpdating: false };
}
