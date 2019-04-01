import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import ProductCard from "./ProductCard";
import BuyProductForm from "../components/BuyProductForm";

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
    removeProductFromSale,
    isBuyConfirmOpen,
    openBuyConfirm,
    closeBuyConfirm,
    selectedProduct,
    onInputChange
  } = props;
  const cards = [];
  if (products.length > 0) {
    products.forEach((item, idx) => {
      const imageUrl =
        item.image.length > 0 ? item.image[0] : "/placeholder.png";
      const productId = item._id;
      const productName = item.productName;
      const retailPrice = item.retailPrice;
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
          openBuyConfirm={openBuyConfirm || null}
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
        <React.Fragment>
          <BuyProductForm
            isBuyConfirmOpen={isBuyConfirmOpen}
            buyProduct={buyProduct}
            closeBuyConfirm={closeBuyConfirm}
            selectedProduct={selectedProduct || ""}
            onSubmit={buyProduct}
            onInputChange={onInputChange}
          />
          <div className={classes.root}>{cards}</div>
        </React.Fragment>
      )}
    </div>
  );
};

ProductList.propTypes = {
  addToCart: PropTypes.func,
  buyProduct: PropTypes.func
};

export default withStyles(styles)(ProductList);
