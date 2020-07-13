import React from 'react';

const escapeRegExp = (str) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const MatchSubString = ({ source, match }) => {
  if (!source.toLowerCase().includes(match.toLowerCase())) {
    return <>{source}</>;
  }

  const [start, end] = source.split(
    new RegExp(`${escapeRegExp(match)}(.+)?`, 'i'),
  );

  return (
    <>
      {[
        start,
        <b key={match}>{source.substr(start.length, match.length)}</b>,
        end,
      ]}
    </>
  );
};

export default MatchSubString;