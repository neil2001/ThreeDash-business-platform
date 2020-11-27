import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Jumbotron } from "react-bootstrap";

const assignmentsURL = "http://localhost:4000/assigned";
const ordersURL = "http://localhost:4000/orders";
const shippedURL = "http://localhost:4000/shippedOrders";

const HomePage = (props) => {
  const history = useHistory();
  const [assignments, setAssignments] = useState([]);
  const [newOrders, setNewOrders] = useState([]);
  const [shipped, setShipped] = useState([]);

  /**
   * gets all the assignments from the backend
   */
  const getAssignments = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        withCredentials: false,
      },
    };
    axios.get(assignmentsURL, config).then((result) => {
      setAssignments(result.data);
    });
  };

  /**
   * gets all the orders from the backend
   */
  const getOrders = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        withCredentials: false,
      },
    };
    axios.get(ordersURL, config).then((result) => {
      setNewOrders(result.data);
    });
  };

  /**
   * gets all the shipped orders from the backend
   */
  const getShippedOrders = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        withCredentials: false,
      },
    };
    axios.get(shippedURL, config).then((result) => {
      setShipped(result.data);
    });
  };

  useEffect(() => {
    getOrders();
    getShippedOrders();
    getAssignments();
  }, []);

  /**
   * returns the number of orders that are not assigned or shipped by
   * counting the number of orders with status NEW
   */
  const numNewOrders = () => {
    let num = 0;
    newOrders.forEach((order, index) => {
      if (order.status === "NEW") {
        num++;
      }
    });
    return num;
  };

  const myRow = {
    display: "flex",
  };

  /**
   * takes the user to the url created with "destination"
   * @param {String} destination
   */
  const navigate = (destination) => {
    history.push("/wcw/manageOrders/" + destination);
  };

  /**
   * returns the necessary html elements to create the home page
   */
  return (
    <div>
      <div className="homeRow">
        <div className="homeColumn">
          <Jumbotron>
            <h1 className="bigH1">Welcome to WCW's Order Management Hub</h1>
            <h1>Today's Goal: Take Down SYOS</h1>
          </Jumbotron>
        </div>
        <div className="buttonColumn">
          <div className="featureBox">
            <h3>New Orders</h3>
            <div>
              <h1>{numNewOrders()}</h1>
            </div>
            <div>
              <button
                className="whiteButton"
                onClick={() => {
                  navigate("current");
                }}
              >
                View
              </button>
            </div>
          </div>
          <div className="featureBox">
            <h3>Orders In Progress</h3>
            <h1>{assignments.length}</h1>
            <div>
              <button
                className="whiteButton"
                onClick={() => {
                  navigate("assignments");
                }}
              >
                View
              </button>
            </div>
          </div>
          <div className="featureBox">
            <h3>Shipped Orders</h3>
            <h1>{shipped.length}</h1>
            <div>
              <button
                className="whiteButton"
                onClick={() => {
                  navigate("shipped");
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};
export default HomePage;
