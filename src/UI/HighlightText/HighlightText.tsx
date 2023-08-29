import React from 'react';

import styles from './styles.modules.scss';

export interface HighlightTextPropsType {
  text?: string;
  highlight: string;
}

export const HighlightText = ({
  highlight,
  text = ''
}: HighlightTextPropsType) => {
  const words = text.split(' ');
  const lowercaseHighlight = highlight.toLowerCase();
  const matchHighlight = new RegExp(`(${lowercaseHighlight})`, 'gi');

  const wordsParts = words.map((wordPart) =>
    wordPart.split(matchHighlight).filter((part) => part)
  );

  return (
    <span className={styles.highlight}>
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
