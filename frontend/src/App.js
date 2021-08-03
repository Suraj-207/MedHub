import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// import CheckLogin from "./pages/CheckLogin";
import MainNavigation from "./shared/Navigation/MainNavigation";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
        {/* <Route path="/check" exact>
          <CheckLogin />
        </Route> */}
        <Route path="/patient/home" exact>
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
    </Router>
  );
}

export default App;
