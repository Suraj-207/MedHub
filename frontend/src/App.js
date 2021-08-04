import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthContext } from "./shared/context/AuthContext";
import DoctorHome from "./pages/DoctorDashboard/DoctorHome";
import MainNavigation from "./shared/Navigation/MainNavigation";
import LoadingSpinner from "./shared/UIComponent/LoadingSpinner";

function App() {
  const [token, setToken] = useState(false);
  const [isToken, setIsToken] = useState(true);
  const [userId, setUserId] = useState(null);
  const [load, setLoad] = useState(true);

  const login = useCallback((user, token) => {
    setToken(token);
    setUserId(user);
    localStorage.setItem(
      "userData",
      JSON.stringify({token: token })
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
          setIsToken(false);
          setLoad(false);
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
            setIsToken(false);
            console.log("unidentified token");
          } else if (result.user && result.token) {
            login(result.user, result.token);
            setLoad(false);
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
