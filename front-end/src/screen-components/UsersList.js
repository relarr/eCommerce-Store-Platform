import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, userActions } from '../store/user';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';
import './UsersList.css';

const UsersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, loadingUsers, error, userDeleteSuccess } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getUsers());
    if (userDeleteSuccess) dispatch(userActions.resetDeleteSuccess());
  }, [dispatch, userDeleteSuccess]);

  const deleteUserHandler = (userId) => {
    dispatch(deleteUser(userId));
  };

  return (
    <div className='users-list'>
      <h2>USERS</h2>
      {loadingUsers === 'pending' ? (
        <LoadingSpinner asOverlay />
      ) : error ? (
        <Notification message={error.message} alert />
      ) : users && users.length === 0 ? (
        <h2>There are no users</h2>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>MANAGE</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <span className='material-symbols-outlined'>
                        done_outline
                      </span>
                    ) : (
                      <span className='material-symbols-outlined'>close</span>
                    )}
                  </td>
                  <td>
                    <span
                      className='material-symbols-outlined'
                      onClick={() => navigate(`/admin/user/${user.id}/edit`)}
                    >
                      edit
                    </span>
                    <span
                      className='material-symbols-outlined'
                      onClick={() => deleteUserHandler(user.id)}
                    >
                      delete_forever
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
