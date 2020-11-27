import axios from "axios";
import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
const dataURL = "http://localhost:4000/order";
const ordersURL = "http://localhost:4000/orders";

const NewOrderForm = (props) => {
  const [number, setNumber] = useState(undefined);
  const [product, setProduct] = useState("");
  const [finalProduct, setFinalProduct] = useState("");
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");
  const [tip, setTip] = useState("");
  const history = useHistory();
  const [newOrders, setNewOrders] = useState([]);

  let fullProduct = "";

  const onTipChange = (event) => {
    setTip(event.target.value);
  };

  const onNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const onProductChange = (event) => {
    setProduct(event.target.value);
  };

  const onFinalProductChange = (event) => {
    setFinalProduct(event.target.value);
  };

  const onColorChange = (event) => {
    setColor(event.target.value);
  };

  const onNotesChange = (event) => {
    setNotes(event.target.value);
  };

  /**
   * gets all the orders from the backend
   */
  const getOrders = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        withCredentials: false,
      },
    };
    axios.get(ordersURL, config).then((result) => {
      setNewOrders(result.data);
    });
  };

  useEffect(() => {
    getOrders();
  }, []);

  /**
   * returns the number of previous order
   */
  const prevOrderNum = () => {
    if (newOrders.length >= 1) {
      const num = newOrders[newOrders.length - 1].number;
      return num + 1;
    }
    return undefined;
  };

  /**
   * creates a new order by passing the input data to the backend
   * takes the user to the current orders page if successful
   */
  const onSubmit = () => {
    const data = { number, product: finalProduct, color, notes };
    axios
      .post(dataURL, data)
      .then((result) => {
        history.push("/wcw/manageOrders/current");
      })
      .catch((err) => {
        console.dir(err);
      });
  };

  /**
   * returns the html for the order form
   */
  return (
    <div>
      <section className="">
        <h1 className="titleDiv">Order In!</h1>
        <div className="centerDiv">
          <form>
            <h2>Order Number: {prevOrderNum()}</h2>
            {/* <input type="number" name="orderNumber" onChange={onNumberChange} /> */}
            <p>Product</p>
            <select name="product" onChange={onProductChange}>
              <option value="" disabled selected>
                Choose
              </option>
              <option value="alto">Alto Mouthpiece</option>
              <option value="tenor">Tenor Mouthpiece</option>
              <option value="bari">Bari Mouthpiece</option>
              <option value="soprano">Soprano Mouthpiece</option>
              <option value="other">other</option>
            </select>
            {/* if the product is a saxophone mouthpiece, display tip opening and genre selection */}
            {product === "alto" ||
            product === "tenor" ||
            product === "bari" ||
            product === "soprano" ? (
              <div>
                <select name="tipOpening" onChange={onTipChange}>
                  <option value="" disabled selected>
                    Choose
                  </option>
                  <option value={"closed"}>Closed</option>
                  <option value={"closed+"}>Closed+</option>
                  <option value={"standard"}>Standard</option>
                  <option value={"standard+"}>Standard+</option>
                  <option value={"open"}>Open</option>
                </select>
                <select name="genre" onChange={onFinalProductChange}>
                  <option value="" disabled selected>
                    Choose
                  </option>
                  <option value={"Jazz Classic" + " " + product + " " + tip}>
                    Jazz Classic
                  </option>
                  <option value={"Jazz Bright" + " " + product + " " + tip}>
                    Jazz Bright
                  </option>
                  <option value={"Concert Series" + " " + product + " " + tip}>
                    Concert Series
                  </option>
                </select>{" "}
              </div>
            ) : (
              ""
            )}
            {/* if the product is other, display a custom input field for product */}
            {product === "other" ? (
              <input type="text" onChange={onFinalProductChange} />
            ) : (
              ""
            )}
            <p>Color</p>
            <select name="color" onChange={onColorChange}>
              <option value="" disabled selected>
                Choose
              </option>
              <option value="red">Red</option>
              <option value="orange">Orange</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
              <option value="true blue">True Blue</option>
              <option value="turquoise">Turquoise</option>
              <option value="berry blue">Berry Blue</option>
              <option value="light purple">Light Purple</option>
              <option value="purple haze">Purple Haze</option>
              <option value="bone white">Bone White</option>
              <option value="matte black">Matte Black</option>
              <option value="gloss black">Gloss Black</option>
            </select>
            <p>Other Notes</p>
            <textarea onChange={onNotesChange} />
          </form>
        </div>
        <div>
          <button className="buttonMargin" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </section>
    </div>
  );
};
export default NewOrderForm;
