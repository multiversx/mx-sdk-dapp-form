import React from 'react';

import styles from './styles.modules.scss';

export const HighlightText = (text = '', highlight: string) => {
  const words = text.split(' ');
  const word = highlight.toLowerCase();

  const wordsParts = words.map((word) =>
    word.split(new RegExp(`(${highlight})`, 'gi')).filter((part) => part)
  );

  return (
    <span className={styles.highlight}>
      {wordsParts.map((wordPart, wordIndex) => (
        <span key={`${word}-${wordIndex}`}>
          {wordPart.map((part, index) =>
            part.toLowerCase() === word && word ? (
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
