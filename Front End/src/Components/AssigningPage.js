import axios from "axios";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
const dataURL = "http://localhost:4000/assigned";

const AssigningPage = () => {
  const { orderNum } = useParams();
  const history = useHistory();

  const [assignment, setAssignment] = useState("");

  /**
   * This function allows setAssignment to take the value of an event
   */
  const onAssignmentChange = (event) => {
    setAssignment(event.target.value);
  };

  /**
   * submits the name of the assignee and the order number to the backend
   * in order to create a new assignment
   */
  const assignClick = () => {
    const order = history.location.state.order;
    const data = { name: assignment, number: order.number };
    axios
      .post(dataURL, data)
      .then((result) => {
        console.dir(result);
        console.log("Data send");
        history.push("/wcw/manageOrders/assignments");
      })
      .catch((err) => {
        console.dir(err);
      });
  };

  /**
   * returns a form that allows a user to assign an order to a name
   */
  return (
    <div>
      <section>
        <h1 className="titleDiv">Now Assigning: Order {orderNum}</h1>
        <div className="">
          <form>
            <h3>Assign To:</h3>
            <input
              type="text"
              name="assignment"
              onChange={onAssignmentChange}
            />
          </form>
          <div>
            <button
              className="buttonMargin"
              onClick={() => {
                assignClick();
              }}
            >
              Assign
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default AssigningPage;
