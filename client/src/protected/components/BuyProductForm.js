import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  margin: {
    margin: theme.spacing.unit
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

const BuyProductForm = props => {
  const {
    isBuyConfirmOpen,
    closeBuyConfirm,
    selectedProduct,
    classes,
    onSubmit,
    onInputChange
  } = props;
  return (
    <div>
      <Dialog
        open={isBuyConfirmOpen}
        onClose={closeBuyConfirm}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Confirm transaction</DialogTitle>
        <DialogContent>
          <div>
            <h3>{selectedProduct.productName}</h3>
          </div>
          <div>{selectedProduct.retailPrice}</div>
          <form className={classes.form} onSubmit={onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <React.Fragment>
                <InputLabel htmlFor="passwordField">
                  Confirm your password
                </InputLabel>
                <Input
                  name="confirm-buy-password"
                  type="password"
                  id="confirmBuyPasswordField"
                  autoComplete="confirm-buy-password"
                  onChange={onInputChange}
                />
              </React.Fragment>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Buy Product
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBuyConfirm} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

BuyProductForm.propTypes = {};

export default withStyles(styles)(BuyProductForm);
