import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

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

function AddTokens(props) {
  const {
    classes,
    onInputChange,
    onSubmit,
    totalTokens,
    tokensRemaining
  } = props;
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <form className={classes.form} onSubmit={onSubmit}>

          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="rechargeAmountField">
              Recharge amount
            </InputLabel>
            <Input
              type="number"
              name="add-tokens"
              id="addTokensField"
              autoComplete="add-tokens"
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
        <div>Total number of tokens in the network: {totalTokens}</div>
        <div>Tokens remaining to be distributed: {tokensRemaining}</div>
      </Paper>
    </main>
  );
}

AddTokens.propTypes = {
  classes: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  totalTokens: PropTypes.number.isRequired,
  tokensRemaining: PropTypes.number.isRequired
};

export default withStyles(styles)(AddTokens);
