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
        this.props.openSnackbar("New Product Added");
        this.setState({ products: [res.data.product, ...products] });
      })
      .catch(err => {
        console.debug(err);
      });
  };

  addToCart = evt => {
    const productId = evt.target.id;
    axios
      .post(`/api/${this.props.userId}/cart/add`, {
        productId
      })
      .then(res => {
        this.props.openSnackbar("Added item to cart");
        console.debug(res.data, "Added to cart");
      })
      .catch(err => {
        console.debug(err);
      });
  };

  buyProduct = evt => {
    const productId = evt.target.id;
    const idx = evt.target.dataset.key;

    axios
      .post(`/api/${this.props.userId}/buy`, {
        productId
      })
      .then(res => {
        console.debug(res.data);
        // decrement numUnits by 1 make sure to do this
        this.props.openSnackbar("Congratulations!! You bought the product!!");
        console.debug("Buy success");
        this.setState(function(prevState) {
          const products = prevState.products;
          products[idx] = res.data.product;
          return {
            products
          };
        });
      })
      .catch(err => {
        console.debug(err);
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
              addToCart={this.addToCart}
              buyProduct={this.buyProduct}
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
        <Route
          path={`${match.path}/cart`}
          exact
          render={props => (
            <CartPage
              {...props}
              userId={userId}
              products={products}
              errorMessage={errorMessage}
              getData={this.getData}
            />
          )}
        />
      </Switch>
    );
  }
}
