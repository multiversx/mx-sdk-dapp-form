import React from 'react';

export const HighlightText = (text = '', highlight: string) => {
  const word = highlight.toLowerCase();
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  const occurences = parts.filter((part, index) =>
    index === 0 ? Boolean(part) : true
  );

  return occurences.map((occurence, index) =>
    occurence.toLowerCase() === word ? (
      <strong key={`${occurence}-${index}`}>{occurence}</strong>
    ) : (
      <span key={`${occurence}-${index}`}>{occurence}</span>
    )
  );
};
