import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import axios from "axios";

// import components
import AppNavBar from "./common/AppNavBar";
import HomePage from "./HomePage";
import SignupPage from "./auth/SignupPage";
import LoginPage from "./auth/LoginPage";
import ProductsPage from "./ProductsPage";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailField: "",
      passwordField: "",
      confirmPasswordField: "",
      isLoggedIn: false,
      errorMessage: ""
    };
  }

  onInputChange = evt => {
    this.setState({
      [evt.target.id]: evt.target.value
    });
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
          this.setState({ isLoggedIn: true });
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
        this.setState({ isLoggedIn: true });
      })
      .catch(err => {
        console.debug(err);
        this.setState({ errorMessage: err });
      });
  };

  signoutHandler = () => {
    this.setState({ isLoggedIn: false });
  };

  render() {
    const { isLoggedIn } = this.state;

    return (
      <Router>
        <div className="App">
          <AppNavBar
            isLoggedIn={isLoggedIn}
            signoutHandler={this.signoutHandler}
          />
          <Route path="/" exact component={HomePage} />
          <Route
            path="/products"
            render={props =>
              isLoggedIn ? (
                <ProductsPage
                  {...props}
                  isLoggedIn={isLoggedIn}
                  // redirectToHome={redirectToHome}
                />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/auth/register"
            render={props =>
              isLoggedIn ? (
                <Redirect to="/products" />
              ) : (
                <SignupPage
                  {...props}
                  onSubmit={this.signupHandler}
                  onInputChange={this.onInputChange}
                  // errorMessage={signupPageErrorMessage}
                  isLoggedIn={isLoggedIn}
                />
              )
            }
          />
          <Route
            path="/auth/login"
            render={props =>
              isLoggedIn ? (
                <Redirect to="/products" />
              ) : (
                <LoginPage
                  {...props}
                  onSubmit={this.loginHandler}
                  onInputChange={this.onInputChange}
                  // errorMessage={loginPageErrorMessage}
                  isLoggedIn={isLoggedIn}
                />
              )
            }
          />
        </div>
      </Router>
    );
  }
}

export default App;
