import React from "react";
import { Route, Redirect } from "react-router-dom";

import HomePage from "../HomePage";
import SignupPage from "../auth/SignupPage";
import LoginPage from "../auth/LoginPage";
import AdminLandingPage from "../protected/admin/AdminLandingPage";
import UserLandingPage from "../protected/user/UserLandingPage";

const AppRoutes = ({
  isLoggedIn,
  signupHandler,
  loginHandler,
  onInputChange,
  onCheckStateChange,
  userId,
  openSnackbar,
  isAdminLoggedIn,
  accountType,
  accountBalance
}) => {
  function renderAuthPage(AuthPage, authHandler) {
    return function(props) {
      if (!(isLoggedIn || isAdminLoggedIn)) {
        return (
          <AuthPage
            {...props}
            onSubmit={authHandler}
            onInputChange={onInputChange}
            onCheckStateChange={onCheckStateChange}
          />
        );
      } else {
        if (isLoggedIn) {
          return <Redirect to="/user" />;
        }

        if (isAdminLoggedIn) {
          return <Redirect to="/admin" />;
        }
      }
    };
  }

  return (
    <React.Fragment>
      <Route path="/" exact component={HomePage} />

      <Route
        path="/auth/register"
        render={renderAuthPage(SignupPage, signupHandler)}
      />

      <Route
        path="/auth/login"
        render={renderAuthPage(LoginPage, loginHandler)}
      />

      <Route
        path="/admin"
        exact
        render={props =>
          isAdminLoggedIn ? (
            <AdminLandingPage
              userId={userId}
              openSnackbar={openSnackbar}
              {...props}
            />
          ) : (
            <Redirect to="/login" />
          )
        }
      />

      <Route
        path="/user"
        render={props =>
          isLoggedIn ? (
            <UserLandingPage
              userId={userId}
              openSnackbar={openSnackbar}
              {...props}
              accountType={accountType}
              accountBalance={accountBalance}
            />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    </React.Fragment>
  );
};

export default AppRoutes;
