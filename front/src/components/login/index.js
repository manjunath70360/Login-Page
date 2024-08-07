import { Component } from 'react';
import TabRender from "../tab/index";
import './index.css';

const tabList = [{ tabName: "SIGNIN", tabId: 'login' }, { tabName: "SIGNUP", tabId: "create-account" }];

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    address: "",
    phoneNo: "",
    showSubmitError: false,
    errorMsg: '',
    activeTab: tabList[0].tabId
  }

  onChangeUsername = event => {
    this.setState({ username: event.target.value });
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value });
  }

  onChangeAddress = event => {
    this.setState({ address: event.target.value });
  }

  onChangePhoneNo = event => {
    this.setState({ phoneNo: event.target.value });
  }

  onSubmitSuccess = () => {
    const { history } = this.props;
    history.replace('/Home');
  }

  onSubmitFailure = errorMsg => {
    this.setState({ showSubmitError: true, errorMsg });
  }

  onChangeTab = (id) => {
    this.setState({ activeTab: id, showSubmitError: false, errorMsg: "" });
  }

  submitForm = async event => {
    event.preventDefault();
    const { username, password } = this.state;
    const userDetails = { username, password };

    const url = 'https://login-page-dljs.onrender.com/login';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails),
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      this.setState({ username: '', password: '' });
      if (data.statusCode === 400) {
        this.setState({ showSubmitError: true, errorMsg: data.text });
      } else if (data.statusCode === 200) {
        this.setState({ showSubmitError: true, errorMsg: data.text }, this.onSubmitSuccess);
      }
    } catch (error) {
      console.error('Error:', error);
      this.setState({ showSubmitError: true, errorMsg: 'Failed to connect to the server.' });
    }
  }

  createUserAccount = async () => {
    const { username, password, phoneNo, address } = this.state;
    if (username === "" || password === "" || phoneNo === "" || address === "") {
      alert("Enter All The Required Fields");
    } else {
      const userDetails = { username, password, phoneNo, address };
      const url = 'https://login-page-dljs.onrender.com/newuser';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails),
      };
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        this.setState({ username: '', password: '', phoneNo: '', address: '' });
        if (data.statusCode === 400) {
          this.setState({ showSubmitError: true, errorMsg: data.text });
        } else if (data.statusCode === 200) {
          this.setState({ showSubmitError: true, errorMsg: data.text });
        }
      } catch (error) {
        console.error('Error:', error);
        this.setState({ showSubmitError: true, errorMsg: 'Failed to connect to the server.' });
      }
    }
  }

  renderPasswordField = () => {
    const { password } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
          required
        />
      </>
    );
  }

  renderUsernameField = () => {
    const { username } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
          required
        />
      </>
    );
  }

  renderAddressField = () => {
    const { address } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="address">
          ADDRESS
        </label>
        <input
          type="text"
          id="address"
          className="username-input-field"
          value={address}
          onChange={this.onChangeAddress}
          placeholder="Address"
          required
        />
      </>
    );
  }

  renderPhoneNO = () => {
    const { phoneNo } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="phone">
          PHONE NUMBER
        </label>
        <input
          type="text"
          id="phone"
          className="username-input-field"
          value={phoneNo}
          onChange={this.onChangePhoneNo}
          placeholder="Phone"
          required
        />
      </>
    );
  }

  render() {
    const { showSubmitError, errorMsg, activeTab } = this.state;
    const activeLogin = activeTab === "login";

    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-img"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <ul className='tab-list'>
            {tabList.map(eachTab => (
              <TabRender details={eachTab} isActive={activeTab} key={eachTab.tabId} onChangeTab={this.onChangeTab} />
            ))}
          </ul>
          {activeLogin ? (
            <>
              <div className="input-container">{this.renderUsernameField()}</div>
              <div className="input-container">{this.renderPasswordField()}</div>
            </>
          ) : (
            <>
              <div className="input-container">{this.renderUsernameField()}</div>
              <div className="input-container">{this.renderPhoneNO()}</div>
              <div className="input-container">{this.renderAddressField()}</div>
              <div className="input-container">{this.renderPasswordField()}</div>
            </>
          )}
          {activeLogin ? (
            <button type="submit" className="login-button">
              Login
            </button>
          ) : (
            <button type="button" onClick={this.createUserAccount} className="login-button">
              Create Account
            </button>
          )}
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    );
  }
}

export default LoginForm;
