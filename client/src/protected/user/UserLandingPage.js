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

  getData = async apiUrl => {
    try {
      const result = await axios.get(apiUrl);
      this.setState({ products: result.data.products });
    } catch (err) {
      this.catchFunction(err);
    }
  };

  addProductForSale = async evt => {
    const {
      productNameField,
      retailPriceField,
      numUnitsField,
      products
    } = this.state;
    const { userId } = this.props;

    evt.preventDefault();

    try {
      const result = await axios.post(
        `/api/products/${userId}/addProductForSale`,
        {
          productName: productNameField,
          retailPrice: retailPriceField,
          createdBy: userId,
          numUnits: numUnitsField
        }
      );
      this.props.openSnackbar(result.data.message);
      this.setState({ products: [result.data.product, ...products] });
    } catch (err) {
      this.catchFunction(err);
    }
  };

  removeProductFromSale = async evt => {
    const productId = evt.target.id;
    const idx = evt.target.dataset.key;

    const { userId } = this.props;

    evt.preventDefault();

    try {
      const result = await axios.post(
        `/api/products/${userId}/removeProductFromSale`,
        {
          productId
        }
      );
      this.props.openSnackbar(result.data.message);
      this.setState(function(prevState) {
        const products = prevState.products;
        products.splice(idx, 1);
        return {
          products
        };
      });
    } catch (err) {
      this.catchFunction(err);
    }
  };

  addToCart = async evt => {
    const productId = evt.target.id;

    try {
      const result = await axios.post(
        `/api/user/${this.props.userId}/cart/add`,
        {
          productId
        }
      );
      this.props.openSnackbar(result.data.message);
    } catch (err) {
      this.catchFunction(err);
    }
  };

  buyProduct = async evt => {
    const productId = evt.target.id;
    const idx = evt.target.dataset.key;

    try {
      const result = await axios.post(`/api/user/${this.props.userId}/buy`, {
        productId
      });
      this.props.openSnackbar(result.data.message);
      this.setState(function(prevState) {
        const products = prevState.products;
        products[idx] = result.data.product;
        return {
          products
        };
      });
    } catch (err) {
      this.catchFunction(err);
    }
  };

  removeFromCart = async evt => {
    const productId = evt.target.id;
    const idx = evt.target.dataset.key;

    try {
      const result = await axios.post(
        `/api/user/${this.props.userId}/cart/remove`,
        {
          productId
        }
      );
      this.props.openSnackbar(result.data.message);
      this.setState(function(prevState) {
        const products = prevState.products;
        products.splice(idx, 1);
        return {
          products
        };
      });
    } catch (err) {
      this.catchFunction(err);
    }
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
