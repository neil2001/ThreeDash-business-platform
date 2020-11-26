import { Switch, Route, useHistory, useRouteMatch } from "react-router-dom";
import React, { useState, useEffect } from "react";
import NewOrderForm from "./NewOrderForm";
import AssigningPage from "./AssigningPage";
import axios from "axios";

const dataURL = "http://localhost:4000";

//const dataURL = "https://pokeapi.co/api/v2/";

const CurrentOrders = (props) => {
  const { path, url } = useRouteMatch();

  const history = useHistory();
  const formClick = () => {
    history.push("/wcw/manageOrders/newOrder");
  };
  const processingClick = (order) => {
    history.push("/wcw/manageOrders/processing/" + order.number, { order });
  };
  const [orders, setOrders] = useState([]);

  const getOrders = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        withCredentials: false,
      },
    };
    axios.get(dataURL + "/orders", config).then((result) => {
      //console.dir(result);
      setOrders(result.data);
    });
  };

  useEffect(() => {
    // console.log("Functional Component has mounted")

    getOrders();
  }, []);

  const deleteClick = (num) => {
    alert("Are you sure you want to delete this order?");
    axios.delete(dataURL + "/orders/" + num).then((result) => {
      getOrders();
    });
  };

  const moveToShipped = (order) => {
    const dt = new Date().toString();
    const data = { ...order, date: dt };
    axios.post(dataURL + "/shippedOrders", data).then(() => {
      console.log("moved to shipped");
      getOrders();
    });
    //deleteClick(order.number);
  };

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
            {/* <button onClick={() => {processingClick(order);}}>Assign</button> */}
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
          {/* <Switch>
                    <Route path={`${path}/newOrder`} component={NewOrderForm}/>
                    <Route path={`${path}/processing`} component={AssigningPage}/>
                </Switch> */}
        </div>
      </section>
    </div>
  );
};
export default CurrentOrders;
