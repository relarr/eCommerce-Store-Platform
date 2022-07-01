import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './NavLinks.css';

const NavLinks = (props) => {
  const authToken = useSelector((state) => state.auth.token);

  return (
    <ul className='nav-links'>
      <li style={authToken && { margin: '0' }}>
        <NavLink to='/cart' onClick={props.onClick}>
          MY CART
        </NavLink>
      </li>
      {!authToken && (
        <li>
          <NavLink to='/auth' onClick={props.onClick}>
            SIGN IN
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
