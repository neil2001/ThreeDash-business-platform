import {Switch, Route, useHistory} from "react-router-dom";
import React, {useState, useEffect} from "react";
import axios from "axios";

const dataURL = "http://localhost:4000/shippedOrders";

const ShippedOrders = (props) => {

    const [shippedOrders, setShippedOrders] = useState([]);

    const getShippedOrders = () => {
        const config = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                withCredentials: false
            }
        }
        axios.get(dataURL, config).then((result) => {
        //console.dir(result);
        setShippedOrders(result.data)
        })
    }

    const deleteClick = (num) => {
        alert("Are you sure you would like to delete this order?");
        axios.delete(dataURL + "/" + num).then((result) => {
            getShippedOrders();
        })
    }
    
    useEffect(() => {
        // console.log("Functional Component has mounted")
        
        getShippedOrders();
        
    }, []);

    const renderShipped = () => {
        const rows = [];
        shippedOrders.forEach((shippedOrder, index) => {
            rows.push(<tr key={"order-row-" + index}>
                <td>
                    {shippedOrder.number}
                </td>
                <td>
                    {shippedOrder.product}
                </td>
                <td>
                    {shippedOrder.color}
                </td>
                <td>
                    {shippedOrder.notes}
                </td>
                <td>
                    Shipped
                </td>
                <td>
                    {/* <button onClick={() => {processingClick(order.number, order.product, order.color);}}>Process</button> */}
                    <button onClick={() => {deleteClick(shippedOrder.number);}}>Delete</button>
                    {/* <button>Mark As Done</button> */}
                </td>
            </tr>)
        });
        return rows;
    }

    return(
        <div>
            <h1 className = "titleDiv2">These Orders Have Been Shipped</h1>
            <table className = "assignTable">
                    <thead>
                    <tr>
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
                            Status
                        </th>
                        <th>
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {renderShipped()}
                    </tbody>
                </table>
        </div>
    );
}
export default ShippedOrders;