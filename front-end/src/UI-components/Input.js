import { useEffect } from 'react';
import useInput from '../custom-hooks/use-input';
import './Input.css';

const Input = (props) => {
  const {
    currentValue,
    isValid,
    hasError,
    valueChangeHandler,
    blurHandler,
    hasBeenTouched,
    reset,
  } = useInput(
    props.type === 'email'
      ? (val) => val.includes('@')
      : props.type === 'text' ||
        props.inputType === 'textarea' ||
        props.type === 'password'
      ? (val) => val.length >= props.length
      : (val) => val >= props.floor
  );

  const { valid, value, bool } = props;
  useEffect(() => {
    valid(isValid);
    value(currentValue);
    if (bool) reset();
  }, [currentValue, isValid, valid, value, bool, reset]);

  let inputType =
    props.inputType !== 'textarea' ? (
      <input
        className={
          hasError || (props.setInvalid && hasBeenTouched)
            ? 'input invalid'
            : 'input'
        }
        type={props.type}
        id={props.id}
        name={props.name}
        step={props.step}
        onChange={valueChangeHandler}
        onBlur={blurHandler}
        value={currentValue}
      />
    ) : (
      <textarea
        className={
          hasError || (props.setInvalid && hasBeenTouched)
            ? 'input invalid'
            : 'input'
        }
        id={props.id}
        name={props.name}
        rows={props.rows || 4}
        onChange={valueChangeHandler}
        onBlur={blurHandler}
        value={currentValue}
      />
    );

  return (
    <div className='input'>
      <label htmlFor={props.name}>{props.label}</label>
      {inputType}
      {hasError && <p>Enter a valid {props.name}</p>}
      {props.setInvalid && hasBeenTouched && <p>Passwords do not match</p>}
    </div>
  );
};

export default Input;
