import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { Navbar, Nav, NavDropdown, Jumbotron } from "react-bootstrap";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { PrivateRoute } from "../App";

import CurrentOrders from "./CurrentOrders";
import MyAssignments from "./MyAssignments";
import ShippedOrders from "./ShippedOrders";
import PrinterStatus from "./PrinterStatus";
import NewOrderForm from "./NewOrderForm";
import AssigningPage from "./AssigningPage";
import AssignmentForm from "./AssignmentForm";
import FulfillmentPage from "./FulfillmentPage";
import HomePage from "./HomePage";
import OrderManagement from "./OrderManagement";
import LoginPage from "./LoginPage";
import NotesPage from "./NotesPage";

const Header = (props) => {
  const history = useHistory();
  let { path, url } = useRouteMatch();
  console.log("Path: " + path);
  console.log("Url = " + url);

  const logOut = () => {
    sessionStorage.removeItem("user");
    history.push("/login");
  };

  return (
    <BrowserRouter>
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href={`${url}`}>WCW Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {/* <Nav.Link href="/current">Current Orders</Nav.Link> */}
              <Nav.Link href={`${url}/manageOrders/current`}>
                Manage Orders
              </Nav.Link>
              {/* <Nav.Link href="/assignments">Job Assignments</Nav.Link> */}
              {/* <Nav.Link href="/shipped">Shipped Orders</Nav.Link> */}
              <Nav.Link href={`${url}/printers`}>Printer Status</Nav.Link>
              <Nav.Link href={`${url}/notes`}>Notes</Nav.Link>
              {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown> */}
            </Nav>
            <Nav>
              <Nav.Link
                onClick={() => {
                  logOut();
                }}
              >
                Logout
              </Nav.Link>
              {/* <Nav.Link eventKey={2} href="#memes">
                        Dank memes
                    </Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route exact path={`${path}`} component={HomePage} />
          {/* <Route exact path="/current" component={CurrentOrders}/> */}
          {/* <Route exact path = "/assignments" component = {MyAssignments}/> */}
          {/* <Route exact path = "/shipped" component = {ShippedOrders}/> */}
          <PrivateRoute path={`${path}/printers`}>
            <PrinterStatus />
          </PrivateRoute>
          {/* <Route path={`${path}/printers`} component = {PrinterStatus}/> */}
          {/* <Route exact path = "/printData/:printerName" component = {PrinterStatus}/> */}
          <Route path={`${path}/newOrder`} component={NewOrderForm} />
          <Route
            path={`${path}/processing/:orderNum`}
            component={AssigningPage}
          />
          <Route path={`${path}/assign/:orderNum`} component={AssignmentForm} />
          <Route path={`${path}/notes`} component={NotesPage} />
          <Route
            path={`${path}/fulfilling/:orderNum`}
            component={FulfillmentPage}
          />
          {/* <Route path={`${path}/manageOrders`} component={OrderManagement} /> */}
          <Route path="/wcw/manageOrders" component={OrderManagement} />
          {/* <Route exact path="/login" component={LoginPage} /> */}

          {/* <Route exact path="/home" component={HomePage}/> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
};
export default Header;
