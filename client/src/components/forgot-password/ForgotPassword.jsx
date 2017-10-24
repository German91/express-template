import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col, Alert } from 'reactstrap';

import { validateEmpty } from './../../utils/validation';
import ForgotPasswordForm from './ForgotPasswordForm';
import { forgotPassword, resetAuth } from './../../actions/authActions';

class ForgotPassword extends Component {
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

    const email = document.getElementById('email').value.trim();

    const errors = validateEmpty([
      { name: 'email', value: email }
    ]);

    this.setState({ errors });

    if (!errors.email) {
      this.props.forgotPassword({ email });
    }
  }

  handleChange(e) {
    const target = e.target.id;
    const errors = this.state.errors;

    delete errors[target];
    this.setState({ errors });
  }

  renderAlert() {
    const message = this.props.message;
    const error = this.props.error;

    if (message) {
      return (
        <Alert color="success">{message}</Alert>
      );
    } else if (error) {
      return (
        <Alert color="danger">{error}</Alert>
      );
    }
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col sm={6}>
            <h1>Recover your password</h1>
            <hr/>
            {this.renderAlert()}

            {!this.props.message ?
              <ForgotPasswordForm
                errors={this.state.errors}
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange} />
            : ''}
          </Col>
        </Row>
      </Container>
    );
  }
}

ForgotPassword.propTypes = {
  error: PropTypes.string,
  message: PropTypes.string,
  forgotPassword: PropTypes.func.isRequired,
  resetAuth: PropTypes.func.isRequired
};

function mapStateToProps({ auth }) {
  return {
    error: auth.error,
    message: auth.message
  }
}

export default connect(mapStateToProps, { forgotPassword, resetAuth })(ForgotPassword);
