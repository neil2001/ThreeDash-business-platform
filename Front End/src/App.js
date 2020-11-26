import "./App.css";
// import React, { createContext, useState, useContext } from "react";
import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Header from "./Components/Header";
import LoginPage from "./Components/LoginPage";

// const authContext = createContext();

// export const ProvideAuth = ({ children }) => {
//   const auth = useProvideAuth();
//   return <authContext.Provider value={auth}>{children}</authContext.Provider>;
// };

export const useAuth = () => {
  return useProvideAuth();
  // return useContext(authContext);
};

const useProvideAuth = () => {
  // const [user, setUser] = useState(null);
  const setUser = (user) => {
    sessionStorage.setItem("user", user);
  };
  const getUser = () => {
    return sessionStorage.getItem("user");
  };

  // const signin = cb => {
  //   return fakeAuth.signin(() => {
  //     setUser("user");
  //     cb();
  //   });
  // };

  // const signout = cb => {
  //   return fakeAuth.signout(() => {
  //     setUser(null);
  //     cb();
  //   });
  // };

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
    // <ProvideAuth>
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/wcw">
          <Header />
        </PrivateRoute>
        {/* <Route path="/wcw" component={Header} /> */}
      </Switch>
    </BrowserRouter>
    // </ProvideAuth>
  );
}

export default App;
