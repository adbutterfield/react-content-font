# React Content Font

## How to install?

`npm install react-content-font`

## Why should I care about this package?

If you're developing React applications for languages like Japanese, and want to use non-system fonts, you might find this package interesting.

Fonts for languages like Japanese, are very big. A single font weight for [Noto Sans Japanese](https://fonts.google.com/noto/specimen/Noto+Sans+JP?query=noto+sans+jp) for instance is 5.7 MB. Definitely not ideal to make your users download such a big file. Not to mention if you want more than one font weight...

## What does this thing do?

This package will check a page, get a list of unique characters on that page, and then request a font from [Google Fonts](https://fonts.google.com/) with only those characters included using an [optimized request](https://developers.google.com/fonts/docs/getting_started#optimizing_your_font_requests)!

On initial render, it uses [createTreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker) to efficiently walk the DOM and get all the characters. After initial render, it uses [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) and checks only the updated nodes for new text that get added dynamically.

## How to use it?

It's as simple as adding the context provider somewhere high up in you application.

For example, if you have a [Next.js](https://nextjs.org/) app using App Router, you can update your `app/layout.tsx` file like so:

```tsx
import FontProvider from 'react-content-font';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="jp">
      <body>
        <FontProvider fontName="Noto Sans JP">{children}</FontProvider>
      </body>
    </html>
  );
}
```

Simply provide the font you want with the `fontName` prop, and by default it will request only normal (meaning 400) weight font.

## What if I want more than one font weight?

Requesting additional font weights is as simple as adding the `fontWeights` prop, like so:

```tsx
import FontProvider from 'react-content-font';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="jp">
      <body>
        <FontProvider fontName="Noto Sans JP" fontWeights={[400, 600]}>
          {children}
        </FontProvider>
      </body>
    </html>
  );
}
```

## What if I also want italic for some font weights?

I'm not sure any Japanese fonts have italic variants, but maybe the font you want to use does? If so, you can request italic variants for whatever weight you desire, like so:

```tsx
import FontProvider from 'react-content-font';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="jp">
      <body>
        <FontProvider
          fontName="Noto Sans JP"
          fontWeights={[400, 600, ['ital', 400], ['ital', 900]]}
        >
          {children}
        </FontProvider>
      </body>
    </html>
  );
}
```

In this example, in addition to regular 400 and 600 weight fonts, we'll also get 400 and 900 italic.

## What if I want to pick the font-display?

In the [Google Fonts API](https://developers.google.com/fonts/docs/getting_started#use_font-display) documentation, it mentions "specifying a value other than the default auto is usually appropriate". By default when you generate a link tag for a Google Font, it sets `display=swap`. So this package will do the same thing.

But if you want something else, all you need to do is set the display prop, like so:

```tsx
import FontProvider from 'react-content-font';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="jp">
      <body>
        <FontProvider fontName="Noto Sans JP" display="block">
          {children}
        </FontProvider>
      </body>
    </html>
  );
}
```

Valid values for `display` are `'auto' | 'block' | 'swap' | 'fallback' | 'optional'`;

## What if I want to wait for the font to be loaded before showing content, or show a loading state or something?

Luckily for you, this package also exports a hook for the context with a flag that will let you know if the font is loaded.

Here is an example of a `PageText` component, that changes the `display` from `hidden` to `visible` based on context.

```tsx
'use client';

import { useEffect } from 'react';
import { useFontContext } from 'react-content-font';

export default function PageText() {
  const { isFontLoaded } = useFontContext();

  return (
    <p style={{ visibility: isFontLoaded ? 'visible' : 'hidden' }}>
      よそはほかまあこの威圧心というのの後をしないう。きっと場合で仕事帰りはひょろひょろその評でたなりでするが行くたをも表裏できなけれでば、なぜにはもっなないうた。個人にできたのはついに十月から向後ますだない。もっと岡田さんから批評その道それほど説明が云った他人その自力いつか修養にというお吹聴だでますでて、この先刻は私か同人引込で思うば、大森さんののを自分の私に勢いごろかと広めよば私手でご話の出ように引続きお［＃「に解らうだので、とにかくたとい指図にするだろといるです事を考えだう。
    </p>
  );
}
```

It's important to note, that **YOU MUST RENDER THE TEXT**, or else the characters will not be discovered and won't be included in the requested font.

For example, **DO NOT DO THIS**:

```tsx
'use client';

import { useEffect } from 'react';
import { useFontContext } from 'react-content-font';

export default function PageText() {
  const { isFontLoaded } = useFontContext();

  return (
    <>
      {isFontLoaded && (
        <p>
          よそはほかまあこの威圧心というのの後をしないう。きっと場合で仕事帰りはひょろひょろその評でたなりでするが行くたをも表裏できなけれでば、なぜにはもっなないうた。個人にできたのはついに十月から向後ますだない。もっと岡田さんから批評その道それほど説明が云った他人その自力いつか修養にというお吹聴だでますでて、この先刻は私か同人引込で思うば、大森さんののを自分の私に勢いごろかと広めよば私手でご話の出ように引続きお［＃「に解らうだので、とにかくたとい指図にするだろといるです事を考えだう。
        </p>
      )}
    </>
  );
}
```

## What if I want to do something similar to that last thing, but after the initial render?

Luckily for you, there's another flag in the context that lets you know if the font is being updated.

Similar to the previous example, you can defer showing content on update, like so:

```tsx
'use client';

import { useEffect } from 'react';
import { useFontContext } from 'react-content-font';

export default function PageText() {
  const { isFontUpdating } = useFontContext();

  return (
    <p style={{ visibility: isFontUpdating ? 'visible' : 'hidden' }}>
      よそはほかまあこの威圧心というのの後をしないう。きっと場合で仕事帰りはひょろひょろその評でたなりでするが行くたをも表裏できなけれでば、なぜにはもっなないうた。個人にできたのはついに十月から向後ますだない。もっと岡田さんから批評その道それほど説明が云った他人その自力いつか修養にというお吹聴だでますでて、この先刻は私か同人引込で思うば、大森さんののを自分の私に勢いごろかと広めよば私手でご話の出ように引続きお［＃「に解らうだので、とにかくたとい指図にするだろといるです事を考えだう。
    </p>
  );
}
```

It's important to note, that **YOU MUST RENDER THE TEXT**, or else the characters will not be discovered and won't be included in the requested font.

## This is cool, can I buy you a coffee?

Yes please!

<a href="https://www.buymeacoffee.com/adbutterfield" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
