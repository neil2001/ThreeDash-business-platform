import { Switch, Route, useHistory, useRouteMatch } from "react-router-dom";
import React, { useState, useEffect } from "react";
import FulfillmentPage from "./FulfillmentPage";
import axios from "axios";

const dataURL = "http://localhost:4000/assigned";

const MyAssignments = (props) => {
  const { path, url } = useRouteMatch();

  const history = useHistory();

  const [assignments, setAssignments] = useState([]);

  /**
   * gets the assignments from the backend
   */
  const getAssignments = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        withCredentials: false,
      },
    };
    axios.get(dataURL, config).then((result) => {
      setAssignments(result.data);
    });
  };

  /**
   * takes the user to the fulfillment page with the assignment number and object
   * @param {assignment} assignment
   */
  const fulfillClick = (assignment) => {
    history.push("/wcw/manageOrders/fulfilling/" + assignment.number, {
      assignment,
    });
  };

  /**
   * returns the correct step in the fulfillment process for a given assignment
   * @param {assignment} assignment
   */
  const getStatus = (assignment) => {
    let step = "";
    const tasks = ["retrieveSTL", "startPrint", "sand", "package", "ship"];
    const labels = ["Retrieve STL", "Start Print", "Sand", "Package", "Ship"];

    for (let i = 0; i < tasks.length; i++) {
      if (assignment[tasks[i]] === "Not Complete") {
        step = labels[i];
        break;
      }
    }
    return step;
  };

  useEffect(() => {
    getAssignments();
  }, []);

  /**
   * deletes an order using the backend
   * @param {int} num
   */
  const deleteClick = (num) => {
    axios.delete(dataURL + "/assigned/" + num).then((result) => {
      getAssignments();
    });
    axios.delete(dataURL + "/orders/" + num).then((result) => {});
  };

  /**
   * renders the assignments by going through each assignment in the Assignment table
   * each row is a different assignment
   * each cell contains an attribute of that assignment
   */
  const renderAssignments = () => {
    const rows = [];
    assignments.forEach((assignment, index) => {
      rows.push(
        <tr key={"order-row-" + index}>
          <td>{assignment.name}</td>
          <td>{assignment.number}</td>
          <td>{assignment.product}</td>
          <td>{assignment.color}</td>
          <td>{assignment.notes}</td>
          <td>{getStatus(assignment)}</td>
          <td>
            <button
              onClick={() => {
                fulfillClick(assignment);
              }}
            >
              Fulfill
            </button>
          </td>
        </tr>
      );
    });
    return rows;
  };

  /**
   * returns the necessary HTML elements to display the assignments
   */
  return (
    <div>
      <div>
        <h1 className="titleDiv2">These Orders Have Been Assigned</h1>
      </div>
      <table className="assignTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Order Number</th>
            <th>Product</th>
            <th>Color</th>
            <th>Notes</th>
            <th>To Do</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderAssignments()}</tbody>
      </table>
      <Switch>
        <Route exact path={`${path}/fulfilling`} component={FulfillmentPage} />
      </Switch>
    </div>
  );
};
export default MyAssignments;
