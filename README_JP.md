# React Content Font

## Languages

- [English](README.md)
- [日本語](README_JP.md)
- [中文](README_ZH.md)

## インストール方法は？

`npm install react-content-font`

## このパッケージがなぜ重要なのか？

日本語等、フォントファイルの大きな言語でReactアプリケーションを開発し、システムフォント以外を使用したい場合、このパッケージは便利です。

日本語のような言語のフォントファイルは非常に大きいです。たとえば、[Noto Sans Japanese](https://fonts.google.com/noto/specimen/Noto+Sans+JP?query=noto+sans+jp)の単一のフォントウェイトは5.7 MBです。ユーザーにこれほど大きなファイルをダウンロードさせるのは理想的ではありません。一つ以上のフォントウェイトが必要な場合など...

## このパッケージは何をしますか？

このパッケージはページをチェックし、そのページのユニークな文字のリストを取得し、それらの文字のみを含むフォントを[Google Fonts](https://fonts.google.com/)から[最適化されたリクエスト](https://developers.google.com/fonts/docs/getting_started#optimizing_your_font_requests)でリクエストします！

初期レンダリングでは、[createTreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker)を使用して効率的にDOMを走査し、すべての文字を取得します。初期レンダリング後は、[MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)を使用して、動的に追加される新しいテキストのみをチェックします。

## 使い方は？

アプリケーションのトップレベルにコンテキストプロバイダーを追加するだけです。

例えば、App Routerを使用した[Next.js](https://nextjs.org/)アプリがある場合、`app/layout.tsx`ファイルを以下のように更新できます：

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

`fontName` プロパティで希望するフォントを提供するだけで、デフォルトでは正常（つまり400）ウェイトのフォントのみをリクエストします。

## もし一つ以上のフォントウェイトが欲しい場合は？

追加のフォントウェイトをリクエストするには、`fontWeights` プロパティを追加するだけです：

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

## もし一部のフォントウェイトで斜体を欲しい場合は？

日本語のフォントには斜体のバリアントが無い場合が多いですが、使用するフォントによってはあるかもしれません。その場合、以下のようにして、希望するウェイトの斜体バリアントをリクエストできます：

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

この例では、通常の400と600ウェイトのフォントに加えて、400と900のイタリックも取得します。

## もし私がfont-displayを選びたい場合はどうすればいいですか？

[Google Fonts API](https://developers.google.com/fonts/docs/getting_started#use_font-display) のドキュメンテーションでは、"デフォルトのauto以外の値を指定することが通常は適切です"と述べられています。Google Fontのリンクタグを生成するときにはデフォルトで`display=swap`が設定されます。ですから、このパッケージも同様のことを行います。

しかし、他の何かを望む場合は、以下のように `display` プロパティを設定するだけです：

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

`display` の有効な値は `'auto' | 'block' | 'swap' | 'fallback' | 'optional'`です。

## コンテンツを表示する前にフォントがロードされるのを待つ、またはローディング状態を表示したい場合は？

幸いなことに、このパッケージはフォントがロードされているかどうかを知らせてくれるフラグを持つコンテキストのフックもエクスポートしています。

以下に`PageText`コンポーネントの例を示します。このコンポーネントは、コンテキストに基づいて`display`を`hidden`から`visible`に変更します。

```tsx
'use client';

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

ここで注意すべき点は、**必ずテキストをレンダリングする必要がある**ということです。

例えば、**次のようなことはしないでください**：

```tsx
'use client';

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

## 初期レンダリング後に、先ほどと同様の操作を行いたい場合は？

幸いなことに、コンテキストにはフォントが更新されているかどうかを知らせる別のフラグがあります。

前の例と同様に、更新時のコンテンツの表示を遅延させることができます：

```tsx
'use client';

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

ここで注意すべき点は、**必ずテキストをレンダリングする必要がある**ということです。

## これは素晴らしいです、コーヒーをご馳走できますか？

ぜひお願いします！

<a href="https://www.buymeacoffee.com/adbutterfield" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
