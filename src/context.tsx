'use client';

import React, { createContext, useContext, useState } from 'react';
import useFontFromContent from './use-font-from-content';

// css2?family=Roboto:ital,wght@0,100;0,300;0,700;1,100;1,400;1,500;1,700;1,900

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
};

export default function FontContext(props: React.PropsWithChildren<FontContextProps>) {
  const { fontName, display = 'swap', children } = props;
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const { state } = useFontFromContent({ fontName, display, onLoad: () => setIsFontLoaded(true) });
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
