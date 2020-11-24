import axios from "axios";
import {useParams} from "react-router-dom";
import {Switch, Route, useHistory} from "react-router-dom";
import React, {useState} from "react";
const dataURL = "http://localhost:4000/assigned";


const AssigningPage = () => {
    const {orderNum} = useParams();
    const history = useHistory();

    const [assignment, setAssignment] = useState("");
    const [showAssign, setShowAssign] = useState(false);

    const onAssignmentChange = (event) => {
        setAssignment(event.target.value);
        //console.dir(event);    
    }
    
    const assignClick = () => {
        //setShowAssign(true);
        //history.push("/assign/" + orderNum);
        const order = history.location.state.order;
        console.log("order to be assigned");
        console.dir(order);
        const data = {name: assignment, number: order.number};
        axios.post(dataURL, data)
        .then((result) => {
            console.dir(result)
            //alert("result = " + result);
            console.log('Data send');
            history.push("/wcw/manageOrders/assignments");
        })
        .catch((err) => {
            console.dir(err);
        });
    }
    return(
        <div>
            <h1 className="centerDiv">
                Now Assigning: Order {orderNum} 
            </h1>
            <div className="assignForm">
                <form>
                    <p>Assign To:</p>
                    <input
                        type='text'
                        name='assignment'
                        onChange={onAssignmentChange}
                    />
                </form>
                <div>
                    <button onClick = {() => {assignClick()}}>Assign</button>
                </div>
            </div>
            
            
              
            
        </div>
    )
}
export default AssigningPage;