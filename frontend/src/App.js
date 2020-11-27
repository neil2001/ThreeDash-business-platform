import "./App.css";

import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Header from "./Components/Header";
import LoginPage from "./Components/LoginPage";

export const useAuth = () => {
  return useProvideAuth();
};

const useProvideAuth = () => {
  const setUser = (user) => {
    sessionStorage.setItem("user", user);
  };
  const getUser = () => {
    return sessionStorage.getItem("user");
  };

  return {
    user: getUser(),
    setUser,
  };
};

export const PrivateRoute = ({ children, ...rest }) => {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return auth.user ? children : <Redirect to="/login" />;
      }}
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/wcw">
          <Header />
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
