import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

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

  /**
   * pushes the inputs from the login to the backend for verification
   */
  const submitLogin = () => {
    const data = { userID: userId, password };
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

  /**
   * returns the html elements of the login page
   */
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
