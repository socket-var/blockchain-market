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
                    currentUserId,
                    signupHandler,
                    loginHandler,
                    signoutHandler,
                    onInputChange,
                    isAdminLoggedIn
                  }) => {
                    return (
                      <div className="App">
                        <AppNavBar
                          isLoggedIn={isLoggedIn}
                          isAdminLoggedIn={isAdminLoggedIn}
                          signoutHandler={signoutHandler}
                          userId={currentUserId}
                        />
                        <AppRoutes
                          isLoggedIn={isLoggedIn}
                          isAdminLoggedIn={isAdminLoggedIn}
                          onInputChange={onInputChange}
                          signupHandler={signupHandler}
                          loginHandler={loginHandler}
                          userId={currentUserId}
                          openSnackbar={openSnackbar}
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
