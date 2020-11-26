import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

const ordersURL = "http://localhost:4000/orders";
const dataURL = "http://localhost:4000/assigned";
const shippedURL = "http://localhost:4000/shippedOrders";

const FulfillmentPage = (props) => {
  const history = useHistory();
  const { orderNum } = useParams();
  const [assignment, setAssignment] = useState("");
  const [isComplete, setComplete] = useState(false);
  const [order, setOrder] = useState(history.location.state.assignment);

  let [task, setTask] = useState(0);

  const done = (key) => {
    const data = {};
    data[key] = "Complete";
    axios
      .put(dataURL + "/" + orderNum, data)
      .then((result) => {
        console.dir(result);
        setOrder(result.data);
      })
      .catch((err) => {
        console.dir(err);
      });
  };

  const complete = (key) => {
    done(key);
    setComplete(true);
  };

  const moveToShipped = () => {
    const dt = new Date().toString();
    const data = { ...order, date: dt };
    axios.post(shippedURL, data).then(() => {
      console.log("moved to shipped");
      axios.delete(dataURL + "/" + order.number).then((result) => {
        console.log("assignment Deleted");
      });
    });

    // axios.delete(ordersURL + "/" + order.number).then((result) => {
    //     console.log("order has been deleted")
    // })
    history.push("/wcw/manageOrders/shipped");
  };

  const moveToShippedTest = () => {};

  return (
    <div>
      <h1 className="centerDiv">Now Fulfilling Order: {orderNum}</h1>
      <h2 className="centerDiv">Product: {order.product}</h2>
      <h2 className="centerDiv">Color: {order.color}</h2>
      <h2 className="centerDiv">Notes: {order.notes}</h2>

      <table className="fulfillTable">
        <thead>
          <tr>
            <th>Steps</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            Retrieve STL
            <td>
              {"" + order.retrieveSTL === "Not Complete" ? (
                <button
                  onClick={() => {
                    done("retrieveSTL");
                  }}
                >
                  Done
                </button>
              ) : (
                "Task Complete"
              )}
            </td>
          </tr>
          <tr>
            Start Print
            <td>
              {"" + order.startPrint === "Not Complete" ? (
                <button
                  onClick={() => {
                    done("startPrint");
                  }}
                >
                  Done
                </button>
              ) : (
                "Task Complete"
              )}
            </td>
          </tr>
          <tr>
            Sand+Finish
            <td>
              {order.sand === "Not Complete" ? (
                <button
                  onClick={() => {
                    done("sand");
                  }}
                >
                  Done
                </button>
              ) : (
                "Task Complete"
              )}
            </td>
          </tr>
          <tr>
            Package
            <td>
              {order.package === "Not Complete" ? (
                <button
                  onClick={() => {
                    done("package");
                  }}
                >
                  Done
                </button>
              ) : (
                "Task Complete"
              )}
            </td>
          </tr>
          <tr>
            Ship
            <td>
              {order.ship === "Not Complete" ? (
                <button
                  onClick={() => {
                    complete("ship");
                  }}
                >
                  Done
                </button>
              ) : (
                "Task Complete"
              )}
            </td>
          </tr>
          {/* {renderShipped()} */}
        </tbody>
      </table>
      <div className="centerDiv">
        {isComplete ? (
          <button
            className="buttonMargin"
            onClick={() => {
              moveToShipped(order);
            }}
          >
            Move To Shipped
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default FulfillmentPage;
