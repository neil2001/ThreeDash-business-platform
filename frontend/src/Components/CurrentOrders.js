import { useHistory, useRouteMatch } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

const dataURL = "http://localhost:4000";

const CurrentOrders = (props) => {
  const { path, url } = useRouteMatch();

  const history = useHistory();

  /**
   * takes a user to the new order form
   */
  const formClick = () => {
    history.push("/wcw/manageOrders/newOrder");
  };

  /**
   * takes a user to the processing page where one can assign an order to another associate
   * @param {order} order
   */
  const processingClick = (order) => {
    history.push("/wcw/manageOrders/processing/" + order.number, { order });
  };
  const [orders, setOrders] = useState([]);

  /**
   * gets the orders from the backend
   */
  const getOrders = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        withCredentials: false,
      },
    };
    axios.get(dataURL + "/orders", config).then((result) => {
      setOrders(result.data);
    });
  };

  useEffect(() => {
    getOrders();
  }, []);

  /**
   * deletes an order by telling the backend to delete an order
   * @param {int} num
   */
  const deleteClick = (num) => {
    alert("Are you sure you want to delete this order?");
    axios.delete(dataURL + "/orders/" + num).then((result) => {
      getOrders();
    });
  };

  /**
   * moves an order to Shipped using the backend
   * @param {order} order
   */
  const moveToShipped = (order) => {
    const dt = new Date().toString();
    const data = { ...order, date: dt };
    axios.post(dataURL + "/shippedOrders", data).then(() => {
      console.log("moved to shipped");
      getOrders();
    });
  };

  /**
   * goes through each order in the orders table and populates a table on the front end
   * each row contains the information for one order
   * each cell contains the desired info: number, product, color, etc.
   */
  const renderOrders = () => {
    const rows = [];
    orders.forEach((order, index) => {
      rows.push(
        <tr key={"order-row-" + index}>
          <td>{order.number}</td>
          <td>{order.product}</td>
          <td>{order.color}</td>
          <td>{order.notes}</td>
          <td>{order.status}</td>
          <td>
            {/* Only display the Assign button when the order status is NEW */}
            {order.status == "NEW" ? (
              <button
                onClick={() => {
                  processingClick(order);
                }}
              >
                Assign
              </button>
            ) : (
              ""
            )}
            <button
              onClick={() => {
                deleteClick(order.number);
              }}
            >
              Delete
            </button>
            <button
              onClick={() => {
                moveToShipped(order);
              }}
            >
              Mark As Done
            </button>
          </td>
        </tr>
      );
    });
    return rows;
  };

  /**
   * returns the necessary html components to display the orders.
   */
  return (
    <div>
      <section>
        <div>
          <h1 className="titleDiv">These Orders Have Not Yet Been Processed</h1>
        </div>

        <button className="buttonMargin" onClick={formClick}>
          + Add a new order
        </button>
        <div className="centerDiv">
          <table className="assignTable">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Product</th>
                <th>Color</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderOrders()}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
export default CurrentOrders;
