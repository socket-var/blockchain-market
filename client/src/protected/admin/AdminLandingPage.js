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

  state = {
    users: [],
    isAddDepositModalOpen: false,
    isAddTokensModalOpen: false,
    accountBalance: null,
    passwordField: null,
    rechargeAmountField: null,
    totalTokens: null,
    tokensRemaining: null,
    addTokensField: null
  };

  openDepositModal = listItem => () => {
    this.setState({
      isAddDepositModalOpen: true,
      accountBalance: listItem.accountBalance,
      selectedUser: listItem._id
    });
  };

  closeDepositModal = () => {
    this.setState({ isAddDepositModalOpen: false });
  };

  onInputChange = evt => {
    this.setState({
      [evt.target.id]: evt.target.value
    });
  };

  addDeposit = async evt => {
    evt.preventDefault();

    const { passwordField, rechargeAmountField } = this.state;
    try {
      const result = await axios.post(
        `/api/user/${this.state.selectedUser}/add_deposit`,
        {
          password: passwordField,
          rechargeAmount: rechargeAmountField,
          requestedBy: this.props.userId
        }
      );

      this.setState({
        accountBalance: result.data.accountBalance
      });
      this.props.openSnackbar(result.data.message);
    } catch (err) {
      this.catchFunction(err);
    }
  };

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

  openAddTokensModal = async () => {
    this.setState({ isAddTokensModalOpen: true });
  }

  closeAddTokensModal = async () => {
    this.setState({ isAddTokensModalOpen: false });
  }
  
  addTokens = async (evt) => {
    evt.preventDefault();

    try {
      const result = await axios.post(`/api/admin/${this.props.userId}/add_tokens`, {
        rechargeAmount: this.state.addTokensField
      });

      const { totalTokens, tokensRemaining, message } = result.data;

      this.setState({
        totalTokens,
        tokensRemaining
      });

      this.props.openSnackbar(message);

    } catch(err) {
      this.catchFunction(err);
    }

  }

  async getTokenStats(apiUrl) {
    try {
      const result = await axios.get(apiUrl);

      const { totalTokens, tokensRemaining } = result.data;

      this.setState({
        totalTokens,
        tokensRemaining
      });

    } catch(err) {
      this.catchFunction(err);
    }

    
  }


  componentDidMount() {
    this.listAllUsers(`/api/admin/${this.props.userId}/list_users`);
    this.getTokenStats(`/api/admin/${this.props.userId}/get_token_stats`);
  }

  render() {
    const { isAddDepositModalOpen, accountBalance, users, selectedUser, totalTokens, tokensRemaining, isAddTokensModalOpen } = this.state;
    return (
      <div>
        <CustomList
          data={users}
          removeUser={this.removeUser}
          isAddDepositModalOpen={isAddDepositModalOpen}
          placeholder={"No registered users yet"}
          openDepositModal={this.openDepositModal}
          closeDepositModal={this.closeDepositModal}
          accountBalance={accountBalance}
          onInputChange={this.onInputChange}
          addDeposit={this.addDeposit}
          userId={selectedUser}
          openAddTokensModal={this.openAddTokensModal}
          isAddTokensModalOpen={isAddTokensModalOpen}
          closeAddTokensModal={this.closeAddTokensModal}
          addTokens={this.addTokens}
          totalTokens={totalTokens}
          tokensRemaining={tokensRemaining}
          />
      </div>
    );
  }
}
