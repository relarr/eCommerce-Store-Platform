import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, updateUserProfile, userActions } from '../store/user';
import { fetchUserOrders } from '../store/order';
import Form from '../UI-components/Form';
import Button from '../UI-components/Button';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';
import './Profile.css';

const LoggedIn = () => {
  const dispatch = useDispatch();
  const { user, loading, error, updateProfileSuccess } = useSelector(
    (state) => state.user
  );

  const { userId, token } = useSelector((state) => state.auth);
  const {
    userOrders,
    loading: loadingOrders,
    error: errorOrders,
  } = useSelector((state) => state.order);

  const [name, setName] = useState('');
  const [nameInputTouched, setNameInputTouched] = useState(false);
  const [email, setEmail] = useState('');
  const [emailInputTouched, setEmailInputTouched] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordInputTouched, setPasswordInputTouched] = useState(false);
  const [rePassword, setRePassword] = useState('');
  const [rePasswordInputTouched, setRePasswordInputTouched] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    dispatch(fetchUserOrders());

    if (!userId) navigate('/');
    else {
      if (!user || updateProfileSuccess) {
        dispatch(getUser(userId));
        if (updateProfileSuccess)
          dispatch(userActions.resetUpdateProfileSuccess());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, navigate, userId, user, updateProfileSuccess, token]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateUserProfile({ id: user._id, name, email, password }));
    setPassword('');
    setPasswordInputTouched(false);
    setRePassword('');
    setRePasswordInputTouched(false);
  };

  return loading === 'pending' ? (
    <LoadingSpinner asOverlay />
  ) : error ? (
    <Notification message={error.message} alert />
  ) : (
    user && (
      <div className='profile'>
        {loadingOrders === 'pending' ? (
          <LoadingSpinner asOverlay />
        ) : errorOrders ? (
          <Notification message={error.message} alert />
        ) : (
          userOrders && (
            <div className='profile-orders'>
              <h3>YOUR ORDERS</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {userOrders.map((order) => {
                    return (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.createdAt.substring(1, 10)}</td>
                        <td>{order.totalAmount.toFixed(2)}</td>
                        <td>{order.isPaid ? 'YES' : 'NO'}</td>
                        <td>{order.isDelivered ? 'YES' : 'NO'}</td>
                        <td>
                          <Button
                            onClick={() => navigate(`/order/${order._id}`)}
                          >
                            DETAILS
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
        <div className='profile-details'>
          <Form title='PROFILE' onSubmit={submitHandler}>
            <label>Name</label>
            <input
              className={
                name.length < 6 && nameInputTouched ? 'invalid-input' : ''
              }
              type='text'
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => setNameInputTouched(true)}
            />
            <label>Email Address</label>
            <input
              className={
                !email.includes('@') && emailInputTouched ? 'invalid-input' : ''
              }
              type='text'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setEmailInputTouched(true)}
            />
            <label>Password</label>
            <input
              className={
                password.length < 6 && passwordInputTouched
                  ? 'invalid-input'
                  : ''
              }
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => setPasswordInputTouched(true)}
            />
            <label>Re-type Password</label>
            <input
              className={
                rePassword.length < 6 && rePasswordInputTouched
                  ? 'invalid-input'
                  : ''
              }
              type='password'
              value={rePassword}
              onChange={(event) => setRePassword(event.target.value)}
              onBlur={() => setRePasswordInputTouched(true)}
            />

            <Button>UPDATE PROFILE</Button>
          </Form>
        </div>
      </div>
    )
  );
};

export default LoggedIn;
