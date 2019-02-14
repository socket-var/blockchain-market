import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import ProductList from "./ProductList";
import AddProductForm from "./AddProductForm";

// sell page should have 2 areas
// form to submit new items
// area to display all items in descending order

export default class SellPage extends Component {
  static propTypes = {};
  state = {};

  componentDidMount() {
    const { getData, userId } = this.props;

    getData(`/api/userPosts/${userId}`);
  }

  render() {
    const { products, errorMessage, addProduct, onInputChange } = this.props;
    return (
      <div>
        <AddProductForm onInputChange={onInputChange} onSubmit={addProduct} />
        <ProductList products={products} errorMessage={errorMessage} />
      </div>
    );
  }
}
