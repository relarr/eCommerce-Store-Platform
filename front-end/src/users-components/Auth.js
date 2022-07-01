import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/auth';
import useHttpRequest from '../custom-hooks/use-http-request';
import Form from '../UI-components/Form';
import Input from '../UI-components/Input';
import Button from '../UI-components/Button';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';
import './Auth.css';

const Auth = () => {
  const dispatch = useDispatch();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [nameIsValid, setNameIsValid] = useState(false);
  const [email, setEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [rePassword, setRePassword] = useState('');
  const [rePasswordIsValid, setRePasswordIsValid] = useState(false);

  const [error, setError] = useState({
    currEmail: '',
    currPassword: '',
    message: null,
  });
  const [resetField, setResetField] = useState(false);

  const { send, requestIsLoading } = useHttpRequest();

  const { token } = useSelector((state) => state.auth);

  const location = useLocation();
  const redirect = location.search && location.search.split('=')[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate(`/${redirect}`);
  }, [navigate, redirect, token]);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (isSignUp) {
      try {
        const response = await send(
          process.env.REACT_APP_BACKEND_URL + '/api/users/signup',
          'POST',
          { 'Content-Type': 'application/json' },
          { name, email, password }
        );
        if (response)
          dispatch(
            authActions.login({
              token: response.token,
              userId: response.userId,
            })
          );
      } catch (error) {
        setError({
          currEmail: email,
          currPassword: password,
          message: error.message,
        });
        throw new Error(error.message);
      }
    } else {
      try {
        const response = await send(
          process.env.REACT_APP_BACKEND_URL + '/api/users/login',
          'POST',
          { 'Content-Type': 'application/json' },
          { email, password }
        );
        if (response) {
          dispatch(
            authActions.login({
              token: response.token,
              userId: response.userId,
            })
          );
        }
      } catch (error) {
        setError({
          currEmail: email,
          currPassword: password,
          message: error.message,
        });
        throw new Error(error.message);
      }
    }

    setResetField(true);
  };

  useEffect(() => {
    if (resetField) setResetField(false);
  }, [resetField]);

  if (
    error.message &&
    (error.currEmail !== email || error.currPassword !== password)
  ) {
    setError({ currEmail: '', currPassword: '', message: null });
  }

  return (
    <div className='auth'>
      {requestIsLoading && <LoadingSpinner asOverlay />}
      {error.message && <Notification message={error.message} alert />}
      <Form
        className='form'
        title={isSignUp ? 'Sign Up' : 'Sign In'}
        onSubmit={submitHandler}
      >
        {isSignUp && (
          <Input
            type='text'
            id='name'
            name='name'
            label='Your name'
            length={3}
            valid={(validity) => setNameIsValid(validity)}
            value={(curr) => setName(curr)}
            bool={resetField}
          />
        )}
        <Input
          type='email'
          id='email'
          name='email'
          label='Email address'
          valid={(validity) => setEmailIsValid(validity)}
          value={(curr) => setEmail(curr)}
          bool={resetField}
        />
        <Input
          type='password'
          id='password'
          name='password'
          label='Password'
          length={6}
          valid={(validity) => setPasswordIsValid(validity)}
          value={(value) => setPassword(value)}
          bool={resetField}
        />
        {isSignUp && (
          <Input
            type='password'
            id='repassword'
            name='confirmation password'
            label='Re-enter password'
            length={6}
            valid={(validity) => setRePasswordIsValid(validity)}
            value={(value) => setRePassword(value)}
            bool={resetField}
            setInvalid={password !== rePassword}
          />
        )}
        <Button
          disabled={
            isSignUp
              ? !nameIsValid ||
                !emailIsValid ||
                !passwordIsValid ||
                !rePasswordIsValid
              : !emailIsValid || !passwordIsValid
          }
        >
          SUBMIT
        </Button>
      </Form>
      <div className='auth'>
        <Button onClick={() => setIsSignUp((prev) => !prev)}>
          {isSignUp ? 'LOG IN' : 'CREATE AN ACCOUNT'}
        </Button>
      </div>
    </div>
  );
};

export default Auth;
