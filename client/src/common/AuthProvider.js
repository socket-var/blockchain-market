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

  state = {
    isLoggedIn: false,
    isAdminLoggedIn: false,
    currentUserId: null,
    emailField: "",
    passwordField: "",
    confirmPasswordField: "",
    accountAddressField: "",
    message: ""
  };

  catchFunction = err => {
    let message = ajaxErrorHandler(err);

    this.props.openSnackbar(message);

    this.setState({ message });
  };

  signupHandler = evt => {
    evt.preventDefault();

    const {
      accountAddressField,
      emailField,
      passwordField,
      confirmPasswordField
    } = this.state;

    if (passwordField === confirmPasswordField) {
      axios
        .post("/auth/signup", {
          accountAddress: accountAddressField,
          email: emailField,
          password: passwordField
        })
        .then(res => {
          const { user, message } = res.data;

          this.props.openSnackbar(message);
          this.setState({ isLoggedIn: true, currentUserId: user._id });
        })
        .catch(this.catchFunction);
    } else {
      this.props.openSnackbar("Passwords do not match. Please try again!");
      this.setState({
        message: "Passwords do not match. Please try again!"
      });
    }
  };

  loginHandler = evt => {
    evt.preventDefault();

    const { emailField, passwordField } = this.state;

    axios
      .post("/auth/login", {
        email: emailField,
        password: passwordField
      })
      .then(res => {
        const { user, message } = res.data;
        this.props.openSnackbar(message);
        if (user.isAdmin) {
          this.setState({
            isAdminLoggedIn: true,
            currentUserId: user._id
          });
        } else {
          this.setState({ isLoggedIn: true, currentUserId: user._id });
        }
      })
      .catch(this.catchFunction);
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

  render() {
    const { isLoggedIn, currentUserId, isAdminLoggedIn } = this.state;
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn,
          isAdminLoggedIn,
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
