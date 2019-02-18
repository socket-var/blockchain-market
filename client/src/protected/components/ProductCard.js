import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  card: {
    flex: "0 0 30%",
    margin: "1% 1%"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class ProductCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const {
      classes,
      buttonId,
      productName,
      retailPrice,
      imageUrl,
      addToCart,
      buyProduct,
      productIdx,
      removeFromCart,
      removeProductFromSale
    } = this.props;

    let AddToCartButton, BuyButton, RemoveButton, RemoveFromSaleButton;

    if (addToCart) {
      AddToCartButton = (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          id={buttonId}
          onClick={addToCart}
        >
          Add to Cart
        </Button>
      );
    }

    if (buyProduct) {
      BuyButton = (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          id={buttonId}
          onClick={buyProduct}
          data-key={productIdx}
        >
          Buy
        </Button>
      );
    }

    if (removeFromCart) {
      RemoveButton = (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          id={buttonId}
          onClick={removeFromCart}
          data-key={productIdx}
        >
          Remove from cart
        </Button>
      );
    }

    if (removeProductFromSale) {
      RemoveButton = (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          id={buttonId}
          onClick={removeProductFromSale}
          data-key={productIdx}
        >
          Delete Product
        </Button>
      );
    }

    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={imageUrl}
          title={productName}
        />
        <CardContent>
          <Typography component="h4">
            <b>
              <u>{productName}</u>
            </b>
          </Typography>
          <Typography component="p">Retail Price: {retailPrice}</Typography>
          {AddToCartButton}
          {BuyButton}
          {RemoveButton}
          {RemoveFromSaleButton}
        </CardContent>
      </Card>
    );
  }
}

ProductCard.propTypes = {
  classes: PropTypes.object.isRequired,
  buttonId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  retailPrice: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  productIdx: PropTypes.number.isRequired,
  addToCart: PropTypes.func,
  buyProduct: PropTypes.func,
  removeFromCart: PropTypes.func,
  removeProductFromSale: PropTypes.func
};

export default withStyles(styles)(ProductCard);
