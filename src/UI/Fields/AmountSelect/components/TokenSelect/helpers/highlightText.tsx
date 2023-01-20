import React, { Fragment } from 'react';

export const highlightText = (text: string = '', highlight: string) => {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  const word = highlight.toLowerCase();

  return (
    <Fragment>
      {parts.map((part, index) =>
        part.toLowerCase() === word ? (
          <strong key={`${part}-${index}`}>{part}</strong>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </Fragment>
  );
};
