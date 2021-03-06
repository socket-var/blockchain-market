import React, { Component } from "react";
import PropTypes from "prop-types";

import ProductList from "../components/ProductList";

export default class CartPage extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    products: PropTypes.array.isRequired,
    getData: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { getData, userId } = this.props;

    getData(`/api/user/${userId}/cart`);
  }

  render() {
    const { products, buyProduct, removeFromCart } = this.props;
    return (
      <div>
        <ProductList
          products={products}
          buyProduct={buyProduct}
          removeFromCart={removeFromCart}
        />
      </div>
    );
  }
}

// add to cart
// when buy is clicked
// fake authentication is done and
// number of products available is decremented
// add product to buyer's object
