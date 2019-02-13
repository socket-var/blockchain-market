import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

// import components
import AppNavBar from "./common/AppNavBar";
import AppRoutes from "./common/AppRoutes";
import { AuthProvider, AuthConsumer } from "./common/AuthProvider";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AuthConsumer>
          {({
            isLoggedIn,
            currentUserId,
            signupHandler,
            loginHandler,
            signoutHandler,
            onInputChange
          }) => {
            return (
              <div className="App">
                <AppNavBar
                  isLoggedIn={isLoggedIn}
                  signoutHandler={signoutHandler}
                  userId={currentUserId}
                />
                <AppRoutes
                  isLoggedIn={isLoggedIn}
                  onInputChange={onInputChange}
                  signupHandler={signupHandler}
                  loginHandler={loginHandler}
                  userId={currentUserId}
                />
              </div>
            );
          }}
        </AuthConsumer>
      </AuthProvider>
    </Router>
  );
};

export default App;
