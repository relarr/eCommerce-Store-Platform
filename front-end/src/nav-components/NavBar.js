import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { authActions } from '../store/auth';
import { userActions } from '../store/user';
import Header from './Header';
import NavLinks from './NavLinks';
import DownDrawer from './DownDrawer';
import DropDown from './DropDown';
import SearchBox from './SearchBox';
import './NavBar.css';

const NavBar = (props) => {
  const dispatch = useDispatch();
  const { token: authToken, userId } = useSelector((state) => state.auth);
  const { user, loading } = useSelector((state) => state.user);

  const [showDrawer, setShowDrawer] = useState(false);

  const logoutHandler = () => {
    dispatch(authActions.logout());
    dispatch(userActions.resetUser());
    if (showDrawer) setShowDrawer(false);
  };

  return (
    <div className='nav-bar'>
      <DownDrawer show={showDrawer}>
        <nav className='drawer-links'>
          <NavLinks onClick={() => setShowDrawer(false)} />
          {authToken && user && user.isAdmin && (
            <DropDown title='ADMIN'>
              <NavLink
                onClick={() => setShowDrawer(false)}
                to='/admin/productslist'
              >
                PRODUCTS
              </NavLink>
              <NavLink
                onClick={() => setShowDrawer(false)}
                to='/admin/orderslist'
              >
                ORDERS
              </NavLink>
              <NavLink
                onClick={() => setShowDrawer(false)}
                to='/admin/userslist'
              >
                USERS
              </NavLink>
            </DropDown>
          )}
          {authToken && (
            <DropDown title={user && user.name}>
              <NavLink
                onClick={() => setShowDrawer(false)}
                to={`/${userId}/profile`}
              >
                MY PROFILE
              </NavLink>
              <NavLink to='/' onClick={logoutHandler}>
                SIGN OUT
              </NavLink>
            </DropDown>
          )}
        </nav>
      </DownDrawer>
      <Header>
        <button
          className='burger-button'
          onClick={() => setShowDrawer((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className='main-title'>
          <NavLink to='/'>SHOPMART</NavLink>
        </div>
        <SearchBox />
        <nav className='links'>
          {authToken && loading === 'pending' ? (
            <p>Loading...</p>
          ) : (
            authToken &&
            user &&
            user.isAdmin && (
              <DropDown title='ADMIN'>
                <NavLink to='/admin/productslist'>PRODUCTS</NavLink>
                <NavLink to='/admin/orderslist'>ORDERS</NavLink>
                <NavLink to='/admin/userslist'>USERS</NavLink>
              </DropDown>
            )
          )}
          {authToken && loading === 'pending' ? (
            <p>Loading...</p>
          ) : (
            authToken &&
            user && (
              <DropDown title={`Hi, ${user.name}`}>
                <NavLink to={`/${userId}/profile`}>MY PROFILE</NavLink>
                <NavLink to='/' onClick={logoutHandler}>
                  SIGN OUT
                </NavLink>
              </DropDown>
            )
          )}
          <NavLinks />
        </nav>
      </Header>
    </div>
  );
};

export default NavBar;
