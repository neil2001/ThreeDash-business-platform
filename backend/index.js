const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 4000;
//import 'bootstrap/dist/css/bootstrap.min.css';

app.use(cors());
app.use(express.json());

//const orders = require("./data/orders.json");

const readOrders = () => {
  const orders = fs.readFileSync("./data/orders.json");
  if (orders != "") {
    const ordersJson = JSON.parse(orders);
    console.dir(ordersJson);
    return ordersJson;
  }
  return [];
};

const readFile = (fileLoc) => {
  const filObj = fs.readFileSync(fileLoc);
  if (filObj != "") {
    const fileReturn = JSON.parse(filObj);
    return fileReturn;
  }
  return [];
};

app.get("/assigned", (req, res) => {
  const assigned = readFile("./data/assignments.json");
  const orders = readFile("./data/orders.json");
  const updatedAssignments = [];

  assigned.forEach((item, index) => {
    console.log("item number:  " + item.number);

    let orderDetail = { ...item };
    const filteredOrders = orders.filter((order, index) => {
      //console.log("item number:  " + item.number);
      console.log("order number:  " + order.number);
      console.log(
        "are they equal? " + ("" + order.number === "" + item.number)
      );
      return "" + order.number === "" + item.number;
    });
    if (filteredOrders.length > 0) {
      console.log("order has been filtered");
      orderDetail = { ...orderDetail, ...filteredOrders[0] };
    }
    updatedAssignments.push(orderDetail);
  });
  console.dir(updatedAssignments);
  res.send(updatedAssignments);
});

app.post("/assigned", (req, res) => {
  const assigned = readFile("./data/assignments.json");
  const orders = readFile("./data/orders.json");
  assigned.push(req.body);
  let assignedData = JSON.stringify(assigned);
  fs.writeFileSync("./data/assignments.json", assignedData);
  for (let i = 0; i < orders.length; i++) {
    if ("" + orders[i].number === "" + req.body.number) {
      orders[i].status = "ASSIGNED";
      break;
    }
  }
  let updatedOrders = JSON.stringify(orders);
  fs.writeFileSync("./data/orders.json", updatedOrders);
  res.send("Order has been Assigned");
});

app.get("/orders", (req, res) => {
  const orders = readFile("./data/orders.json");
  res.send(orders);
});

app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;
  console.log("id = " + id);
  const orders = readOrders();
  const updatedOrders = orders.filter((order, index) => {
    //console.log("order number = " + order.number + " id: " + id)
    //console.log("true or false = " + order.number+"" != id+"")
    return order.number + "" !== id + "";
  });
  const orderData = JSON.stringify(updatedOrders);
  fs.writeFileSync("./data/orders.json", orderData);

  res.send("Order has been deleted");
});

app.post("/order", (req, res) => {
  //console.dir(req.body);
  const orders = readOrders();
  req.body.status = "NEW";
  req.body.retrieveSTL = "Not Started";
  req.body.startPrint = "Not Started";
  req.body.sand = "Not Started";
  req.body.package = "Not Started";
  req.body.ship = "Not Started";
  orders.push(req.body);
  let orderData = JSON.stringify(orders);
  fs.writeFileSync("./data/orders.json", orderData);
  res.send("Order has been created");
});

app.get("/shippedOrders", (req, res) => {
  const shippedOrders = readFile("./data/shipped.json");
  // const orders = readFile('./data/orders.json');
  // const updatedShipped = [];

  // shippedOrders.forEach((item, index) => {
  //     console.log("item number:  " + item.number);

  //     let orderDetail = {...item};
  //     const filteredOrders = orders.filter((order, index) => {
  //         //console.log("item number:  " + item.number);
  //         console.log("order number:  " + order.number);

  //         return order.number + "" === item.number + "";
  //     });
  //     if (filteredOrders.length > 0) {
  //         orderDetail = {...orderDetail,...filteredOrders[0]};
  //     }
  //     updatedShipped.push(orderDetail);
  // })
  // console.dir(updatedShipped);
  res.send(shippedOrders);
});

app.delete("/shippedOrders/:id", (req, res) => {
  const { id } = req.params;
  console.log("id = " + id);
  const shippedOrders = readFile("./data/shipped.json");
  const updatedShippedOrders = shippedOrders.filter((shippedOrder, index) => {
    //console.log("order number = " + order.number + " id: " + id)
    //console.log("true or false = " + order.number+"" != id+"")
    return shippedOrder.number + "" !== id + "";
  });
  const shippedOrderData = JSON.stringify(updatedShippedOrders);
  fs.writeFileSync("./data/shipped.json", shippedOrderData);

  res.send("Order has been deleted");
});

