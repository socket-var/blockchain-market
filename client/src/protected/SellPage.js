import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export default class BuyPage extends Component {
  static propTypes = {};

  state = { items: [] };

  componentDidMount() {
    console.debug(this.props.userId);
    // axios.get("/api/catalog")
    //   .then(res => {
    //     console.debug(res.data);
    //     this.setState({items: res.data.products})
    //   })
    //   .catch(err => {
    //     console.debug(err);
    //   })
    this.setState({ items: [{ name: "foo", price: "bar" }] });
  }

  render() {
    // const { items } = this.state;
    // const cards = [];

    // // foreach (item in items) {
    // cards.push(<li>{items[0].name}</li>);
    // // }

    return <div>This is sell page</div>;
  }
}
