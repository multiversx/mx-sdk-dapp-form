import React from 'react';

export const HighlightText = (text = '', highlight: string) => {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  const word = highlight.toLowerCase();

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === word ? (
          <strong key={`${part}-${index}`}>{part}</strong>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </>
  );
};
