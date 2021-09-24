import React, { useState } from 'react';
import classes from './UserSearch.module.scss';

interface UserSearchProps {
  handleSearchClick(targetText: string): void;
}

export default function UserSearch({ handleSearchClick }: UserSearchProps): React.ReactElement {
  const [text, setText] = useState('');
  const handleTextChange = (e: React.SyntheticEvent) => {
    setText((e.target as HTMLInputElement).value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick(text);
    }
  };

  return (
    <div className={classes.userSearch}>
      <input type='text' value={text} onChange={(e) => handleTextChange(e)} onKeyPress={handleKeyUp} />
      <button type='button' onClick={() => handleSearchClick(text)}>
        Search
      </button>
    </div>
  );
}
