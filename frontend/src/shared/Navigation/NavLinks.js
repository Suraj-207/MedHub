import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const handleClick = async () => {
    await auth.logout();
    history.push("/")
  }

  let mainNavigation;
  if (auth.user === "doctor") {
    mainNavigation = (
      <ul className="nav-links">
        {/* {auth.isLoggedIn && ( */}
        <li>
          {/* <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink> */}
          <NavLink to="/" exact>
            Appointments
          </NavLink>
        </li>
        {/* )} */}
        {/* {auth.isLoggedIn && ( */}
        <li>
          <NavLink to="/doctor/patient">Patients</NavLink>
        </li>
        {/* )} */}
        {/* {( !auth.isLoggedIn && */}
        <li>
          <NavLink to="/doctor/leave">Take a leave</NavLink>
        </li>
        {/* )} */}
        {/* {auth.isLoggedIn && ( */}
        <li>
          <NavLink to="/doctor/profile">Profile</NavLink>
        </li>
        <li>
          {/* <NavLink to="/doctor/signout"> */}
          <button onClick={handleClick}>SIGNOUT</button>
          {/* </NavLink> */}
          {/* <button >SIGNOUT</button> */}
        </li>
        {/* )} */}
      </ul>
    );
  } else if(auth.user === "patient") {
    mainNavigation = (
      <ul className="nav-links">
        {/* {auth.isLoggedIn && ( */}
        <li>
          {/* <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink> */}
          <NavLink to="/" exact>
            Home
          </NavLink>
        </li>
        {/* )} */}
        {/* {auth.isLoggedIn && ( */}
        <li>
          <NavLink to="/patient/appointment">Appointments</NavLink>
        </li>
        {/* )} */}
        {/* {( !auth.isLoggedIn && */}
        <li>
          <NavLink to="/patient/notification">notification</NavLink>
        </li>
        {/* )} */}
        {/* {auth.isLoggedIn && ( */}
        <li>
          <NavLink to="/patient/profile">Profile</NavLink>
        </li>
        <li>
          {/* <NavLink to="/patient/signout"> */}
            <button onClick={handleClick}>SIGNOUT</button>
          {/* </NavLink> */}
          {/* <button >SIGNOUT</button> */}
        </li>
        {/* )} */}
      </ul>
    );
  }else{
    mainNavigation = (
      <ul className="nav-links">
        {/* {auth.isLoggedIn && ( */}
        <li>
          {/* <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink> */}
          <NavLink to="/" exact>
            Active Doctors
          </NavLink>
          <NavLink to="/inactive" exact>
            Inactive Doctors
          </NavLink>
        </li>
        <li>
          {/* <NavLink to="/patient/signout"> */}
            <button onClick={handleClick}>SIGNOUT</button>
          {/* </NavLink> */}
          {/* <button >SIGNOUT</button> */}
        </li>
        {/* )} */}
      </ul>
    )
  }
  return <div>{mainNavigation}</div>;
};

export default NavLinks;
