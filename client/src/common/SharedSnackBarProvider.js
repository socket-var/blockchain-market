import React, { Component } from "react";
import SharedSnackbar from "./SharedSnackBar";

const SharedSnackbarContext = React.createContext();

class SharedSnackbarProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      message: ""
    };
  }

  openSnackbar = message => {
    this.setState({
      message,
      isOpen: true
    });
  };

  closeSnackbar = () => {
    this.setState({
      message: "",
      isOpen: false
    });
  };

  render() {
    const { children } = this.props;

    return (
      <SharedSnackbarContext.Provider
        value={{
          openSnackbar: this.openSnackbar,
          closeSnackbar: this.closeSnackbar,
          snackbarIsOpen: this.state.isOpen,
          message: this.state.message
        }}
      >
        <SharedSnackbar />
        {children}
      </SharedSnackbarContext.Provider>
    );
  }
}

const SharedSnackbarConsumer = SharedSnackbarContext.Consumer;
export { SharedSnackbarProvider, SharedSnackbarConsumer };
