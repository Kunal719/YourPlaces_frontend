import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import ErrorModal from '../UIElements/ErrorModal';
import { useHttpClient } from '../../hooks/http-hook';
import './NavLinks.css';

const NavLinks = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const navigate = useNavigate();

  const logoutHandler = async (e) => {
    e.preventDefault();

    try {
      await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users/logout');
      auth.logout();
      navigate('/auth');
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <ul className='nav-links'>
        <li>
          <NavLink to='/' exact={true}>
            ALL USERS
          </NavLink>
        </li>
        {auth.isLoggedIn && (
          <li>
            <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink to='/places/new'>ADD PLACE</NavLink>
          </li>
        )}
        {!auth.isLoggedIn && (
          <li>
            <NavLink to='/auth' exact>
              AUTHENTICATE
            </NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink to='/auth' onClick={logoutHandler}>
              LOGOUT
            </NavLink>
          </li>
        )}
      </ul>
    </>
  );
};

export default NavLinks;
