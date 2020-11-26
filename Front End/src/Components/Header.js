import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { PrivateRoute } from "../App";

import PrinterStatus from "./PrinterStatus";
import NewOrderForm from "./NewOrderForm";
import AssigningPage from "./AssigningPage";
import FulfillmentPage from "./FulfillmentPage";
import HomePage from "./HomePage";
import OrderManagement from "./OrderManagement";
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

  /**
   * returns the navbar and the necessary routes to take the user to each component
   */
  return (
    <BrowserRouter>
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href={`${url}`}>WCW Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href={`${url}/manageOrders/current`}>
                Manage Orders
              </Nav.Link>
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
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route exact path={`${path}`} component={HomePage} />
          <PrivateRoute path={`${path}/printers`}>
            <PrinterStatus />
          </PrivateRoute>
          <Route path={`${path}/newOrder`} component={NewOrderForm} />
          <Route
            path={`${path}/processing/:orderNum`}
            component={AssigningPage}
          />
          <Route path={`${path}/notes`} component={NotesPage} />
          <Route
            path={`${path}/fulfilling/:orderNum`}
            component={FulfillmentPage}
          />
          <Route path="/wcw/manageOrders" component={OrderManagement} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};
export default Header;
