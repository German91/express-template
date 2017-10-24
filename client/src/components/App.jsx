import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetchProfile } from './../actions/authActions';
import Header from './Header';
import Login from './login/Login';
import Signup from './signup/Signup';
import RequireUser from './auth/RequireUser';
import ForgotPassword from './forgot-password/ForgotPassword';
import ResetPassword from './reset-password/ResetPassword';
import Profile from './profile/Profile';

const Dashboard = () => (
  <h1>Dashboard Page</h1>
);

class App extends Component {
  componentDidMount() {
    if (this.props.authenticated) {
      this.props.fetchProfile();
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password/:token" component={ResetPassword} />

            <Route path="/dashboard" component={RequireUser(Dashboard)} />
            <Route path="/profile" component={RequireUser(Profile)} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

function mapStateToProps({ auth }) {
  return {
    authenticated: auth.authenticated
  }
}

export default connect(mapStateToProps, { fetchProfile })(App);
