import { Switch, Route, useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

const dataURL = "http://localhost:4000/shippedOrders";

const ShippedOrders = (props) => {
  const [shippedOrders, setShippedOrders] = useState([]);

  /**
   * gets the shipped orders from the Shipped table using the backend
   */
  const getShippedOrders = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        withCredentials: false,
      },
    };
    axios.get(dataURL, config).then((result) => {
      setShippedOrders(result.data);
    });
  };

  /**
   * deletes an order corresponding to the given number num using the backend
   * @param {int} num
   */
  const deleteClick = (num) => {
    alert("Are you sure you would like to delete this order?");
    axios.delete(dataURL + "/" + num).then((result) => {
      getShippedOrders();
    });
  };

  useEffect(() => {
    getShippedOrders();
  }, []);

  /**
   * renders the shipped orders table
   * each row is a different shipped order
   * each cell is an attribute of that order
   */
  const renderShipped = () => {
    const rows = [];
    shippedOrders.forEach((shippedOrder, index) => {
      rows.push(
        <tr key={"order-row-" + index}>
          <td>{shippedOrder.number}</td>
          <td>{shippedOrder.product}</td>
          <td>{shippedOrder.color}</td>
          <td>{shippedOrder.notes}</td>
          <td>Shipped</td>
          <td>{shippedOrder.shipDate}</td>
          <td>
            <button
              onClick={() => {
                deleteClick(shippedOrder.number);
              }}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
    return rows;
  };

  /**
   * returns the necessary HTML elements to display the shipped orders
   */
  return (
    <div>
      <h1 className="titleDiv2">These Orders Have Been Shipped</h1>
      <table className="assignTable">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Product</th>
            <th>Color</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Ship Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderShipped()}</tbody>
      </table>
    </div>
  );
};
export default ShippedOrders;
