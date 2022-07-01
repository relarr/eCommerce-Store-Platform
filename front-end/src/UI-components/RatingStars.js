import { useState } from 'react';
import './RatingStars.css';

const RatingStars = (props) => {
  const arr = new Array(5).fill(0);

  if (props.rate >= 0) {
    for (let i = 0; i <= props.rate; ++i) arr[i] = 1;
  }

  const [stars, setStars] = useState(arr);

  const rateHandler = async (rate) => {
    for (let i = 0; i <= rate; ++i) {
      await new Promise((promise) => setTimeout(promise, 70));
      let cArray = [...stars];
      cArray[i] = 1;
      stars[i] = cArray[i];
      setStars(cArray);
    }

    for (let i = rate + 1; i < stars.length; ++i) {
      let cArray = [...stars];
      cArray[i] = 0;
      stars[i] = cArray[i];
      setStars(cArray);
    }

    props.onInput(rate);
  };

  return (
    <div className={`stars ${props.disabled && 'stars--no-rate'}`}>
      {stars.map((el, i) => {
        return (
          <div
            className='star'
            key={i}
            onClick={() => rateHandler(i)}
            style={{ borderBottom: stars[i] === 1 && '8px solid yellow' }}
          ></div>
        );
      })}
    </div>
  );
};

export default RatingStars;
