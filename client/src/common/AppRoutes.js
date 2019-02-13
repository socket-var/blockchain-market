import React from "react";
import { Route, Redirect } from "react-router-dom";

import HomePage from "../HomePage";
import SignupPage from "../auth/SignupPage";
import LoginPage from "../auth/LoginPage";
import ProductsPage from "../ProductsPage";
import AdminLandingPage from "../landing/AdminLandingPage";
import UserLandingPage from "../landing/UserLandingPage";

const AppRoutes = ({
  isLoggedIn,
  signupHandler,
  loginHandler,
  onInputChange,
  userId
}) => {
  return (
    <React.Fragment>
      <Route path="/" exact component={HomePage} />
      <Route
        path="/auth/register"
        render={props =>
          isLoggedIn ? (
            <Redirect to={`/user/${userId}`} />
          ) : (
            <SignupPage
              {...props}
              onSubmit={signupHandler}
              onInputChange={onInputChange}
              // errorMessage={signupPageErrorMessage}
            />
          )
        }
      />
      <Route
        path="/auth/login"
        render={props =>
          isLoggedIn ? (
            <Redirect to={`/user/${userId}`} />
          ) : (
            <LoginPage
              {...props}
              onSubmit={loginHandler}
              onInputChange={onInputChange}
              // errorMessage={loginPageErrorMessage}
            />
          )
        }
      />

      {/* <Route
        path="/admin"
        render={props =>
          isLoggedIn ? <AdminLandingPage {...props} /> : <Redirect to="/" />
        }
      /> */}
      <Route
        path={`/user/${userId}`}
        render={props =>
          isLoggedIn ? <UserLandingPage {...props} /> : <Redirect to="/" />
        }
      />
    </React.Fragment>
  );
};

export default AppRoutes;
