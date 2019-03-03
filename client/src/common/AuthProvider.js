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
    accountType: null,
    currentUserId: null,
    emailField: "",
    passwordField: "",
    confirmPasswordField: "",
    accountAddressField: "",
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
      sellerCheckbox,
      buyerCheckbox
    } = this.state;

    if (passwordField === confirmPasswordField) {
      try {
        let accountType;
        if (sellerCheckbox && buyerCheckbox) {
          accountType = "buyer_and_seller";
        } else if (sellerCheckbox) {
          accountType = "seller";
        } else if (buyerCheckbox) {
          accountType = "buyer";
        } else {
          return this.props.openSnackbar(
            "Should select atleast one of buyer and seller!!"
          );
        }

        const signupResult = await axios.post("/auth/signup", {
          accountAddress: accountAddressField,
          email: emailField,
          password: passwordField,
          accountType
        });

        const { user, message } = signupResult.data;

        this.props.openSnackbar(message);
        this.setState({
          isLoggedIn: true,
          accountType: user.accountType,
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
      if (user.accountType === "admin") {
        this.setState({
          isAdminLoggedIn: true,
          currentUserId: user._id,
          accountType: user.accountType,
          accountBalance: user.accountBalance
        });
      } else {
        this.setState({
          isLoggedIn: true,
          accountType: user.accountType,
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

  onCheckStateChange = evt => {
    console.debug(evt.target.id);
    this.setState({
      [evt.target.id]: evt.target.checked
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
      accountType,
      accountBalance
    } = this.state;
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn,
          isAdminLoggedIn,
          accountType,
          accountBalance,
          currentUserId,
          signupHandler: this.signupHandler,
          loginHandler: this.loginHandler,
          signoutHandler: this.signoutHandler,
          onInputChange: this.onInputChange,
          onCheckStateChange: this.onCheckStateChange
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
