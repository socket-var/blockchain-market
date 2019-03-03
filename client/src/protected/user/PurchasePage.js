import React, { Component } from "react";
import PropTypes from "prop-types";
import ProductList from "../components/ProductList";

export default class PurchasePage extends Component {
  static propTypes = {};

  componentDidMount() {
    const { getData, userId } = this.props;

    getData(`/api/user/${userId}/purchases`);
  }

  render() {
    const { products } = this.props;

    return (
      <div>
        <ProductList products={products} />
      </div>
    );
  }
}
