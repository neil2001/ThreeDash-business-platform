import axios from "axios";
import React, { useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
const dataURL = "http://localhost:4000/order";

const NewOrderForm = (props) => {
  const [number, setNumber] = useState(undefined);
  const [product, setProduct] = useState("");
  const [finalProduct, setFinalProduct] = useState("");
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");
  const [tip, setTip] = useState("");
  const history = useHistory();

  let fullProduct = "";

  const onTipChange = (event) => {
    setTip(event.target.value);
  };

  const onNumberChange = (event) => {
    setNumber(event.target.value);
    //console.dir(event);
  };

  const onProductChange = (event) => {
    setProduct(event.target.value);
    //console.dir(event);
  };

  const onFinalProductChange = (event) => {
    setFinalProduct(event.target.value);
  };

  const onColorChange = (event) => {
    setColor(event.target.value);
    //console.dir(event);
  };

  const onNotesChange = (event) => {
    setNotes(event.target.value);
    //console.dir(event);
  };

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

  return (
    <div>
      <section className="formSection">
        <h1>Order In!</h1>
        <form>
          <p>Order Number:</p>
          <input type="number" name="orderNumber" onChange={onNumberChange} />
          <p>Product</p>
          <select name="product" onChange={onProductChange}>
            <option value="alto">Alto Mouthpiece</option>
            <option value="tenor">Tenor Mouthpiece</option>
            <option value="bari">Bari Mouthpiece</option>
            <option value="soprano">Soprano Mouthpiece</option>
            <option value="other">other</option>
          </select>
          {product === "alto" ||
          product === "tenor" ||
          product === "bari" ||
          product === "soprano" ? (
            <div>
              {" "}
              <select name="tipOpening" onChange={onTipChange}>
                <option value={"closed"}>Closed</option>
                <option value={"closed+"}>Closed+</option>
                <option value={"standard"}>Standard</option>
                <option value={"standard+"}>Standard+</option>
                <option value={"open"}>Open</option>
              </select>
              <select name="genre" onChange={onFinalProductChange}>
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
          {product === "other" ? (
            <input type="text" onChange={onFinalProductChange} />
          ) : (
            ""
          )}
          {/* <div><button>Add Another Product</button></div> */}
          <p>Color</p>
          <select name="color" onChange={onColorChange}>
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
