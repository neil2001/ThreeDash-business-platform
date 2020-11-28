const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 4000;
const mysql = require("mysql");
const queries = require("./queries");
const dba = require("./databaseActions");
const utility = require("./utility");

// const utility.formatter = (a, ...args) => {
//   for (let k = 0; k < args.length; k++) {
//     a = a.replace(new RegExp("\\{" + k + "\\}", "g"), args[k]);
//   }
//   return a;
// };

var dbConnect = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  port: 3306,
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
  dba.actions.selectOrders(
    dbConnect,
    (orders) => {
      res.send(orders);
    },
    () => {
      res.status(500);
      res.send("Dataset query failed");
    }
  );
});

/**
 * creates a new order given a product, color, printTime, and notes input
 */
app.post("/order", (req, res) => {
  const sql = utility.formatter(
    queries.sql.newOrder,
    req.body.product,
    req.body.color,
    req.body.notes
  );
  dbConnect.query(sql, (err, rows, fields) => {
    if (err) {
      console.error(err);
      res.status(500);
      res.send("Dataset query failed");
      return;
    }
    res.send("Order has been created");
  });
});

/**
 * deletes an order from the orders table based on its number
 */
app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;
  dba.actions.deleteOrder(
    dbConnect,
    id,
    () => {
      res.send("order deleted");
    },
    () => {
      res.status(500);
      res.send("Order deletion failed");
    }
  );
});

/**
 * gets an assignment name and number from the Assignment table,
 * and joins the Assignment table with the orders table by orderNumber to get
 * product, color, processing status values, and notes
 */
app.get("/assigned", (req, res) => {
  dba.actions.selectAssignments(
    dbConnect,
    (assignments) => {
      res.send(assignments);
    },
    () => {
      res.status(500);
      res.send("Dataset query failed");
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
      utility.formatter(
        queries.sql.newAssigned,
        req.body.name,
        req.body.number
      ),
      (err, rows, fields) => {
        if (err) {
          connection.release();
          res.status(500);
          res.send("new assignment creation failed");
          return;
        }
        connection.query(
          utility.formatter(queries.sql.updateOrderStatus, req.body.number),
          (err, rows, fields) => {
            if (err) {
              connection.release();
              res.status(500);
              res.send("update orders status failed");
              return;
            }
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
  dba.actions.selectShipped(
    dbConnect,
    (shippedOrders) => {
      res.send(shippedOrders);
    },
    () => {
      res.status(500);
      res.send("Dataset query failed");
    }
  );
});

/**
 * deletes a shipped order from the Shipped table
 * In: order number
 */
app.delete("/shippedOrders/:id", (req, res) => {
  const { id } = req.params;
  dba.actions.deleteShippedOrder(
    dbConnect,
    id,
    () => {
      res.send("shipment deleted");
    },
    () => {
      res.status(500);
      res.send("Dataset query failed");
    }
  );
});

/**
 * deletes an assignment from the Assignment table
 * In: order number
 */
app.delete("/assigned/:id", (req, res) => {
  const { id } = req.params;
  dba.actions.deleteAssigned(
    dbConnect,
    id,
    () => {
      res.send("Assignment deleted");
    },
    () => {
      res.status(500);
      res.send("Assignment Deletion failed");
    }
  );
});

/**
 * updates the orders table once an assignment is created.
 * The value to be updated is given by the object passed in to the function.
 * This function changes the given order status to be the value of the object passed in, generally "Not Complete".
 */
app.put("/assigned/:id", (req, res) => {
  const { id } = req.params;

  const keyName = Object.keys(req.body)[0];
  dbConnect.getConnection((err, connection) => {
    connection.query(
      utility.formatter(
        queries.sql.updateOrderTask,
        keyName,
        req.body[keyName],
        id
      ),
      (err, rows, fields) => {
        if (err) {
          res.status(500);
          res.send("Assignment Deletion failed");
          return;
        }
        connection.query(
          utility.formatter(queries.sql.selectOrder, id),
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
    connection.query(
      utility.formatter(queries.sql.newShippedOrder, req.body.number),
      (err, rows, fields) => {
        if (err) {
          connection.release();
          res.status(500);
          res.send("new shipment creation failed");
          return;
        }
        connection.query(
          utility.formatter(queries.sql.updateOrderShipped, req.body.number),
          (err, rows, fields) => {
            if (err) {
              connection.release();
              res.status(500);
              res.send("update orders status failed");
              return;
            }
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
  dba.actions.selectPrinters(
    dbConnect,
    (printers) => {
      res.send(printers);
    },
    () => {
      res.status(500);
      res.send("Dataset query failed");
    }
  );
});

/**
 * updates the Printer table with a new print to a corresponding printer that is passed in
 */
app.put("/printData/newPrint/:printerName", (req, res) => {
  const { printerName } = req.params;
  dbConnect.query(
    utility.formatter(
      queries.sql.updatePrinter,
      req.body.number,
      req.body.product,
      req.body.printTime,
      printerName
    ),
    (err, rows, fields) => {
      if (err) {
        res.status(500);
        res.send("New print failed");
        return;
      }
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
    utility.formatter(queries.sql.clearPrinter, printerName),
    (err, rows, fields) => {
      if (err) {
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
      utility.formatter(queries.sql.selectUserCount, req.body.userID),
      (err, rows, fields) => {
        if (err || rows[0].userCount != 1) {
          connection.release();
          res.status(401);
          res.send("User not found");
          return;
        }
        connection.query(
          utility.formatter(
            queries.sql.selectPwdCount,
            req.body.password,
            req.body.userID
          ),
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
  dba.actions.selectNotes(
    dbConnect,
    (notes) => {
      res.send(notes);
    },
    () => {
      res.status(500);
      res.send("Getting notes failed");
    }
  );
});

/**
 * deletes a note from the Notes table
 */
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  dba.actions.deleteNote(
    dbConnect,
    id,
    () => {
      res.send("Note deleted");
    },
    () => {
      res.status(500);
      res.send("Note Deletion failed");
    }
  );
});

/**
 * creates a new note in the Notes table with the title and note passed in from the body
 */
app.post("/notes", (req, res) => {
  dbConnect.query(
    utility.formatter(queries.sql.newNote, req.body.name, req.body.note),
    (err, rows, fields) => {
      if (err) {
        res.status(500);
        res.send("Note creation failed");
        return;
      }
      res.send("Note has been created");
    }
  );
});

app.listen(port, () => {
  console.log("WCW Server is up and listening at " + port);
});
