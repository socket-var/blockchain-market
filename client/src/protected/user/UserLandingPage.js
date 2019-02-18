import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import axios from "axios";
import ajaxErrorHandler from "../../common/functions/ajaxErrorHandler";
// user routes

import SellPage from "./SellPage";
import CartPage from "./CartPage";
import BuyPage from "./BuyPage";

export default class UserLandingPage extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    openSnackbar: PropTypes.func.isRequired
  };

  state = {
    products: [],
    productNameField: "",
    retailPriceField: "",
    numUnitsField: ""
  };

  catchFunction = err => {
    let message = ajaxErrorHandler(err);
    this.props.openSnackbar(message);
  };

  getData = apiUrl => {
    axios
      .get(apiUrl)
      .then(res => {
        this.setState({ products: res.data.products });
      })
      .catch(this.catchFunction);
  };

  addProductForSale = evt => {
    const {
      productNameField,
      retailPriceField,
      numUnitsField,
      products
    } = this.state;
    const { userId } = this.props;

    evt.preventDefault();
    // refactor this api call to
    axios
      .post(`/api/products/${userId}/addProductForSale`, {
        productName: productNameField,
        retailPrice: retailPriceField,
        createdBy: userId,
        numUnits: numUnitsField
      })
      .then(res => {
        this.props.openSnackbar(res.data.message);
        this.setState({ products: [res.data.product, ...products] });
      })
      .catch(this.catchFunction);
  };

  removeProductFromSale = evt => {
    const productId = evt.target.id;
    const idx = evt.target.dataset.key;

    const { userId } = this.props;

    evt.preventDefault();
    // refactor this api call to
    axios
      .post(`/api/products/${userId}/removeProductFromSale`, {
        productId
      })
      .then(res => {
        console.debug(res.data);
        this.props.openSnackbar(res.data.message);
        this.setState(function(prevState) {
          const products = prevState.products;
          products.splice(idx, 1);
          return {
            products
          };
        });
      })
      .catch(this.catchFunction);
  };

  addToCart = evt => {
    const productId = evt.target.id;
    axios
      .post(`/api/user/${this.props.userId}/cart/add`, {
        productId
      })
      .then(res => {
        this.props.openSnackbar(res.data.message);
      })
      .catch(this.catchFunction);
  };

  buyProduct = evt => {
    const productId = evt.target.id;
    const idx = evt.target.dataset.key;

    axios
      .post(`/api/user/${this.props.userId}/buy`, {
        productId
      })
      .then(res => {
        console.debug(res.data);
        // decrement numUnits by 1 make sure to do this
        this.props.openSnackbar(res.data.message);
        console.debug("Buy success");
        this.setState(function(prevState) {
          const products = prevState.products;
          products[idx] = res.data.product;
          return {
            products
          };
        });
      })
      .catch(this.catchFunction);
  };

  removeFromCart = evt => {
    const productId = evt.target.id;
    const idx = evt.target.dataset.key;

    axios
      .post(`/api/user/${this.props.userId}/cart/remove`, {
        productId
      })
      .then(res => {
        this.props.openSnackbar(res.data.message);

        this.setState(function(prevState) {
          const products = prevState.products;
          products.splice(idx, 1);
          return {
            products
          };
        });

        console.debug(res.data, "Removed from cart");
      })
      .catch(this.catchFunction);
  };

  onInputChange = evt => {
    this.setState({
      [evt.target.id]: evt.target.value
    });
  };

  render() {
    const { match, userId } = this.props;

    const { products } = this.state;

    return (
      <Switch>
        <Route
          path={[`${match.path}`, `${match.path}/buy`]}
          exact
          render={props => (
            <BuyPage
              {...props}
              products={products}
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
              getData={this.getData}
              onInputChange={this.onInputChange}
              addProductForSale={this.addProductForSale}
              removeProductFromSale={this.removeProductFromSale}
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
              getData={this.getData}
              buyProduct={this.buyProduct}
              removeFromCart={this.removeFromCart}
            />
          )}
        />
      </Switch>
    );
  }
}
