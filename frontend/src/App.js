import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthContext } from "./shared/context/AuthContext";
import MainNavigation from "./shared/Navigation/MainNavigation";
import LoadingSpinner from "./shared/UIComponent/LoadingSpinner";
import DoctorProfile from "./pages/DoctorDashboard/DoctorProfile";
import { useAuth } from "./shared/hooks/auth-hook";
import PatientProfile from "./pages/PatientDashboard/PatientProfile";

function App() {
  const {token, login, logout, load, isToken, userId} = useAuth();
  let routes;

  if (token && userId === "doctor") {
    routes = (
      <Switch>
        <Route path="/" exact>
          <MainNavigation />
        </Route>
        <Route path="/doctor/patient" exact>
          <MainNavigation />
        </Route>
        <Route path="/doctor/leave" exact>
          <MainNavigation />
        </Route>
        <Route path="/doctor/profile" exact>
          <MainNavigation />
          <DoctorProfile />
        </Route>
        <Route path="/doctor/signout" exact>
          <MainNavigation />
        </Route>
      </Switch>
    );
  } else if (token && userId === "patient") {
    routes = (
      <Switch>
        <Route path="/" exact>
          <MainNavigation />
        </Route>
        <Route path="/patient/appointment" exact>
          <MainNavigation />
        </Route>
        <Route path="/patient/notification" exact>
          <MainNavigation />
        </Route>
        <Route path="/patient/profile" exact>
          <MainNavigation />
          <PatientProfile />
        </Route>
        <Route path="/patient/signout" exact>
          <MainNavigation />
        </Route>
      </Switch>
    );
  } else if (!isToken) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
      </Switch>
    );
  } else if (isToken) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <></>
        </Route>
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: token,
        token: token,
        user: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
            <div>{load && <LoadingSpinner asOverlay />} </div>
            <div>{routes}</div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
