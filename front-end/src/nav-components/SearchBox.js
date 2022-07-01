import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI-components/Button';
import './SearchBox.css';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');

  const navigate = useNavigate();
  const submitHandler = (event) => {
    event.preventDefault();
    if (keyword.trim()) navigate(`/search/${keyword}`);
    else navigate('/');
  };

  return (
    <form className='search-box' onSubmit={submitHandler}>
      <input
        type='text'
        name='search-box'
        id='search-box'
        placeholder='Search...'
        onChange={(event) => setKeyword(event.target.value)}
      />
      <Button>SEARCH</Button>
    </form>
  );
};

export default SearchBox;
