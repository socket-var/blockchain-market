import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// create context for user authentication
const AuthContext = React.createContext();

export default class AuthProvider extends Component {
  static propTypes = {
    // prop: PropTypes
  };

  state = {
    isLoggedIn: false,
    isAdminLoggedIn: false,
    currentUserId: null,
    emailField: "",
    passwordField: "",
    confirmPasswordField: "",
    errorMessage: ""
  };

  signupHandler = evt => {
    evt.preventDefault();

    const { emailField, passwordField, confirmPasswordField } = this.state;

    if (passwordField === confirmPasswordField) {
      axios
        .post("/auth/signup", {
          email: emailField,
          password: passwordField
        })
        .then(res => {
          const user = res.data.user;

          this.props.openSnackbar("Signed up successfully");

          this.setState({ isLoggedIn: true, currentUserId: user._id });
        })
        .catch(err => {
          this.setState({ errorMessage: err });
        });
    } else {
      this.setState({ errorMessage: "Passwords do not match" });
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
        this.props.openSnackbar("Logged in successfully");

        const user = res.data.user;
        console.debug(user);
        if (user.isAdmin) {
          this.setState({
            isAdminLoggedIn: true,
            currentUserId: user._id
          });
        } else {
          this.setState({ isLoggedIn: true, currentUserId: user._id });
        }
      })
      .catch(err => {
        this.setState({ errorMessage: err });
      });
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
