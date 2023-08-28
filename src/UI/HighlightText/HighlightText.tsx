import React from 'react';

import styles from './styles.modules.scss';

export const HighlightText = (text = '', highlight: string) => {
  const words = text.split(' ');
  const lowercaseHighlight = highlight.toLowerCase();
  const matchHighlight = new RegExp(`(${lowercaseHighlight})`, 'gi');

  const wordsParts = words.map((wordPart) =>
    wordPart.split(matchHighlight).filter((part) => part)
  );

  return (
    <span className={styles.highlight}>
      {wordsParts.map((wordPart, wordIndex) => (
        <span key={`${wordPart}-${wordIndex}`}>
          {wordPart.map((part, index) =>
            part.toLowerCase() === lowercaseHighlight && lowercaseHighlight ? (
              <strong key={`${part}-${index}`}>{part}</strong>
            ) : (
              <span key={`${part}-${index}`}>{part}</span>
            )
          )}
        </span>
      ))}
    </span>
  );
};
