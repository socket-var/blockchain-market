import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

// user routes
import { AuthConsumer } from "../common/AuthProvider";
import BuyPage from "../protected/BuyPage";
import SellPage from "../protected/SellPage";
import CartPage from "../protected/CartPage";

const UserLandingPage = props => {
  const { match } = props;
  return (
    <AuthConsumer>
      {({ currentUserId }) => {
        return (
          <React.Fragment>
            <Route
              path={[`${match.path}`, `${match.path}/buy`]}
              exact
              component={BuyPage}
            />
            <Route
              path={`${match.path}/sell`}
              exact
              render={props => <SellPage {...props} userId={currentUserId} />}
            />
            <Route path={`${match.path}/cart`} exact component={CartPage} />
          </React.Fragment>
        );
      }}
    </AuthConsumer>
  );
};

UserLandingPage.propTypes = {};

export default UserLandingPage;
