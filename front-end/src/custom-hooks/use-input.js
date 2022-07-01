import { useState } from 'react';

const useInput = (validateInput) => {
  const [currentValue, setCurrentValue] = useState('');
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const isValid = validateInput(currentValue);
  const hasError = !isValid && hasBeenTouched;

  const valueChangeHandler = (event) => {
    setCurrentValue(event.target.value);
  };

  const blurHandler = () => {
    setHasBeenTouched(true);
  };

  const reset = () => {
    setCurrentValue('');
    setHasBeenTouched(false);
  };

  return {
    currentValue,
    setCurrentValue,
    isValid,
    hasError,
    valueChangeHandler,
    hasBeenTouched,
    blurHandler,
    reset,
  };
};

export default useInput;
