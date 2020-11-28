const queries = require("./queries");
const utility = require("./utility");

const selectOrders = (dbConnect, success, error) => {
  dbConnect.query(queries.sql.currentOrders, (err, rows, fields) => {
    if (err) {
      error();
      return;
    }
    const orders = [];
    rows.forEach((row) => {
      orders.push({ ...row });
    });
    success(orders);
  });
};

const deleteOrder = (dbConnect, id, success, error) => {
  dbConnect.query(
    utility.formatter(queries.sql.deleteOrder, id),
    (err, rows, fields) => {
      if (err) {
        error();
        return;
      }
      success();
    }
  );
};

const selectAssignments = (dbConnect, success, error) => {
  dbConnect.query(queries.sql.assignedOrders, (err, rows, fields) => {
    if (err) {
      error();
      return;
    }
    const assignments = [];
    rows.forEach((row) => {
      assignments.push({ ...row });
    });
    success(assignments);
  });
};

const selectShipped = (dbConnect, success, error) => {
  dbConnect.query(queries.sql.shippedOrders, (err, rows, fields) => {
    if (err) {
      error();
      return;
    }
    const shippedOrders = [];
    rows.forEach((row) => {
      shippedOrders.push({ ...row });
    });

    success(shippedOrders);
  });
};

const deleteShippedOrder = (dbConnect, id, success, error) => {
  dbConnect.query(
    utility.formatter(queries.sql.deleteShipped, id),
    (err, rows, fields) => {
      if (err) {
        error();
        return;
      }
      success();
    }
  );
};

const deleteAssigned = (dbConnect, id, success, error) => {
  dbConnect.query(
    utility.formatter(queries.sql.deleteAssigned, id),
    (err, rows, fields) => {
      if (err) {
        error();
        return;
      }
      success();
    }
  );
};

const selectPrinters = (dbConnect, success, error) => {
  dbConnect.query(queries.sql.printerInfo, (err, rows, fields) => {
    if (err) {
      error();
      return;
    }
    const printers = [];
    rows.forEach((row) => {
      printers.push({ ...row });
    });
    success(printers);
  });
};

const selectNotes = (dbConnect, success, error) => {
  dbConnect.query(queries.sql.selectNotes, (err, rows, fields) => {
    if (err) {
      error();
      return;
    }
    const notes = [];
    rows.forEach((row) => {
      notes.push({ ...row });
    });
    success(notes);
  });
};

const deleteNote = (dbConnect, id, success, error) => {
  dbConnect.query(
    utility.formatter(queries.sql.deleteNote, id),
    (err, rows, fields) => {
      if (err) {
        error();
        return;
      }
      success();
    }
  );
};

exports.actions = {
  selectOrders,
  deleteOrder,
  selectAssignments,
  selectShipped,
  deleteShippedOrder,
  deleteAssigned,
  selectPrinters,
  selectNotes,
  deleteNote,
};
