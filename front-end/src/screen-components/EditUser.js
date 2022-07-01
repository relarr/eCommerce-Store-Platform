import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserForAdmin, updateUser, userActions } from '../store/user';
import Form from '../UI-components/Form';
import Button from '../UI-components/Button';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';
import './EditUser.css';

const EditUser = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const {
    userEdit: user,
    loadingUserEdit,
    updateUserSuccess,
    error,
  } = useSelector((state) => state.user);

  const [name, setName] = useState('');
  const [nameInputTouched, setNameInputTouched] = useState(false);
  const [email, setEmail] = useState('');
  const [emailInputTouched, setEmailInputTouched] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminClicked, setIsAdminClicked] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (updateUserSuccess) {
      dispatch(userActions.resetUpdateUserSuccess());
      navigate('/admin/userslist');
    }

    if (!user || user._id !== uid) {
      dispatch(getUserForAdmin(uid));
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, user, uid, navigate, updateUserSuccess]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateUser({ id: uid, name, email, isAdmin }));
  };

  return loadingUserEdit === 'pending' ? (
    <LoadingSpinner asOverlay />
  ) : error ? (
    <Notification message={error.message} alert />
  ) : (
    user && (
      <div className='edit-form'>
        <Form title='Edit User' onSubmit={submitHandler}>
          <label htmlFor='name'>User Name</label>
          <input
            className={
              name.length < 3 && nameInputTouched ? 'invalid-input' : ''
            }
            type='text'
            value={name}
            onChange={(event) => setName(event.target.value)}
            onFocus={() => setNameInputTouched(true)}
          />
          <label htmlFor='email'>User Email</label>
          <input
            className={
              !email.includes('@') && emailInputTouched ? 'invalid-input' : ''
            }
            type='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onFocus={() => setEmailInputTouched(true)}
          />
          <div className='user-is-admin'>
            <input
              type='checkbox'
              id='isAdmin'
              name='isAdmin'
              checked={isAdmin}
              onClick={() => {
                setIsAdmin(!isAdmin);
                setIsAdminClicked(true);
              }}
              onChange={() => {}}
            />
            <label>User is Admin</label>
          </div>
          <Button
            disabled={
              !nameInputTouched && !emailInputTouched && !isAdminClicked
            }
          >
            SUBMIT
          </Button>
        </Form>
      </div>
    )
  );
};

export default EditUser;
