# React Content Font

## Languages

- [English](README.md)
- [日本語](README_JP.md)
- [中文](README_ZH.md)

## 如何进行安装？

`npm install react-content-font`

## 为什么我应该对此包进行关注？

如果你正在为如日语这类语言开发React应用，并且希望使用非系统字体，那么你可能会对此包产生兴趣。

如日语这类语言的字体文件体积巨大。例如，[Noto Sans Japanese](https://fonts.google.com/noto/specimen/Noto+Sans+JP?query=noto+sans+jp)的单个字重（font weight）就有5.7 MB。让你的用户下载这样大的文件显然不理想。尤其是如果你需要的不止一个字重...

## 这个包能做什么？

此包能检查一个页面，提取出该页面上所有的独特字符，并使用[优化请求](https://developers.google.com/fonts/docs/getting_started#optimizing_your_font_requests)从[Google Fonts](https://fonts.google.com/)请求只包含这些字符的字体！

在初始渲染时，它使用[createTreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker)高效地遍历DOM并获取所有字符。在初始渲染之后，它使用[MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) 只检查那些动态添加了新文本的更新节点。

## 如何使用？

使用方式非常简单，只需在应用的某个高层次位置添加上下文提供者即可。

例如，如果你有一个使用 App Router 的 [Next.js](https://nextjs.org/)应用，你可以像这样更新你的 `app/layout.tsx`文件：

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

只需通过 `fontName` 属性提供你需要的字体，默认情况下它将只请求普通的字重（也就是400）。

如果我需要多个字重怎么办？

请求额外字重只需要添加 `fontWeights` 属性，如下所示：

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

## 如果我需要某些字重的斜体呢？

我不确定是否有日语字体包含斜体样式，但也许你需要使用的字体有？如果是这样，你可以按照下面的方式请求你需要的任何字重的斜体样式：

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

在这个例子中，除了常规的400和600字重，我们还会获取到400和900的斜体。

## 如果我想选择font-display的值怎么办？

在[Google Fonts API](https://developers.google.com/fonts/docs/getting_started#use_font-display)文档中，它提到 "通常更适合指定除默认 auto 以外的值"。默认情况下，当你为 Google Font 生成一个链接标签时，它设置 `display=swap`。因此，这个包也会采用相同的设置。

但是，如果你需要别的配置，只需设置 `display` 属性即可，如下：

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

`display` 的有效值是 `'auto' | 'block' | 'swap' | 'fallback' | 'optional'`。

## 如果我想在字体加载完毕后再显示内容，或者展示一个加载状态之类的呢？

幸运的是，这个包还导出了一个具有标志位的上下文挂钩，它能让你知道字体是否已经加载完毕。

下面是一个`PageText`组件的例子，该组件根据上下文将`display`从`hidden`改变为`visible`。

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

重要的一点是，**你必须渲染文本**否则字符将不会被发现，并且不会被包含在请求的字体中。

例如，**不要这样做**：

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

## 如果我想做类似的事情，但是在初始渲染之后呢？

幸运的是，上下文中还有另一个标志位，它能让你知道字体是否正在被更新。

与前面的例子类似，你可以推迟显示更新的内容，像这样：

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

重要的一点是，**你必须渲染文本**否则字符将不会被发现，并且不会被包含在请求的字体中。

## 这真酷，我可以请你喝咖啡吗？

当然可以！

<a href="https://www.buymeacoffee.com/adbutterfield" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
