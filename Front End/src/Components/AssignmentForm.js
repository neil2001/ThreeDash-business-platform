import axios from "axios";
import {useParams} from "react-router-dom";
import {Switch, Route, useHistory} from "react-router-dom";

import React, {useState} from "react";
const dataURL = "http://localhost:4000/order";

const AssignmentForm = () => {
    const [assignment, setAssignment] = useState("");
    const onAssignmentChange = (event) => {
        setAssignment(event.target.value);
        //console.dir(event);    
    }
    return(
        <div>
            <form className = "assignForm">
                <p>Assign To:</p>
                <input
                    type='text'
                    name='assignment'
                    onChange={onAssignmentChange}
                />
            </form>
        </div>
    )
}
export default AssignmentForm;