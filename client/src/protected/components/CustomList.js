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
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import AddDepositForm from "./AddDepositForm";

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

class UserList extends React.Component {
  render() {
    const {
      classes,
      data,
      removeUser,
      placeholder,
      openDepositModal,
      closeDepositModal,
      accountBalance,
      isAddDepositModalOpen,
      onInputChange,
      addDeposit,
      userId
    } = this.props;

    const listItems = data.map((item, idx) => (
      <ListItem key={item._id}>
        {/* should use account address later */}
        <ListItemText
          primary={`${item.email} - Account balance: ${item.accountBalance}`}
        />
        <ListItemSecondaryAction>
          <IconButton
            aria-label="Delete"
            onClick={removeUser}
            id={item._id}
            data-key={idx}
          >
            <DeleteIcon />
          </IconButton>
          <Button
            color="primary"
            onClick={openDepositModal(item)}
            id={item._id}
            data-key={idx}
          >
            Add deposit
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
    ));

    return (
      <div className={classes.root}>
        <Typography variant="h6" className={classes.title}>
          Registered Users:
        </Typography>
        <Dialog
          open={isAddDepositModalOpen}
          onClose={closeDepositModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add deposit</DialogTitle>
          <DialogContent>
            <AddDepositForm
              accountBalance={accountBalance}
              onInputChange={onInputChange}
              onSubmit={addDeposit}
              displayPasswordField={false}
              userId={userId}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDepositModal} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <div className={classes.demo}>
          {listItems.length > 0 ? (
            <List>{listItems}</List>
          ) : (
            <div>{placeholder || "No entries to display here"} </div>
          )}
        </div>
      </div>
    );
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array,
  removeUser: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  openDepositModal: PropTypes.func.isRequired,
  closeDepositModal: PropTypes.func.isRequired,
  accountBalance: PropTypes.number.isRequired,
  isAddDepositModalOpen: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  addDeposit: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
};

export default withStyles(styles)(UserList);
