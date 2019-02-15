import { IconButton, Snackbar } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React from "react";
import { SharedSnackbarConsumer } from "./SharedSnackBarProvider";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2
  }
});

const SharedSnackbar = () => (
  <SharedSnackbarConsumer>
    {({ snackbarIsOpen, message, closeSnackbar }) => (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={snackbarIsOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        message={message}
        action={[
          <IconButton key="close" color="inherit" onClick={closeSnackbar}>
            <Close />
          </IconButton>
        ]}
      />
    )}
  </SharedSnackbarConsumer>
);

export default withStyles(styles)(SharedSnackbar);
