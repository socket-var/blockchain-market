import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
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

class CustomList extends React.Component {
  render() {
    const { classes, data, onClickFunction, placeholder } = this.props;

    const listItem = [];

    data.forEach((item, idx) => {
      listItem.push(
        <ListItem key={item._id}>
          <ListItemText primary={item.email} />
          <ListItemSecondaryAction>
            <IconButton
              aria-label="Delete"
              onClick={onClickFunction}
              id={item._id}
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
        <Typography variant="h6" className={classes.title}>
          Registered Users:
        </Typography>
        <div className={classes.demo}>
          {listItem.length > 0 ? (
            <List>{listItem}</List>
          ) : (
            <div>{placeholder || "No entries to display here"} </div>
          )}
        </div>
      </div>
    );
  }
}

CustomList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array,
  onClickFunction: PropTypes.func,
  placeholder: PropTypes.string
};

export default withStyles(styles)(CustomList);
