import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import UserList from "./UserList";

export default class AdminLandingPage extends Component {
  static propTypes = {};

  state = { users: [] };

  removeUser = evt => {
    const { userId } = this.props;

    const userIdToRemove = evt.target.id;
    const userIdx = evt.target.dataset.key;

    console.debug(userIdToRemove, userIdx);

    axios
      .delete(`/api/${userId}/admin/remove_user/${userIdToRemove}`)
      .then(res => {
        console.debug("User has been removed");
        this.props.openSnackbar("User has been removed");
        this.setState(function(prevState) {
          const users = Object.assign([], prevState.users);
          users.splice(userIdx, 1);

          return {
            users
          };
        });
      })
      .catch(err => {
        this.setState({
          errorMessage: "Cannot retrieve products right now!!"
        });
      });
  };

  listAllUsers = apiUrl => {
    axios
      .get(apiUrl)
      .then(res => {
        this.setState({ users: res.data.users });
      })
      .catch(err => {
        this.setState({
          errorMessage: "Cannot retrieve products right now!!"
        });
      });
  };

  componentDidMount() {
    this.listAllUsers(`/api/${this.props.userId}/admin/list_users`);
  }

  render() {
    return (
      <div>
        <UserList users={this.state.users} deleteFunction={this.removeUser} />
      </div>
    );
  }
}
