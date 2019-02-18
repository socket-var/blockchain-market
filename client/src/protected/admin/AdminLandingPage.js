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

  removeUser = evt => {
    const { userId } = this.props;

    const userIdToRemove = evt.target.id;
    const userIdx = evt.target.dataset.key;

    console.debug(userIdToRemove, userIdx);

    axios
      .delete(`/api/admin/${userId}/remove_user/${userIdToRemove}`)
      .then(res => {
        this.props.openSnackbar(res.data.message);
        this.setState(function(prevState) {
          const users = Object.assign([], prevState.users);
          users.splice(userIdx, 1);

          return {
            users
          };
        });
      })
      .catch(this.catchFunction);
  };

  listAllUsers = apiUrl => {
    axios
      .get(apiUrl)
      .then(res => {
        this.setState({ users: res.data.users });
      })
      .catch(this.catchFunction);
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
