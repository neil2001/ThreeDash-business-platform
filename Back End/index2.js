const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 4000;
const mysql = require("mysql");
const { count } = require("console");

var dbConnect = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  password: "NeilXu2001!",
  database: "wcw",
  //dateString: true,
});

app.use(cors());
app.use(express.json());

/**
 * gets the orders that are marked as New or Assigned
 */
app.get("/orders", (req, res) => {
  dbConnect.query(
    "select * from orders where status !='SHIPPED'",
    (err, rows, fields) => {
      if (err) {
        res.status(500);
        res.send("Dataset query failed");
        return;
      }
      const orders = [];
      rows.forEach((row) => {
        orders.push({ ...row });
      });
      res.send(orders);
    }
  );
});

/**
 * creates a new order given a product, color, printTime, and notes input
 */
app.post("/order", (req, res) => {
  const sql = `insert into orders (product, color, printTime, notes) values ('${req.body.product}', '${req.body.color}', 6.5, '${req.body.notes}')`;
  dbConnect.query(sql, (err, rows, fields) => {
    console.log("new order 80");
    if (err) {
      res.status(500);
      res.send("Dataset query failed");
      return;
    }
    console.log("new order creation 86");
    res.send("Order has been created");
  });
});

/**
 * deletes an order from the orders table based on its number
 */
app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;
  console.log("id = " + id);
  const sql = `delete from orders where number=${id}`;
  console.log("sql= " + sql);
  dbConnect.query(sql, (err, rows, fields) => {
    if (err) {
      console.log("order deletion failed");
      res.status(500);
      res.send("Order deletion failed");
      return;
    }
    res.send("order deleted");
  });
});

/**
 * gets an assignment name and number from the Assignment table,
 * and joins the Assignment table with the orders table by orderNumber to get
 * product, color, processing status values, and notes
 */
app.get("/assigned", (req, res) => {
  dbConnect.query(
    `select a.name,o.number,o.product,o.color,o.retrieveSTL,o.startPrint,o.sand,o.package,o.ship,o.notes from Assignment a join orders o on o.number=a.orderNumber;`,
    (err, rows, fields) => {
      if (err) {
        res.status(500);
        res.send("Dataset query failed");
        return;
      }
      const assignments = [];
      rows.forEach((row) => {
        assignments.push({ ...row });
      });
      res.send(assignments);
    }
  );
});

/**
 * creates an assignment from a given name and orderNumber,
 * updates the orders table to set the given order's status to ASSIGNED
 */
app.post("/assigned", (req, res) => {
  dbConnect.getConnection((err, connection) => {
    connection.query(
      `insert into Assignment (name, orderNumber) values ('${req.body.name}', ${req.body.number})`,
      (err, rows, fields) => {
        if (err) {
          connection.release();
          res.status(500);
          res.send("new assignment creation failed");
          return;
        }
        connection.query(
          `update orders set status="ASSIGNED" where number=${req.body.number}`,
          (err, rows, fields) => {
            if (err) {
              connection.release();
              res.status(500);
              res.send("update orders status failed");
              return;
            }
            console.log("assigned 140");
            connection.release();
            res.send("Order has been assigned");
          }
        );
      }
    );
  });
});

/**
 * gets an shipped order date from the Shipped table,
 * and joins the Shipped table with the orders table by orderNumber to get
 * number, product, color, processing status values, and notes
 */
app.get("/shippedOrders", (req, res) => {
  dbConnect.query(
    `select s.shipDate,o.number,o.product,o.color,o.notes from Shipped s join orders o on o.number=s.orderNumber;`,
    (err, rows, fields) => {
      if (err) {
        res.status(500);
        res.send("Dataset query failed");
        return;
      }
      const shippedOrders = [];
      rows.forEach((row) => {
        shippedOrders.push({ ...row });
      });

      res.send(shippedOrders);
    }
  );
});

/**
 * deletes a shipped order from the Shipped table
 * In: order number
 */
app.delete("/shippedOrders/:id", (req, res) => {
  const { id } = req.params;
  console.log("id = " + id);
  dbConnect.query(
    `delete from Shipped where orderNumber=${id}`,
    (err, rows, fields) => {
      if (err) {
        res.status(500);
        res.send("Dataset query failed");
        return;
      }
      res.send("shipment deleted");
    }
  );
});

/**
 * deletes an assignment from the Assignment table
 * In: order number
 */
app.delete("/assigned/:id", (req, res) => {
  const { id } = req.params;
  console.log("id = " + id);
  dbConnect.query(
    `delete from Assignment where orderNumber=${id}`,
    (err, rows, fields) => {
      if (err) {
        res.status(500);
        res.send("Assignment Deletion failed");
        return;
      }
      res.send("Assignment deleted");
    }
  );
});

/**
 * updates the orders table once an assignment is created.
 * The value to be updated is given by the object passed in to the function.
 * This function changes the given order status to be the value of the object passed in, generally "Not Complete".
 */
