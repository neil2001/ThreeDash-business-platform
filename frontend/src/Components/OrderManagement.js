import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";

import CurrentOrders from "./CurrentOrders";
import MyAssignments from "./MyAssignments";
import ShippedOrders from "./ShippedOrders";
import NewOrderForm from "./NewOrderForm";
import AssigningPage from "./AssigningPage";
import FulfillmentPage from "./FulfillmentPage";

/**
 * Displays the order management interface and sets up the necessary menu and router elements
 */
const OrderManagement = (props) => {
  let { path, url } = useRouteMatch();
  return (
    <BrowserRouter>
      <div>
        <div className="row">
          <div className="menuColumn">
            <ProSidebar>
              <Menu iconShape="square">
                <h3 className="sideBarTitle">Windy City Woodwinds 2020</h3>
                <MenuItem>
                  Current Orders
                  <Link to={`${url}/current`} />
                </MenuItem>
                <MenuItem>
                  Assigned Orders
                  <Link to={`${url}/assignments`} />
                </MenuItem>
                <MenuItem>
                  Shipped Orders
                  <Link to={`${url}/shipped`} />
                </MenuItem>
              </Menu>
            </ProSidebar>
            ;
          </div>
          <div className="contentColumn">
            <Switch>
              <Route path={`${path}/current`} component={CurrentOrders} />
              <Route path={`${path}/assignments`} component={MyAssignments} />
              <Route path={`${path}/shipped`} component={ShippedOrders} />
              <Route path={`${path}/newOrder`} component={NewOrderForm} />
              <Route
                path={`${path}/processing/:orderNum`}
                component={AssigningPage}
              />
              <Route
                path={`${path}/fulfilling/:orderNum`}
                component={FulfillmentPage}
              />
            </Switch>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default OrderManagement;
