import React from 'react';

type CreateFontLinkTagsProps = {
  fontName: string;
  newChars: string[];
  onLoad?: () => void;
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  fontStyle?: 'ital';
};

export default function createFontLinkTags({
  fontName,
  newChars,
  onLoad,
  display,
  fontStyle,
}: CreateFontLinkTagsProps): React.ReactElement<HTMLLinkElement>[] {
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

  // css2?family=Roboto:ital,wght@0,100;0,300;0,700;1,100;1,400;1,500;1,700;1,900

  return batches.map((batch, index) => {
    const encodedText = encodeURIComponent(Array.from(batch).join(''));
    const url = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s/g, '+')}${
      fontStyle ? `:${fontStyle}` : ''
    }&text=${encodedText}&display=${display}`;

    if (onLoad && index === batches.length - 1) {
      return <link rel="stylesheet" href={url} key={encodedText.slice(0, 10)} onLoad={onLoad} />;
    }
    return <link rel="stylesheet" href={url} key={encodedText.slice(0, 10)} />;
  });
}
