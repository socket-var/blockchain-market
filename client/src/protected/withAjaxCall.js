import React from "react";
import axios from "axios";

function withAjaxCall(WrappedComponent, apiURL) {
  return class extends React.Component {
    state = { products: [], errorMessage: null };

    componentDidMount() {
      axios
        .get(apiURL)
        .then(res => {
          console.debug(res.data);
          this.setState({ products: res.data.products });
        })
        .catch(err => {
          console.debug(err);
          this.setState({
            errorMessage: "Cannot retrieve products right now!!"
          });
        });
    }

    render() {
      const { products, errorMessage } = this.state;
      return (
        <WrappedComponent
          products={products}
          errorMessage={errorMessage}
          {...this.props}
        />
      );
    }
  };
}

export default withAjaxCall;
