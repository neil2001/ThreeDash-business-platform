const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 4000;
const mysql = require("mysql");
const { count } = require("console");

// const dbConnect = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "NeilXu2001!",
//   database: "wcw",
// });

var dbConnect = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  password: "NeilXu2001!",
  database: "wcw",
  //dateString: true,
});

// dbConnect.connect();

// dbConnect.query(
//   "select name,password from user where userID = 'test';",
//   (err, rows, fields) => {
//     if (err) throw err;

//     console.log("The name is: ", rows[0].name);
//   }
// );

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
      console.log("The product is: ", rows[0].product);
      res.send(orders);
    }
  );
});

app.post("/order", (req, res) => {
  const sql = `insert into orders (product, color, printTime, notes) values ('${req.body.product}', '${req.body.color}', 6.5, '${req.body.notes}')`;
  console.log("insert new order = " + sql);
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
      console.log("The assignee is: ", rows[0].name);
      res.send(assignments);
    }
  );
});

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

app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;
  console.log("id = " + id);
  dbConnect.query(
    `delete from orders where number=${id}`,
    (err, rows, fields) => {
      if (err) {
        res.status(500);
        res.send("Order deletion failed");
        return;
      }
      res.send("order deleted");
    }
  );
});

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

app.put("/printData/newPrint/:printerName", (req, res) => {
  const { printerName } = req.params;
  const sql = `update Printer set orderNumber=${req.body.number}, product='${req.body.product}', printTime='${req.body.printTime}', startTime=${req.body.startTime} where name='${printerName}'`;
  console.log("sql= " + sql);
  dbConnect.query(
    `update Printer set orderNumber=${req.body.number}, product='${req.body.product}', printTime='${req.body.printTime}', startTime=current_timestamp() where name='${printerName}'`,
    (err, rows, fields) => {
      if (err) {
        console.log("send Fail");
        res.status(500);
        res.send("New print failed");
        return;
      }
      // const printers = [];
      // rows.forEach((row) => {
      //   printers.push({ ...row });
      // });
      //console.log("The product is: ", rows[0].name);
      console.log("print sent successfully");
      res.send(rows[0]);
    }
  );
});

app.put("/printData/clear/:printerName", (req, res) => {
  const { printerName } = req.params;
  //const sql = `update Printer set orderNumber="", product="", printTime="",startTime="" where name='${printerName}'`;
  //console.log(sql);
  dbConnect.query(
    `update Printer set orderNumber=null, product=null, printTime=null,startTime=null where name='${printerName}'`,
    (err, rows, fields) => {
      if (err) {
        console.log("clear failed");
        res.status(500);
        res.send("Dataset query failed");
        return;
      }

      //console.log("The product is: ", rows[0].name);
      res.send("Clear Print Successful");
    }
  );
});

app.post("/login", (req, res) => {
  //const userData = readFile("./data/users.json");
  dbConnect.getConnection((err, connection) => {
    //console.log("connected 121");

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
    //console.log("The product is: ", rows[0].name);
    res.send(notes);
  });
});

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
// console.log("terminating connection");
