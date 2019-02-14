import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

const ProductList = props => {
  const { products, errorMessage } = props;
  const cards = [];
  if (products.length > 0) {
    products.forEach(item => {
      cards.push(<li>{item.product_name}</li>);
    });
  }

  return (
    <div>{errorMessage ? <div>{errorMessage}</div> : <ul>{cards}</ul>}</div>
  );
};

ProductList.propTypes = {};

export default ProductList;
