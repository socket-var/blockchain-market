import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ajaxErrorHandler from "./functions/ajaxErrorHandler";

// create context for user authentication
const AuthContext = React.createContext();

export default class AuthProvider extends Component {
  static propTypes = {
    openSnackbar: PropTypes.func.isRequired
  };

  initialState = {
    isLoggedIn: false,
    isAdminLoggedIn: false,
    currentUserId: null,
    emailField: "",
    passwordField: "",
    confirmPasswordField: "",
    accountAddressField: "",
    privateKeyField: "",
    message: "",
    sellerCheckbox: false,
    buyerCheckbox: false,
    accountBalance: null
  };

  state = Object.assign({}, this.initialState);

  catchFunction = err => {
    let message = ajaxErrorHandler(err);

    this.props.openSnackbar(message);

    this.setState({ message });
  };

  signupHandler = async evt => {
    evt.preventDefault();

    const {
      accountAddressField,
      emailField,
      passwordField,
      confirmPasswordField,
      privateKeyField
    } = this.state;

    if (passwordField === confirmPasswordField) {
      try {
        const signupResult = axios.post("/auth/signup", {
          accountAddress: accountAddressField,
          email: emailField,
          password: passwordField,
          privateKey: privateKeyField
        });

        const { user, message } = signupResult.data;

        this.props.openSnackbar(message);
        this.setState({
          isLoggedIn: true,
          currentUserId: user._id,
          accountBalance: user.accountBalance
        });
      } catch (err) {
        this.catchFunction(err);
      }
    } else {
      this.props.openSnackbar("Passwords do not match. Please try again!");
      this.setState({
        message: "Passwords do not match. Please try again!"
      });
    }
  };

  loginHandler = async evt => {
    evt.preventDefault();

    const { emailField, passwordField } = this.state;

    try {
      const loginResult = await axios.post("/auth/login", {
        email: emailField,
        password: passwordField
      });
      const { user, message } = loginResult.data;
      this.props.openSnackbar(message);
      if (user.isAdmin) {
        this.setState({
          isAdminLoggedIn: true,
          currentUserId: user._id,
          accountBalance: user.accountBalance
        });
      } else {
        this.setState({
          isLoggedIn: true,
          currentUserId: user._id,
          accountBalance: user.accountBalance
        });
      }
    } catch (err) {
      this.catchFunction(err);
    }
  };

  signoutHandler = () => {
    const { isLoggedIn, isAdminLoggedIn } = this.state;
    this.props.openSnackbar("Signed out successfully");
    if (isAdminLoggedIn) {
      this.setState({ isAdminLoggedIn: false });
    } else if (isLoggedIn) {
      this.setState({ isLoggedIn: false });
    }
  };

  onInputChange = evt => {
    this.setState({
      [evt.target.id]: evt.target.value
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    // to make sure this block runs only when there is a change in state
    if (
      prevState.isLoggedIn !== this.state.isLoggedIn ||
      prevState.isAdminLoggedIn !== this.state.isAdminLoggedIn
    ) {
      // if loggedout reset state to initial
      if (!this.state.isLoggedIn && !this.state.isAdminLoggedIn) {
        this.setState(() => {
          return Object.assign({}, this.initialState);
        });
      }
    }
  };

  render() {
    const {
      isLoggedIn,
      currentUserId,
      isAdminLoggedIn,

      accountBalance
    } = this.state;
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn,
          isAdminLoggedIn,
          accountBalance,
          currentUserId,
          signupHandler: this.signupHandler,
          loginHandler: this.loginHandler,
          signoutHandler: this.signoutHandler,
          onInputChange: this.onInputChange
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
