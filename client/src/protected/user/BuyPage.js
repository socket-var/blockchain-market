import React, { Component } from "react";
import PropTypes from "prop-types";
import ProductList from "../components/ProductList";

export default class BuyPage extends Component {
  static propTypes = {
    products: PropTypes.array.isRequired,
    addToCart: PropTypes.func.isRequired,
    buyProduct: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getData("/api/products/catalog");
  }

  // advanced: we will use componentWillReceiveProps or CDU to fetch data if count locally and globally doesn't match

  render() {
    const { products, addToCart, buyProduct } = this.props;

    return (
      <div>
        <ProductList
          products={products}
          addToCart={addToCart}
          buyProduct={buyProduct}
        />
      </div>
    );
  }
}
