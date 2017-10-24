import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import { connect } from 'react-redux';

import { logoutUser } from './../actions/authActions';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };

    this.toggle = this.toggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.logoutUser();
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  renderLinks() {
    const isAuthenticated = this.props.authenticated;
    const profile = this.props.profile;

    if (!isAuthenticated) {
      return [
        <NavItem key={1}><NavLink tag={Link} to="/">Login</NavLink></NavItem>,
        <NavItem key={2}><NavLink tag={Link} to="/signup">Sign up</NavLink></NavItem>
      ]
    } else if (isAuthenticated && profile) {
      let routes = [];

      const publicRoutes = [
        <NavItem key={3}><NavLink tag={Link} to="/profile">{profile.username}</NavLink></NavItem>,
        <NavItem key={3.1}><NavLink role="button" onClick={this.handleLogout}>Logout</NavLink></NavItem>,
      ];

      if (profile.is_admin) {
        const adminRoutes = [
          <NavItem key={4}><NavLink tag={Link} to="/">Admin Panel</NavLink></NavItem>,
        ];

        routes = _.concat(routes, adminRoutes)
      }

      return _.concat(routes, publicRoutes);
    }
  }

  render() {
    const rootUrl = this.props.authenticated ? '/dashboard' : '/';

    return (
      <header>
        <Navbar color="faded" light toggleable>
          <NavbarToggler onClick={this.toggle} right />
          <NavbarBrand tag={Link} to={rootUrl}>React APP</NavbarBrand>

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {this.renderLinks()}
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}

Header.propTypes = {
  profile: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  authenticated: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func.isRequired
};

function mapStateToProps({ auth }) {
  return {
    profile: auth.data,
    authenticated: auth.authenticated
  }
}

export default connect(mapStateToProps, { logoutUser })(Header);
