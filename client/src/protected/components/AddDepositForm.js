import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

// TODO: remove isUserDisabledFLag
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

function AddDepositForm(props) {
  const {
    classes,
    onInputChange,
    onSubmit,
    accountBalance,
    displayPasswordField,
    userId
  } = props;
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <form className={classes.form} onSubmit={onSubmit}>
          <FormControl className={classes.formControl} disabled>
            <InputLabel htmlFor="user_id">User ID</InputLabel>
            <Input
              name="user_id"
              type="text"
              id="userIdField"
              autoComplete="userId"
              onChange={onInputChange}
              value={userId}
            />
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            {displayPasswordField && (
              <React.Fragment>
                <InputLabel htmlFor="passwordField">
                  Confirm your password
                </InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="passwordField"
                  autoComplete="password"
                  onChange={onInputChange}
                />
              </React.Fragment>
            )}
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="rechargeAmountField">
              Recharge amount
            </InputLabel>
            <Input
              type="number"
              name="recharge-amount"
              id="rechargeAmountField"
              autoComplete="recharge-amount"
              onChange={onInputChange}
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Add Money
          </Button>
        </form>
        <div>Current Wallet Balance is: {accountBalance}</div>
      </Paper>
    </main>
  );
}

AddDepositForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  accountBalance: PropTypes.number.isRequired,
  displayPasswordField: PropTypes.bool,
  isUserIdFieldDisabled: PropTypes.bool,
  userId: PropTypes.string.isRequired
};

export default withStyles(styles)(AddDepositForm);
