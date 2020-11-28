const queries = {
  currentOrders: "select * from orders where status !='SHIPPED'",
  assignedOrders:
    "select a.name,o.number,o.product,o.color,o.retrieveSTL,o.startPrint,o.sand,o.package,o.ship,o.notes from Assignment a join orders o on o.number=a.orderNumber;",
  shippedOrders:
    "select s.shipDate,o.number,o.product,o.color,o.notes from Shipped s join orders o on o.number=s.orderNumber;",
  newOrder:
    "insert into orders (product, color, notes) values ('{0}', '{1}', '{2}')",
  deleteOrder: "delete from orders where number={0}",
  newAssigned: "insert into Assignment (name, orderNumber) values ('{0}', {1})",
  updateOrderStatus: "update orders set status='ASSIGNED' where number={0}",
  deleteShipped: "delete from Shipped where orderNumber={0}",
  deleteAssigned: "delete from Assignment where orderNumber={0}",
  updateOrderTask: "update orders set {0}='{1}' where number={2}",
  selectOrder: "select * from orders where number={0}",
  newShippedOrder:
    "insert into Shipped (orderNumber,shipDate) values ('{0}', CURRENT_TIMESTAMP())",
  updateOrderShipped: "update orders set status='SHIPPED' where number={0}",
  printerInfo: "select * from Printer",
  updatePrinter:
    "update Printer set orderNumber={0}, product='{1}', printTime='{2}', startTime=current_timestamp() where name='{3}'",
  clearPrinter:
    "update Printer set orderNumber=null, product=null, printTime=null,startTime=null where name='{0}'",
  selectUserCount:
    "select count(userID) as userCount from User where userID='{0}'",
  selectPwdCount:
    "select count(password) as passCount from User where password='{0}' and userID='{1}'",
  selectNotes: "select * from Notes",
  deleteNote: "delete from Notes where noteID={0}",
  newNote:
    "insert into Notes (title,note,postDate) values ('{0}', '{1}',current_timestamp())",
};

exports.sql = queries;
