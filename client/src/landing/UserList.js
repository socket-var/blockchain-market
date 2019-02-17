import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`
  }
});

class InteractiveList extends React.Component {
  state = {
    dense: false,
    secondary: false
  };

  render() {
    const { classes, users, deleteFunction } = this.props;
    const { dense, secondary } = this.state;

    const UserListItem = [];

    users.forEach((user, idx) => {
      UserListItem.push(
        <ListItem key={user._id}>
          <ListItemText
            primary={user.email}
            // secondary={secondary ? "Secondary text" : null}
          />
          <ListItemSecondaryAction>
            <IconButton
              aria-label="Delete"
              onClick={deleteFunction}
              id={user._id}
              data-key={idx}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    });

    return (
      <div className={classes.root}>
        {/* <Grid item xs={12} md={6}> */}
        <Typography variant="h6" className={classes.title}>
          Registered Users:
        </Typography>
        <div className={classes.demo}>
          <List dense={dense}>{UserListItem}</List>
        </div>
        {/* </Grid> */}
      </div>
    );
  }
}

InteractiveList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InteractiveList);
