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
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      classes,
      isLoggedIn,
      isAdminLoggedIn,
      signoutHandler,
      userId,
      accountType
    } = this.props;
    const { value } = this.state;

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
                    <Tab
                      label="Buy"
                      to={`/user/${userId}/buy`}
                      component={Link}
                    />
                  )}
                  {(accountType === "seller" ||
                    accountType === "buyer_and_seller") && (
                    <Tab
                      label="Sell"
                      to={`/user/${userId}/sell`}
                      component={Link}
                    />
                  )}
                  {(accountType === "buyer" ||
                    accountType === "buyer_and_seller") && (
                    <Tab
                      label="Cart"
                      to={`/user/${userId}/cart`}
                      component={Link}
                    />
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
  signoutHandler: PropTypes.func.isRequired
};

export default withStyles(styles)(AppNavBar);
