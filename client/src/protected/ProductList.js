import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import withStyles from "@material-ui/core/styles/withStyles";

import ProductCard from "./ProductCard";

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start"
  }
};

const ProductList = props => {
  const {
    products,
    errorMessage,
    classes,
    isCart,
    addToCart,
    buyProduct
  } = props;
  const cards = [];
  if (products.length > 0) {
    products.forEach((item, idx) => {
      console.debug(item._id);
      const imageUrl = item.image[0];
      const productId = item._id;
      const productName = item.product_name;
      const retailPrice = item.retail_price;
      cards.push(
        <ProductCard
          key={idx}
          productIdx={idx}
          buttonId={productId}
          imageUrl={imageUrl}
          productName={productName}
          retailPrice={retailPrice}
          isCart={isCart}
          addToCart={isCart ? null : addToCart}
          buyProduct={buyProduct}
        />
      );
    });
  }

  return (
    <div>
      {errorMessage ? (
        <div>{errorMessage}</div>
      ) : (
        <div className={classes.root}>{cards}</div>
      )}
    </div>
  );
};

ProductList.propTypes = {
  isCart: PropTypes.bool,
  addToCart: PropTypes.func,
  buyProduct: PropTypes.func
};

export default withStyles(styles)(ProductList);
