import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import printer from "./Ender3V2.jpg";
import prusa from "./prusamini.jpg";
import axios from "axios";

const dataURL = "http://localhost:4000/printData";

const PrinterStatus = (props) => {
  const myRow = {
    display: "flex",
  };
  const myColumn = {
    flex: "25%",
    //padding: "5px"
  };

  const [printerInfo, setPrinterInfo] = useState([]);
  const [number, setNumber] = useState(undefined);
  const [product, setProduct] = useState("");
  const [customProduct, setCustomProduct] = useState("");
  const [duration, setDuration] = useState(0);

  const onDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const onNumberChange = (event) => {
    setNumber(event.target.value);
    //console.dir(event);
  };

  const onProductChange = (event) => {
    setProduct(event.target.value);
    //console.dir(event);
  };

  const onCustomProductChange = (event) => {
    setCustomProduct(event.target.value);
  };

  const getPrinterInfo = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        withCredentials: false,
      },
    };
    axios.get(dataURL, config).then((result) => {
      console.log("print info: ");
      console.dir(result);
      setPrinterInfo(result.data);
    });
  };

  useEffect(() => {
    getPrinterInfo();
  }, []);

  const [oldFaithfulStatus, setOldFaithfulStatus] = useState("");
  const [yosemiteStatus, setYosemiteStatus] = useState("");
  const [mtRushmoreStatus, setMtRushmoreStatus] = useState("");
  const [prusaMiniStatus, setPrusaMiniStatus] = useState("");

  const getPrinterAttribute = (printerName, attribute) => {
    const wantedPrinter = printerInfo.find((element) => {
      //console.log(element.name);
      //console.log("printer name" + printerName)
      return "" + element.name === "" + printerName;
    });

    //console.log(wantedPrinter);
    return wantedPrinter !== undefined ? wantedPrinter[attribute] : "";
  };

  const endJob = (printerName) => {
    console.log("ending Job");
    axios.put(dataURL + "/clear/" + printerName).then((result) => {
      console.log("end job submitted");
      getPrinterInfo();
    });
    return "done";
  };

  const getRemainingTime = (printerName) => {
    const wantedPrinter = printerInfo.find((element) => {
      return element.name === "" + printerName;
    });
    if (wantedPrinter !== undefined && wantedPrinter.startTime != null) {
      const currentTime = new Date();
      const startTimeAsDate = new Date(wantedPrinter.startTime);

      console.log("start time " + startTimeAsDate);
      console.log("current time " + currentTime);
      startTimeAsDate.setHours(
        startTimeAsDate.getHours() + wantedPrinter.printTime
      );
      console.log("end time " + startTimeAsDate);
      const hrs = Math.floor((startTimeAsDate - currentTime) / (3600 * 1000));
      const mins = Math.floor(
        60 * ((startTimeAsDate - currentTime) / (3600 * 1000) - hrs)
      );
      return hrs + "hr " + mins + "min";
    }
    return "";
  };

  const getEndTime = (printerName) => {
    const wantedPrinter = printerInfo.find((element) => {
      return element.name === "" + printerName;
    });
    if (wantedPrinter !== undefined && wantedPrinter.startTime != null) {
      const currentTime = new Date();
      const startTimeAsDate = new Date(wantedPrinter.startTime);

      startTimeAsDate.setHours(
        startTimeAsDate.getHours() + wantedPrinter.printTime
      );

      return startTimeAsDate.getHours() + ":" + startTimeAsDate.getMinutes();
    }
    return "";
  };

  const newJob = (printerName) => {
    if (printerName === "Mt. Rushmore") {
      setMtRushmoreStatus("showForm");
    } else if (printerName === "Old Faithful") {
      setOldFaithfulStatus("showForm");
    } else if (printerName === "Yosemite") {
      setYosemiteStatus("showForm");
    } else if (printerName === "Prusa Mini") {
      setPrusaMiniStatus("showForm");
    }
  };

  const getPrintTime = (orderProduct) => {
    if (orderProduct === "Alto Mouthpiece") {
      return 5;
    } else if (orderProduct === "Tenor Mouthpiece") {
      return 9;
    } else if (orderProduct === "Bari Mouthpiece") {
      return 12;
    } else if (orderProduct === "Soprano Mouthpiece") {
      return 4;
    } else {
      return Number(duration);
    }
  };

  const startPrint = (printerName, printTime) => {
    console.log("starting job");
    const currentDate = new Date();

    console.log(printTime);
    let finalProduct = "";
    if (customProduct !== "") {
      finalProduct = customProduct;
    } else {
      finalProduct = product;
    }
    const data = {
      number: number,
      product: finalProduct,
      printTime: printTime,
      startTime: currentDate,
    };
    axios.put(dataURL + "/newPrint/" + printerName, data).then((result) => {
      console.log("new job submitted");
      getPrinterInfo();
    });
  };

  const renderForm = (printerName) => {
    return (
      <form>
        <p>Order Number:</p>
        <input type="number" name="orderNumber" onChange={onNumberChange} />
        <p>Product</p>
        <select name="product" onChange={onProductChange}>
          <option value="Alto Mouthpiece">Alto Mouthpiece</option>
          <option value="Tenor Mouthpiece">Tenor Mouthpiece</option>
          <option value="Bari Mouthpiece">Bari Mouthpiece</option>
          <option value="Soprano Mouthpiece">Soprano Mouthpiece</option>
          <option value="other">other</option>
        </select>
        {product === "other" ? (
          <div>
            <input type="text" onChange={onCustomProductChange} />
            <p>Print Duration:</p>
            <input type="number" onChange={onDurationChange} />
          </div>
        ) : (
          ""
        )}
        <div>
          <button
            className="buttonMargin"
            onClick={() => {
              startPrint(printerName, getPrintTime(product));
            }}
          >
            Start Print
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <h1 className="titleDiv2">See What's On Our Printers</h1>
      {/* {renderPrinters()} */}
      <div style={myRow}>
        <div className="printerBox">
          <img src={printer} className="printerImage"></img>
          <p className="centerBoldText">Old Faithful</p>
          <div className="centerDiv">
            {getPrinterAttribute("Old Faithful", "product") == null &&
            oldFaithfulStatus !== "showForm" ? (
              <button
                className="buttonMargin"
                onClick={() => {
                  newJob("Old Faithful");
                }}
              >
                + Add New Print
              </button>
            ) : (
              ""
            )}
            {oldFaithfulStatus === "showForm" ? renderForm("Old Faithful") : ""}
          </div>
          <p>
            What's Printing: {getPrinterAttribute("Old Faithful", "product")}
          </p>
          <p>Time Remaining: {getRemainingTime("Old Faithful")}</p>
          <p>End Time: {getEndTime("Old Faithful")}</p>
          <div className="centerDiv">
            {getPrinterAttribute("Old Faithful", "product") != null ? (
              <button
                className="stopButton"
                onClick={() => {
                  endJob("Old Faithful");
                }}
              >
                End Print
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="printerBox">
          <img src={printer} className="printerImage"></img>
          <p className="centerBoldText">Yosemite</p>
          <div className="centerDiv">
            {getPrinterAttribute("Yosemite", "product") == null &&
            yosemiteStatus !== "showForm" ? (
              <button
                className="buttonMargin"
                onClick={() => {
                  newJob("Yosemite");
                }}
              >
                + Add New Print
              </button>
            ) : (
              ""
            )}
            {yosemiteStatus === "showForm" ? renderForm("Yosemite") : ""}
          </div>
          <p>What's Printing: {getPrinterAttribute("Yosemite", "product")}</p>
          <p>Time Remaining: {getRemainingTime("Yosemite")}</p>
          <p>End Time: {getEndTime("Yosemite")}</p>
          <div className="centerDiv">
            {getPrinterAttribute("Yosemite", "product") != null ? (
              <button
                className="stopButton"
                onClick={() => {
                  endJob("Yosemite");
                }}
              >
                End Print
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="printerBox">
          <img src={printer} className="printerImage"></img>
          <p className="centerBoldText">Mt. Rushmore</p>
          <div className="centerDiv">
            {getPrinterAttribute("Mt. Rushmore", "product") == null &&
            mtRushmoreStatus !== "showForm" ? (
              <button
                className="buttonMargin"
                onClick={() => {
                  newJob("Mt. Rushmore");
                }}
              >
                + Add New Print
              </button>
            ) : (
              ""
            )}
            {mtRushmoreStatus === "showForm" ? renderForm("Mt. Rushmore") : ""}
          </div>
          <p>
            What's Printing: {getPrinterAttribute("Mt. Rushmore", "product")}
          </p>
          <p>Time Remaining: {getRemainingTime("Mt. Rushmore")}</p>
          <p>End Time: {getEndTime("Mt. Rushmore")}</p>
          <div className="centerDiv">
            {getPrinterAttribute("Mt. Rushmore", "product") != null ? (
              <button
                className="stopButton"
                onClick={() => {
                  endJob("Mt. Rushmore");
                }}
              >
                End Print
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="printerBox">
          <img src={prusa} className="printerImage"></img>
          <p className="centerBoldText">Prusa Mini (PITA)</p>
          <div className="centerDiv">
            {getPrinterAttribute("Prusa Mini", "product") == null &&
            prusaMiniStatus !== "showForm" ? (
              <button
                className="buttonMargin"
                onClick={() => {
                  newJob("Prusa Mini");
                }}
              >
                + Add New Print
              </button>
            ) : (
              ""
            )}
            {prusaMiniStatus === "showForm" ? renderForm("Prusa Mini") : ""}
          </div>
          <p>What's Printing: {getPrinterAttribute("Prusa Mini", "product")}</p>
          <p>Time Remaining: {getRemainingTime("Prusa Mini")}</p>
          <p>End Time: {getEndTime("Prusa Mini")}</p>
          <div className="centerDiv">
            {getPrinterAttribute("Prusa Mini", "product") != null ? (
              <button
                className="stopButton"
                onClick={() => {
                  endJob("Prusa Mini");
                }}
              >
                End Print
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PrinterStatus;
