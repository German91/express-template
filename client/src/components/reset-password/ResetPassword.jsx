import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Alert } from 'reactstrap';
import { connect } from 'react-redux';

import { validateEmpty, validateMatch } from './../../utils/validation';
import { resetAuth, resetPassword } from './../../actions/authActions';
import ResetPasswordForm from './ResetPasswordForm';

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: {}, token: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const token = this.props.match.params.token;

    this.setState({ token });
  }

  componentWillUnmount() {
    this.props.resetAuth();
  }

  handleSubmit(e) {
    e.preventDefault();

    const password = document.getElementById('password').value.trim();
    const repassword = document.getElementById('repassword').value.trim();

    const errors = validateEmpty([
      { name: 'password', value: password },
    ]);

    const errorMatch = validateMatch(password, repassword);
    errors['repassword'] = errorMatch;

    this.setState({ errors });

    if (!errors.password && repassword) {
      this.props.resetPassword(password, this.state.token);
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
    const message = this.props.message;

    if (message) {
      return (
        <Alert color="success">{message}</Alert>
      );
    } else if (error) {
      return (
        <Alert color="danger">{error.message || error}</Alert>
      );
    }
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col sm={6}>
            <h1>Reset your password</h1>
            <hr/>
            {this.renderAlert()}

            {!this.props.message ?
              <ResetPasswordForm
                errors={this.state.errors}
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange} />
            : ''}
          </Col>
        </Row>
      </Container>
    );
  }
};

ResetPassword.propTypes = {
  resetAuth: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  error: PropTypes.string,
  message: PropTypes.string
};

function mapStateToProps({ auth }) {
  return {
    error: auth.error,
    message: auth.message
  }
}

export default connect(mapStateToProps, { resetAuth, resetPassword })(ResetPassword);
