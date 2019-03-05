// TODO: show user name on thenavbar
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import { Link } from "react-router-dom";
import AccountSidebar from "./AccountSidebar";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  floatToolBarItems: {
    justifyContent: "space-between"
  },
  logo: {
    marginRight: "2em",
    textDecoration: "none"
  },
  growChild: {
    flexGrow: 1
  },
  defaultChild: {
    flexGrow: 0
  }
});

class AppNavBar extends React.Component {
  state = {
    value: 0,
    openRight: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  toggleDrawer = open => () => {
    this.setState({
      openRight: open
    });
  };

  render() {
    const {
      classes,
      isLoggedIn,
      isAdminLoggedIn,
      signoutHandler,
      openAddTokensModal,
      accountType
    } = this.props;
    const { value, openRight } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar
            className={
              isLoggedIn || isAdminLoggedIn ? "" : classes.floatToolBarItems
            }
          >
            <Typography
              variant="h3"
              color="inherit"
              className={[classes.defaultChild, classes.logo].join(" ")}
              to="/"
              component={Link}
            >
              Blockchain Market
            </Typography>

            {isLoggedIn && (
              <React.Fragment>
                <Tabs
                  value={value}
                  onChange={this.handleChange}
                  className={classes.growChild}
                >
                  {(accountType === "buyer" ||
                    accountType === "buyer_and_seller") && (
                    <Tab label="Buy" to="/user/buy" component={Link} />
                  )}
                  {(accountType === "seller" ||
                    accountType === "buyer_and_seller") && (
                    <Tab label="Sell" to="/user/sell" component={Link} />
                  )}
                  {(accountType === "buyer" ||
                    accountType === "buyer_and_seller") && (
                    <Tab label="Cart" to="/user/cart" component={Link} />
                  )}
                </Tabs>
              </React.Fragment>
            )}

            {!(isAdminLoggedIn || isLoggedIn) && (
              <div>
                <Button
                  color="inherit"
                  className={classes.defaultChild}
                  to="/auth/register"
                  component={Link}
                >
                  Register
                </Button>
                <Button
                  color="inherit"
                  className={classes.defaultChild}
                  to="/auth/login"
                  component={Link}
                >
                  Login
                </Button>
              </div>
            )}

            {isLoggedIn && (
              <React.Fragment>
                <Button
                  color="inherit"
                  className={classes.defaultChild}
                  // to="/auth/login"
                  // component={Link}
                  onClick={this.toggleDrawer(true)}
                >
                  Your Account
                </Button>
                <AccountSidebar
                  openRight={openRight}
                  toggleDrawer={this.toggleDrawer}
                />
              </React.Fragment>
            )}

            {(isAdminLoggedIn || isLoggedIn) && (
              <Button
                color="inherit"
                className={classes.defaultChild}
                onClick={signoutHandler}
              >
                Sign out
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

AppNavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  signoutHandler: PropTypes.func.isRequired,
  openAddTokensModal: PropTypes.func.isRequired
};

export default withStyles(styles)(AppNavBar);
