import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

import AddTokensForm from "./AddTokensForm";

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

class ManageTokens extends React.Component {
  render() {
    const {
      classes,
      totalTokens,
      tokensRemaining,
      openAddTokensModal,
      isAddTokensModalOpen,
      closeAddTokensModal,
      addTokens,
      onInputChange
    } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h6" className={classes.title}>
          Total tokens in the network: {totalTokens}
        </Typography>
        <Typography variant="h6" className={classes.title}>
          Tokens remaining in the network: {tokensRemaining}
        </Typography>
        <Button
          color="inherit"
          className={classes.defaultChild}
          onClick={openAddTokensModal}
        >
          Add Tokens
        </Button>
        <Dialog
          open={isAddTokensModalOpen}
          onClose={closeAddTokensModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add tokens:</DialogTitle>
          <DialogContent>
            <AddTokensForm
              addTokens={addTokens}
              onInputChange={onInputChange}
              onSubmit={addTokens}
              totalTokens={totalTokens}
              tokensRemaining={tokensRemaining}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAddTokensModal} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ManageTokens.propTypes = {
  classes: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  openAddTokensModal: PropTypes.func.isRequired,
  closeAddTokensModal: PropTypes.func.isRequired,
  isAddTokensModalOpen: PropTypes.bool.isRequired,
  addTokens: PropTypes.func.isRequired
};

export default withStyles(styles)(ManageTokens);
