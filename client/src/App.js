import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

// import components
import AppNavBar from "./common/AppNavBar";
import AppRoutes from "./common/AppRoutes";
import { AuthProvider, AuthConsumer } from "./common/AuthProvider";
import {
  SharedSnackbarProvider,
  SharedSnackbarConsumer
} from "./common/SharedSnackBarProvider";

const App = () => {
  return (
    <Router>
      <SharedSnackbarProvider>
        <SharedSnackbarConsumer>
          {({ openSnackbar }) => {
            return (
              <AuthProvider openSnackbar={openSnackbar}>
                <AuthConsumer>
                  {({
                    isLoggedIn,
                    accountType,
                    accountBalance,
                    currentUserId,
                    signupHandler,
                    loginHandler,
                    signoutHandler,
                    onInputChange,
                    onCheckStateChange,
                    isAdminLoggedIn
                  }) => {
                    return (
                      <div className="App">
                        <AppNavBar
                          isLoggedIn={isLoggedIn}
                          isAdminLoggedIn={isAdminLoggedIn}
                          signoutHandler={signoutHandler}
                          userId={currentUserId}
                          accountType={accountType}
                        />
                        <AppRoutes
                          isLoggedIn={isLoggedIn}
                          accountBalance={accountBalance}
                          isAdminLoggedIn={isAdminLoggedIn}
                          onInputChange={onInputChange}
                          onCheckStateChange={onCheckStateChange}
                          signupHandler={signupHandler}
                          loginHandler={loginHandler}
                          userId={currentUserId}
                          openSnackbar={openSnackbar}
                          accountType={accountType}
                        />
                      </div>
                    );
                  }}
                </AuthConsumer>
              </AuthProvider>
            );
          }}
        </SharedSnackbarConsumer>
      </SharedSnackbarProvider>
    </Router>
  );
};

export default App;
