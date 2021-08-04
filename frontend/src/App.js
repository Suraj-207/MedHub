import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// import CheckLogin from "./pages/CheckLogin";
import { AuthContext } from "./shared/context/AuthContext";
import DoctorHome from "./pages/DoctorDashboard/DoctorHome";
// import PatientHome from "./pages/PatientDashboard/PatientHome";
import MainNavigation from "./shared/Navigation/MainNavigation";

function App() {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((user, token) => {
    setToken(token);
    setUserId(user);
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: user, token: token })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    let fetchData;
    try {
      fetchData = async () => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (storedData === null) {
          console.log("no token");
        } else {
          const data = storedData.token;
          const response = await fetch(
            "http://localhost:5000/api/check-token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          const result = await response.json();
          if (result === null) {
            console.log("unidentified token");
          } else if (result.user && result.token) {
            login(result.user, result.token);
          }
          // auth.login(result.user, result.token);
          console.log(result);
          if (response.ok) {
            console.log("done");
          }
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();
  }, [login]);

  let routes;

  if (token && userId === "doctor") {
    routes = (
      <Switch>
        <Route path="/" exact>
          <DoctorHome />
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
        </Route>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/">
          <Login />
        </Route>
        <Route path="/signup" exact>
          <SignUp />
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
        <Switch>
          <Route path="/">
            <main>{routes}</main>
          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );

  // return (
  //   <Router>
  //     <Switch>
  //       <Route path="/" exact>
  //         <Login />
  //       </Route>
  //       <Route path="/signup" exact>
  //         <SignUp />
  //       </Route>
  //       <Route path="/patient/home" exact>
  //         <MainNavigation />
  //       </Route>
  //       <Route path="/patient/appointment" exact>
  //         <MainNavigation />
  //       </Route>
  //       <Route path="/patient/notification" exact>
  //         <MainNavigation />
  //       </Route>
  //       <Route path="/patient/profile" exact>
  //         <MainNavigation />
  //       </Route>
  //     </Switch>
  //   </Router>
  // );
}

export default App;
