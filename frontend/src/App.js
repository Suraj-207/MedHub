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
import PatientHome from "./pages/PatientDashboard/PatientHome";
import ConfirmBooking from "./pages/PatientDashboard/ConfirmBooking";
import Notification from "./pages/PatientDashboard/Notification";
import Appointment from "./pages/PatientDashboard/Appointment";
import DoctorAppointment from "./pages/DoctorDashboard/DoctorAppointment";
import TakeLeave from "./pages/DoctorDashboard/TakeLeave";
import Patient from "./pages/DoctorDashboard/Patient";
import ConfirmPayment from "./pages/PatientDashboard/ConfirmPayment";
import AdminHome from "./pages/AdminDashboard/AdminHome";
import Inactive from "./pages/AdminDashboard/Inactive"
import Imagetest from "./Imagetest";

function App() {
  const { token, login, logout, payment, load, isToken, userId } = useAuth();
  let routes;

  if (token && userId === "doctor") {
    routes = (
      <Switch>
        <Route path="/" exact>
          <MainNavigation />
          <DoctorAppointment />
        </Route>
        <Route path="/doctor/patient" exact>
          <MainNavigation />
          <Patient />
        </Route>
        <Route path="/doctor/leave" exact>
          <MainNavigation />
          <TakeLeave />
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
          <PatientHome />
        </Route>
        <Route path="/patient/appointment" exact>
          <MainNavigation />
          <Appointment />
        </Route>
        <Route path="/confirm" exact>
          <MainNavigation />
          <ConfirmBooking />
        </Route>
        <Route path="/patient/notification" exact>
          <MainNavigation />
          <Notification />
        </Route>
        <Route path="/patient/profile" exact>
          <MainNavigation />
          <PatientProfile />
        </Route>
        <Route path="/patient/signout" exact>
          <MainNavigation />
        </Route>
        <Route path="/confirmpayment/:payment" exact>
          <ConfirmPayment />
        </Route>
      </Switch>
    );
  } else if (token && userId === "admin") {
    routes = (
      <Switch>
        <Route path="/" exact>
          <MainNavigation />
          <AdminHome />
        </Route>
        <Route path="/inactive" exact>
          <MainNavigation />
          <Inactive />
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
        <Route path="/image" exact>
          <Imagetest />
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
        payment: "",
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
