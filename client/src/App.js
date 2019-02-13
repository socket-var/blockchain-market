import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";

// import components
import AppNavBar from "./common/AppNavBar";
import AppRoutes from "./common/AppRoutes";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailField: "",
      passwordField: "",
      confirmPasswordField: "",
      isLoggedIn: false,
      errorMessage: "",
      currentUserId: null
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

  render() {
    const { isLoggedIn, currentUserId } = this.state;

    return (
      <Router>
        <div className="App">
          <AppNavBar
            isLoggedIn={isLoggedIn}
            signoutHandler={this.signoutHandler}
          />
          <AppRoutes
            isLoggedIn={isLoggedIn}
            onInputChange={this.onInputChange}
            signupHandler={this.signupHandler}
            loginHandler={this.loginHandler}
            userId={currentUserId}
          />
        </div>
      </Router>
    );
  }
}

export default App;
