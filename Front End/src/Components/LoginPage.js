import axios from "axios";
import React, { useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import { useAuth } from "../App";

const dataURL = "http://localhost:4000/login";

const LoginPage = (props) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const auth = useAuth();
  const [userStatus, setUserStatus] = useState("");

  const onUsernameChange = (event) => {
    setUserId(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const submitLogin = () => {
    const data = { userId, password };
    axios
      .post(dataURL, data)
      .then((result) => {
        setUserStatus("");
        auth.setUser(userId);
        history.push("/wcw");
      })
      .catch((err) => {
        setUserStatus(err.response.data);
        auth.setUser(undefined);
        console.dir(err);
      });
  };

  return (
    <div>
      <div className="centerPageDiv">
        <div>
          <h1>Login</h1>
        </div>

        <form>
          <p>Username</p>
          <input type="text" name="username" onChange={onUsernameChange} />
          <p>Password</p>
          <input type="password" name="password" onChange={onPasswordChange} />
          <p style={{ color: "red" }}>{userStatus}</p>
        </form>
        <div>
          <button className="buttonMargin" onClick={submitLogin}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