app.put("/assigned/:id", (req, res) => {
  console.log("updating assignments");
  const { id } = req.params;
  console.log("id = " + id);

  const keyName = Object.keys(req.body)[0];
  dbConnect.getConnection((err, connection) => {
    connection.query(
      `update orders set ${keyName}="${req.body[keyName]}" where number=${id}`,
      (err, rows, fields) => {
        if (err) {
          res.status(500);
          res.send("Assignment Deletion failed");
          return;
        }
        connection.query(
          `select * from orders where number=${id}`,
          (err, rows, fields) => {
            if (err) {
              connection.release();
              res.status(500);
              res.send("update orders status failed");
              return;
            }

            connection.release();
            res.send(rows[0]);
          }
        );
      }
    );
  });
});

/**
 * adds an order to the Shipped table
 * updates the status of that order in the orders table to be "Shipped"
 */
app.post("/shippedOrders", (req, res) => {
  dbConnect.getConnection((err, connection) => {
    console.log("connected 121");
    connection.query(
      `insert into Shipped (orderNumber,shipDate) values ('${req.body.number}', CURRENT_TIMESTAMP())`,
      (err, rows, fields) => {
        if (err) {
          connection.release();
          res.status(500);
          res.send("new shipment creation failed");
          return;
        }
        connection.query(
          `update orders set status="SHIPPED" where number=${req.body.number}`,
          (err, rows, fields) => {
            if (err) {
              connection.release();
              res.status(500);
              res.send("update orders status failed");
              return;
            }
            console.log("assigned 140");
            connection.release();
            res.send("Order has been shipped");
          }
        );
      }
    );
  });
});

/**
 * gets the data from each printer in the Printer table
 */
app.get("/printData", (req, res) => {
  dbConnect.query("select * from Printer", (err, rows, fields) => {
    if (err) {
      res.status(500);
      res.send("Dataset query failed");
      return;
    }
    const printers = [];
    rows.forEach((row) => {
      printers.push({ ...row });
    });
    res.send(printers);
  });
});

/**
 * updates the Printer table with a new print to a corresponding printer that is passed in
 */
app.put("/printData/newPrint/:printerName", (req, res) => {
  const { printerName } = req.params;
  // const sql = `update Printer set orderNumber=${req.body.number}, product='${req.body.product}', printTime='${req.body.printTime}', startTime=${req.body.startTime} where name='${printerName}'`;
  // console.log("sql= " + sql);
  dbConnect.query(
    `update Printer set orderNumber=${req.body.number}, product='${req.body.product}', printTime='${req.body.printTime}', startTime=current_timestamp() where name='${printerName}'`,
    (err, rows, fields) => {
      if (err) {
        console.log("send Fail");
        res.status(500);
        res.send("New print failed");
        return;
      }

      console.log("print sent successfully");
      res.send(rows[0]);
    }
  );
});

/**
 * updates a printer in the Printer table once a print has finished
 * replaces the orderNumber, product, printTime, and startTime of the desired printer with null
 */
app.put("/printData/clear/:printerName", (req, res) => {
  const { printerName } = req.params;
  dbConnect.query(
    `update Printer set orderNumber=null, product=null, printTime=null,startTime=null where name='${printerName}'`,
    (err, rows, fields) => {
      if (err) {
        console.log("clear failed");
        res.status(500);
        res.send("Dataset query failed");
        return;
      }

      res.send("Clear Print Successful");
    }
  );
});

/**
 * checks if the userID and password that someone entered are found within the user table
 */
app.post("/login", (req, res) => {
  dbConnect.getConnection((err, connection) => {
    connection.query(
      `select count(userID) as userCount from User where userID='${req.body.userID}'`,
      (err, rows, fields) => {
        if (err || rows[0].userCount != 1) {
          connection.release();
          res.status(401);
          res.send("User not found");
          return;
        }
        connection.query(
          `select count(password) as passCount from User where password='${req.body.password}' and userID='${req.body.userID}'`,
          (err, rows, fields) => {
            if (err || rows[0].passCount != 1) {
              connection.release();
              res.status(401);
              res.send("Password Incorrect");
              return;
            }
            connection.release();
            res.send("Login Successful");
          }
        );
      }
    );
  });
});

/**
 * gets every note from the Notes table
 */
app.get("/notes", (req, res) => {
  dbConnect.query("select * from Notes", (err, rows, fields) => {
    if (err) {
      res.status(500);
      res.send("Getting notes failed");
      return;
    }
    const notes = [];
    rows.forEach((row) => {
      notes.push({ ...row });
    });
    res.send(notes);
  });
});

/**
 * deletes a note from the Notes table
 */
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  console.log("id = " + id);

  dbConnect.query(
    `delete from Notes where noteID=${id}`,
    (err, rows, fields) => {
      if (err) {
        res.status(500);
        res.send("Note Deletion failed");
        return;
      }
      res.send("Note deleted");
    }
  );
});

/**
 * creates a new note in the Notes table with the title and note passed in from the body
 */
app.post("/notes", (req, res) => {
  const sql = `insert into Notes (title,note,postDate) values ('${req.body.name}', '${req.body.note}',current_timestamp())`;
  console.log("sql: " + sql);

  dbConnect.query(sql, (err, rows, fields) => {
    console.log("new note 392");
    if (err) {
      res.status(500);
      res.send("Note creation failed");
      return;
    }
    console.log("new note creation 398");
    res.send("Note has been created");
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