app.delete("/assigned/:id", (req, res) => {
  const { id } = req.params;
  console.log("id = " + id);
  const currentAssignments = readFile("./data/assignments.json");
  const updatedAssignments = currentAssignments.filter((assignment, index) => {
    //console.log("order number = " + order.number + " id: " + id)
    //console.log("true or false = " + order.number+"" != id+"")
    return assignment.number + "" !== id + "";
  });
  const assignmentData = JSON.stringify(updatedAssignments);
  fs.writeFileSync("./data/assignments.json", assignmentData);

  res.send("Order has been deleted");
});

app.put("/assigned/:id", (req, res) => {
  console.log("updating assignments");

  const { id } = req.params;
  console.log("id = " + id);
  const assigned = readFile("./data/orders.json");
  // const assignmentToUpdate = assigned.filter((assignment, index) => {
  //     return "" + assignment.number === "" + id;
  // });
  let assignmentToUpdate = undefined;
  for (let i = 0; i < assigned.length; i++) {
    if ("" + assigned[i].number === "" + id) {
      assignmentToUpdate = assigned[i];
      break;
    }
  }
  console.dir(assignmentToUpdate);
  Object.keys(req.body).forEach((key, index) => {
    assignmentToUpdate[key] = req.body[key];
  });
  console.log(assignmentToUpdate.retrieveSTL);
  console.log("time to update");
  const assignedData = JSON.stringify(assigned);
  console.dir(assigned);
  fs.writeFileSync("./data/orders.json", assignedData);
  console.log("finished");
  res.send(assignmentToUpdate);
});

app.post("/shippedOrders", (req, res) => {
  //console.dir(req.body);
  const shippedOrders = readFile("./data/shipped.json");
  shippedOrders.push(req.body);
  let shippedOrderData = JSON.stringify(shippedOrders);
  fs.writeFileSync("./data/shipped.json", shippedOrderData);
  res.send("Order has been created");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/printData", (req, res) => {
  const printerData = readFile("./data/printerData.json");
  res.send(printerData);
});

app.post("/printData", (req, res) => {
  //console.dir(req.body);
  const printerData = readFile("./data/printerData.json");
  printerData.push(req.body);
  let printerUpdates = JSON.stringify(printerData);
  fs.writeFileSync("./data/printerData.json", printerUpdates);
  res.send("Printer has been updated");
});

app.put("/printData/newPrint/:printerName", (req, res) => {
  const { printerName } = req.params;

  const printerInfo = readFile("./data/printerData.json");
  const printerToUpdate = printerInfo.find((element) => {
    return "" + element.printer === "" + printerName;
  });
  Object.keys(printerToUpdate).forEach((key, index) => {
    if ("" + key === "printer") {
      printerToUpdate[key] = printerName;
    } else {
      printerToUpdate[key] = req.body[key];
    }
  });
  const printerData = JSON.stringify(printerInfo);
  console.dir(printerData);
  fs.writeFileSync("./data/printerData.json", printerData);
  console.log("finished");
  res.send(printerToUpdate);
});

app.put("/printData/clear/:printerName", (req, res) => {
  const { printerName } = req.params;
  console.log("printer " + printerName);
  const printerInfo = readFile("./data/printerData.json");

  const printerToUpdate = printerInfo.find((element) => {
    return "" + element.printer === "" + printerName;
  });

  console.dir("Printer to update" + printerToUpdate);

  Object.keys(printerToUpdate).forEach((key, index) => {
    if ("" + key !== "printer") {
      printerToUpdate[key] = "";
    }
  });

  const printerData = JSON.stringify(printerInfo);
  console.dir(printerData);
  fs.writeFileSync("./data/printerData.json", printerData);
  console.log("finished");
  res.send(printerToUpdate);
});

app.post("/login", (req, res) => {
  const userData = readFile("./data/users.json");
  let acceptUser = false;

  const wantedUser = userData.find((user) => {
    return user.userId === req.body.userId;
  });
  if (wantedUser !== undefined) {
    acceptUser = true;
  } else {
    res.status(401);
    res.send("User not found");
  }
  if (acceptUser == true && wantedUser.password === req.body.password) {
    res.send(wantedUser);
  } else {
    res.status(401);
    res.send("Password Incorrect");
  }
});

app.get("/notes", (req, res) => {
  const orders = readFile("./data/notes.json");
  res.send(orders);
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  console.log("id = " + id);
  const currentNotes = readFile("./data/notes.json");
  const updatedNotes = currentNotes.filter((notes, index) => {
    //console.log("order number = " + order.number + " id: " + id)
    //console.log("true or false = " + order.number+"" != id+"")
    return notes.number != id;
  });
  console.log("notes updated");
  const notesData = JSON.stringify(updatedNotes);
  fs.writeFileSync("./data/notes.json", notesData);
  console.log("notes file updated");
  res.send("Note has been deleted");
});

app.post("/notes", (req, res) => {
  //console.dir(req.body);
  const notes = readFile("./data/notes.json");
  notes.push(req.body);
  let notesData = JSON.stringify(notes);
  fs.writeFileSync("./data/notes.json", notesData);
  res.send("Note has been created");
});
