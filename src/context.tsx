'use client';

import React, { createContext, useContext, useState } from 'react';
import useFontFromContent from './use-font-from-content';

type FontContextState =
  | {
      isFontLoaded: boolean;
    }
  | undefined;

const context = createContext<FontContextState>(undefined);

type FontContextProps = {
  fontName: string;
  fallback?: React.FC<React.PropsWithChildren>;
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  fontWeights?: Array<
    | (100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900)
    | ['ital', 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900]
  >;
};

export default function FontContext(props: React.PropsWithChildren<FontContextProps>) {
  const { fontName, display = 'swap', fontWeights, children } = props;
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const { state } = useFontFromContent({
    fontName,
    display,
    fontWeights,
    onLoad: () => setIsFontLoaded(true),
  });
  const { Provider: FontContextProvider } = context;

  // const FallbackComponent = fallback;

  // const loadingStyles: Partial<React.CSSProperties> = {
  //   left: 0,
  //   position: 'absolute',
  //   top: 0,
  //   visibility: 'hidden',
  // };

  return (
    <FontContextProvider value={{ isFontLoaded }}>
      {state.linkTags}
      {children}
      {/* {FallbackComponent && !isFontLoaded && (
        <FallbackComponent>
          <div style={loadingStyles}>{children}</div>
        </FallbackComponent>
      )}
      {!FallbackComponent && !isFontLoaded && <div style={loadingStyles}>{children}</div>}
      {isFontLoaded && children} */}
    </FontContextProvider>
  );
}

export function useFontContext() {
  const fontContext = useContext(context);

  if (fontContext === undefined) {
    throw new Error('useFontContext must be used within a FontContext');
  }

  return fontContext;
}
