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
          console.debug(res);
          this.setState({ isLoggedIn: true, currentUserId: res.data.userId });
        })
        .catch(err => {
          console.debug(err);
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
        console.debug(res);
        this.setState({ isLoggedIn: true, currentUserId: res.data.userId });
      })
      .catch(err => {
        console.debug(err);
        this.setState({ errorMessage: err });
      });
  };

  signoutHandler = () => {
    this.setState({ isLoggedIn: false });
  };

  onInputChange = evt => {
    this.setState({
      [evt.target.id]: evt.target.value
    });
  };

  render() {
    const { isLoggedIn, currentUserId } = this.state;
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn,
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
