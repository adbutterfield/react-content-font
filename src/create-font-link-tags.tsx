import React from 'react';

export type FontWeights = Array<
  | (100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900)
  | ['ital', 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900]
>;

export type Display = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';

function getWeights(fontWeights: FontWeights): string {
  return fontWeights.reduce((acc, weight, index) => {
    const newWeight = Array.isArray(weight) ? `1,${weight[1]}` : `0,${weight}`;
    const separator = index === fontWeights.length - 1 ? '' : ';';
    return (acc += `${newWeight}${separator}`);
  }, '');
}

type CreateFontLinkTagsProps = {
  fontName: string;
  newChars: string[];
  onLoad?: () => void;
  display: Display;
  fontWeights?: FontWeights;
};

export default function createFontLinkTags({
  fontName,
  newChars,
  onLoad,
  display,
  fontWeights,
}: CreateFontLinkTagsProps): React.ReactElement<HTMLLinkElement>[] {
  const requestItalic = Boolean(
    fontWeights &&
      fontWeights.some(
        (weight) => Array.isArray(weight) && weight.length === 2 && weight[0] === 'ital',
      ),
  );
  const requestWeights = typeof fontWeights !== 'undefined';
  const batches = [];
  const batchSize = 200;
  let currentBatch = new Set<string>();

  for (const char of newChars) {
    currentBatch.add(char);

    if (currentBatch.size === batchSize) {
      batches.push(currentBatch);
      currentBatch = new Set<string>();
    }
  }

  if (currentBatch.size > 0) {
    batches.push(currentBatch);
  }

  return batches.map((batch, index) => {
    const encodedText = encodeURIComponent(Array.from(batch).join(''));
    const url = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s/g, '+')}${
      requestItalic ? `:ital` : ''
    }${requestItalic && requestWeights ? ',' : ''}${!requestItalic && requestWeights ? ':' : ''}${
      requestWeights ? `wght@${getWeights(fontWeights)}` : ''
    }&text=${encodedText}&display=${display}`;

    if (onLoad && index === batches.length - 1) {
      return <link rel="stylesheet" href={url} key={encodedText.slice(0, 10)} onLoad={onLoad} />;
    }
    return <link rel="stylesheet" href={url} key={encodedText.slice(0, 10)} />;
  });
}
