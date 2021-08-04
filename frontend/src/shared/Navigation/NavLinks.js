import React from 'react';
import { NavLink } from 'react-router-dom';


// import {AuthContext} from '../../context/auth-context'
import './NavLinks.css';

const NavLinks = props => {

  // const auth = useContext(AuthContext);
  return <ul className="nav-links">
    <li>
      <NavLink to="/" exact>Home</NavLink>
    </li>
    {/* {auth.isLoggedIn && ( */}
    <li>
      {/* <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink> */}
      <NavLink to="/patient/appointment" exact>Appointment</NavLink>
    </li>
    {/* )} */}
    {/* {auth.isLoggedIn && ( */}
    <li>
      <NavLink to="/patient/notification">Notification</NavLink>
    </li>
    {/* )} */}
    {/* {( !auth.isLoggedIn && */}
    <li>
      <NavLink to="/patient/profile">USER PROFILE</NavLink>
    </li>
    {/* )} */}
    {/* {auth.isLoggedIn && ( */}
      <li>
        {/* <button onClick={auth.logout} >LOGOUT</button> */}
        <button >SIGNOUT</button>
      </li>
    {/* )} */}
  </ul>
};

export default NavLinks;