import {Switch, Route, useHistory, useRouteMatch} from "react-router-dom";
import React, {useState, useEffect} from "react";
import NewOrderForm from "./NewOrderForm";
import ProcessingPage from "./AssigningPage";
import FulfillmentPage from "./FulfillmentPage";
import axios from "axios";

const dataURL = "http://localhost:4000/assigned";

const MyAssignments = (props) => {

    const { path, url } = useRouteMatch();

    const history = useHistory();

    const [assignments, setAssignments] = useState([]);

    const getAssignments = () => {
        const config = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                withCredentials: false
            }
        }
        axios.get(dataURL, config).then((result) => {
        //console.dir(result);
        setAssignments(result.data);
        })
    }

    const fulfillClick = (assignment) => {
        history.push("/wcw/manageOrders/fulfilling/" + assignment.number, {assignment});
    }

    const getStatus = (assignment) => {
        let step = "";
        const tasks = ["retrieveSTL", "startPrint", "sand","package","ship"];
        const labels = ["Retrieve STL", "Start Print", "Sand", "Package", "Ship"];

        for (let i = 0; i < tasks.length ; i++){
            if (assignment[tasks[i]] === "Not Started"){
            step = labels[i];
            break;
            } 
        }
        return step;
        
    }

    
    useEffect(() => {
        // console.log("Functional Component has mounted")
        
        getAssignments();
        
    }, []);

    const deleteClick = (num) => {
        axios.delete(dataURL + "/assigned/" + num).then((result) => {
            getAssignments();
        })
        axios.delete(dataURL + "/orders/" + num).then((result) => {
            
        })
    }

    const renderAssignments = () => {
        const rows = [];
        assignments.forEach((assignment, index) => {
            rows.push(<tr key={"order-row-" + index}>
                <td>
                    {assignment.name}
                </td>
                <td>
                    {assignment.number}
                </td>
                <td>
                    {assignment.product}
                </td>
                <td>
                    {assignment.color}
                </td>
                <td>
                    {assignment.notes}
                </td>
                <td>
                    {getStatus(assignment)}
                </td>
                <td>
                    {/* <button onClick={() => {processingClick(order.number);}}>Process</button> */}
                    {/* <button onClick={() => {deleteClick(order.number);}}>Delete</button> */}
                    <button onClick={() => {fulfillClick(assignment)}}>Fulfill</button>
                </td>
            </tr>)
        });
        return rows;
    }
    

    return(
        <div>
            <div>
            <h1 className = "titleDiv2">These Orders Have Been Assigned</h1>
            </div>
            <table className = "assignTable">
                    <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Order Number
                        </th>
                        <th>
                            Product
                        </th>
                        <th>
                            Color
                        </th>
                        <th>
                            Notes
                        </th>
                        <th>
                            To Do 
                        </th>
                        <th>
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderAssignments()}
                    </tbody>
                </table>
                <Switch>
                    <Route exact path={`${path}/fulfilling`} component={FulfillmentPage}/>
                </Switch>
        </div>
    );
}
export default MyAssignments;