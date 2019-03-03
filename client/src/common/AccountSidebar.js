import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { AccountCircle, AccountBalanceWallet } from "@material-ui/icons";
import { Link } from "react-router-dom";

const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  }
};

const AccountSidebar = ({ classes, openRight, toggleDrawer }) => {
  const sideList = (
    <div className={classes.list}>
      <List>
        {["Purchase history", "Wallet"].map((text, index) => (
          <ListItem
            button
            key={text}
            component={Link}
            to={index === 0 ? "/user/purchases" : "/user/add_deposit"}
          >
            <ListItemIcon>
              {index === 0 ? <AccountCircle /> : <AccountBalanceWallet />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer anchor="right" open={openRight} onClose={toggleDrawer(false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {sideList}
        </div>
      </Drawer>
    </div>
  );
};

AccountSidebar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AccountSidebar);
