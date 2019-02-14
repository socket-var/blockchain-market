import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";

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
      isCart,
      addToCart
    } = this.props;

    let displayAddToCart;
    if (!isCart) {
      displayAddToCart = (
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
          {displayAddToCart}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            id={buttonId}
          >
            Buy
          </Button>
        </CardContent>
      </Card>
    );
  }
}

ProductCard.propTypes = {
  classes: PropTypes.object.isRequired,
  isCart: PropTypes.bool,
  addToCart: PropTypes.func
};

export default withStyles(styles)(ProductCard);
