'use client';

import React, { createContext, useContext, useState } from 'react';
import useFontFromContent from './use-font-from-content';

type FontContextState = {
  isFontLoaded: boolean;
};

const context = createContext<FontContextState>({ isFontLoaded: false });

type FontContextProps = {
  fontName: string;
  fallback?: React.FC<React.PropsWithChildren>;
};

export default function FontContext(props: React.PropsWithChildren<FontContextProps>) {
  const { fontName, children } = props;
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const { state } = useFontFromContent(fontName, () => setIsFontLoaded(true));
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
