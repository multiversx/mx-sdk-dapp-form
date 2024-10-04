import React from 'react';

import { withStyles, WithStylesImportType } from 'hocs/withStyles';

export interface HighlightTextPropsType {
  text?: string;
  highlight: string;
}

export const HighlightTextComponent = ({
  highlight,
  text = '',
  styles
}: HighlightTextPropsType & WithStylesImportType) => {
  const words = text.split(' ');
  const lowercaseHighlight = highlight.toLowerCase();
  const matchHighlight = new RegExp(`(${lowercaseHighlight})`, 'gi');

  const wordsParts = words.map((wordPart) =>
    wordPart.split(matchHighlight).filter((part) => part)
  );

  return (
    <span className={styles?.highlight}>
      {wordsParts.map((wordPart, wordIndex) => {
        const wordKey = `${wordPart}-${wordIndex}`;

        return (
          <span key={wordKey}>
            {wordPart.map((part, index) => {
              const highlightMatch = part.toLowerCase() === lowercaseHighlight;
              const displayHighlight = lowercaseHighlight && highlightMatch;
              const characterKey = `${part}-${index}`;

              return displayHighlight ? (
                <strong key={characterKey}>{part}</strong>
              ) : (
                <span key={characterKey}>{part}</span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
};

export const HighlightText = withStyles(HighlightTextComponent, {
  ssrStyles: () => import('UI/HighlightText/styles.modules.scss'),
  clientStyles: () => require('UI/HighlightText/styles.modules.scss').default
});
