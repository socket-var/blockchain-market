import React, { Component } from "react";
import PropTypes from "prop-types";
import ProductList from "./ProductList";

export default class BuyPage extends Component {
  static propTypes = {};

  componentDidMount() {
    this.props.getData("/api/catalog");
  }

  // advanced: we will use componentWillReceiveProps or CDU to fetch data if count locally and globally doesn't match

  render() {
    const { products, errorMessage } = this.props;

    return (
      <div>
        <ProductList products={products} errorMessage={errorMessage} />
      </div>
    );
  }
}
