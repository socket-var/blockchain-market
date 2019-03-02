import React from "react";
import PropTypes from "prop-types";
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
    addToCart,
    buyProduct,
    removeFromCart,
    removeProductFromSale
  } = props;
  const cards = [];
  if (products.length > 0) {
    products.forEach((item, idx) => {
      const imageUrl =
        item.image.length > 0 ? item.image[0] : "/placeholder.png";
      const productId = item._id;
      const productName = item.product_name;
      const retailPrice = item.retail_price;
      const numUnits = item.numUnits;
      cards.push(
        <ProductCard
          key={idx}
          productIdx={idx}
          buttonId={productId}
          imageUrl={imageUrl}
          productName={productName}
          retailPrice={retailPrice}
          numUnits={numUnits}
          addToCart={addToCart || null}
          buyProduct={buyProduct || null}
          removeFromCart={removeFromCart || null}
          removeProductFromSale={removeProductFromSale}
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
  addToCart: PropTypes.func,
  buyProduct: PropTypes.func
};

export default withStyles(styles)(ProductList);
