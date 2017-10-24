import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'reactstrap';
import { connect } from 'react-redux';

import { loginUser, resetAuth } from './../../actions/authActions';
import LoginForm from './LoginForm';
import { validateEmpty } from './../../utils/validation';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: {} };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillUnmount() {
    this.props.resetAuth();
  }

  handleSubmit(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const errors = validateEmpty([
      { name: 'username', value: username },
      { name: 'password', value: password },
    ]);

    this.setState({ errors });

    if (!errors.username && !errors.password) {
      this.props.loginUser({ username, password }, this.props.history);
    }
  }

  handleChange(e) {
    const target = e.target.id;
    const errors = this.state.errors;

    delete errors[target];
    this.setState({ errors });
  }

  renderAlert() {
    const error = this.props.error;

    if (error.message) {
      return (
        <Alert color="danger">{error.message}</Alert>
      );
    }
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col sm={6}>
            <h1>Login</h1>
            <hr/>
            {this.renderAlert()}

            <LoginForm
              errors={this.state.errors}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit} />

              <Link to="/forgot-password">Forgotten password?</Link>
          </Col>
        </Row>
      </Container>
    );
  }
}

Login.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  loginUser: PropTypes.func.isRequired,
  resetAuth: PropTypes.func.isRequired
};

function mapStateToProps({ auth }) {
  return {
    error: auth.error
  }
}

export default connect(mapStateToProps, { loginUser, resetAuth })(Login);
