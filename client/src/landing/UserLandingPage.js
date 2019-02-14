import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import axios from "axios";

// user routes

import SellPage from "../protected/SellPage";
import CartPage from "../protected/CartPage";
import BuyPage from "../protected/BuyPage";

export default class UserLandingPage extends Component {
  static propTypes = {};

  state = {
    products: [],
    errorMessage: null,
    productNameField: "",
    retailPriceField: ""
  };

  getData = apiUrl => {
    axios
      .get(apiUrl)
      .then(res => {
        this.setState({ products: res.data.products });
      })
      .catch(err => {
        this.setState({
          errorMessage: "Cannot retrieve products right now!!"
        });
      });
  };

  // componentDidUpdate(prevProps) {
  //   const { userId } = this.props;
  //   const currentPath = this.props.location.pathname;

  //   if (prevProps.location.pathname !== currentPath) {
  //     const key = currentPath.split("/")[currentPath.length - 1];
  //     switch (key) {
  //       case "buy":
  //         this.getData("/api/catalog");
  //         break;
  //       case "sell":
  //         this.getData(`/api/userPosts/${userId}`);
  //         break;
  //       default:
  //     }
  //   }
  // }

  addProduct = evt => {
    const { productNameField, retailPriceField, products } = this.state;
    const { userId } = this.props;

    evt.preventDefault();
    axios
      .post("/api/addProduct", {
        productName: productNameField,
        retailPrice: retailPriceField,
        createdBy: userId
      })
      .then(res => {
        console.debug(res.data);
        this.setState({ products: [res.data.product, ...products] });
      });
  };

  onInputChange = evt => {
    this.setState({
      [evt.target.id]: evt.target.value
    });
  };

  render() {
    const { match, userId } = this.props;

    const { products, errorMessage } = this.state;

    return (
      <Switch>
        <Route
          path={[`${match.path}`, `${match.path}/buy`]}
          exact
          render={props => (
            <BuyPage
              {...props}
              products={products}
              errorMessage={errorMessage}
              getData={this.getData}
            />
          )}
        />
        <Route
          path={`${match.path}/sell`}
          exact
          render={props => (
            <SellPage
              {...props}
              userId={userId}
              products={products}
              errorMessage={errorMessage}
              getData={this.getData}
              onInputChange={this.onInputChange}
              addProduct={this.addProduct}
            />
          )}
        />
        <Route path={`${match.path}/cart`} exact component={CartPage} />
      </Switch>
    );
  }
}
