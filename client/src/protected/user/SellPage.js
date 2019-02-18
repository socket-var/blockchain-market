import React, { Component } from "react";
import PropTypes from "prop-types";

import ProductList from "../components/ProductList";
import AddProductForm from "../components/AddProductForm";

// sell page should have 2 areas
// form to submit new items
// area to display all items in descending order

export default class SellPage extends Component {
  static propTypes = {
    products: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    addProductForSale: PropTypes.func.isRequired,
    removeProductFromSale: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired
  };
  state = {};

  componentDidMount() {
    const { getData, userId } = this.props;

    getData(`/api/products/by/${userId}`);
  }

  render() {
    const {
      products,
      addProductForSale,
      removeProductFromSale,
      onInputChange
    } = this.props;
    return (
      <div>
        <AddProductForm
          onInputChange={onInputChange}
          onSubmit={addProductForSale}
        />
        <ProductList
          products={products}
          removeProductFromSale={removeProductFromSale}
        />
      </div>
    );
  }
}
