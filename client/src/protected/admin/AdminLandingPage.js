import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import CustomList from "../components/CustomList";
import ajaxErrorHandler from "../../common/functions/ajaxErrorHandler";

export default class AdminLandingPage extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    openSnackbar: PropTypes.func.isRequired
  };

  state = { users: [] };

  catchFunction = err => {
    let message = ajaxErrorHandler(err);
    this.props.openSnackbar({ message });
  };

  removeUser = async evt => {
    const { userId } = this.props;

    const userIdToRemove = evt.target.id;
    const userIdx = evt.target.dataset.key;

    console.debug(userIdToRemove, userIdx);

    try {
      const deleteResult = await axios.delete(
        `/api/admin/${userId}/remove_user/${userIdToRemove}`
      );

      this.props.openSnackbar(deleteResult.data.message);
      this.setState(function(prevState) {
        const users = Object.assign([], prevState.users);
        users.splice(userIdx, 1);
        return {
          users
        };
      });
    } catch (err) {
      this.catchFunction(err);
    }
  };

  listAllUsers = async apiUrl => {
    try {
      const listOfUsers = await axios.get(apiUrl);
      this.setState({ users: listOfUsers.data.users });
    } catch (err) {
      this.catchFunction(err);
    }
  };

  componentDidMount() {
    this.listAllUsers(`/api/admin/${this.props.userId}/list_users`);
  }

  render() {
    return (
      <div>
        <CustomList
          data={this.state.users}
          onClickFunction={this.removeUser}
          placeholder={"No registered users yet"}
        />
      </div>
    );
  }
}
