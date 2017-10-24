import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

import SignupForm from './SignupForm';
import { signinUser, resetAuth } from './../../actions/authActions';
import { validateEmpty, validateMatch } from './../../utils/validation';

class Signup extends Component {
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
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const repassword = document.getElementById('repassword').value.trim();

    const errors = validateEmpty([
      { name: 'username', value: username },
      { name: 'password', value: password },
      { name: 'email', value: email },
    ]);

    const errorMatch = validateMatch(password, repassword);
    errors['repassword'] = errorMatch;

    this.setState({ errors });

    if (!errors.username && !errors.email && !errors.password && !errors.repassword && repassword) {
      this.props.signinUser({ username, email, password }, this.props.history);
    }
  }

  handleChange(e) {
    const target = e.target.id;
    const errors = this.state.errors;

    delete errors[target];
    this.setState({ errors });
  }

  render() {
    const serverErrors = this.props.error.message ? this.props.error.message.errors : '';

    return (
      <Container>
        <Row className="justify-content-center">
          <Col sm={6}>
            <h1>Sign Up</h1>
            <hr/>

            <SignupForm
              handleSubmit={this.handleSubmit}
              handleChange={this.handleChange}
              errors={serverErrors || this.state.errors} />
          </Col>
        </Row>
      </Container>
    );
  }
}

Signup.propTypes = {
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  signinUser: PropTypes.func.isRequired,
  resetAuth: PropTypes.func.isRequired
};

function mapStateToProps({ auth }) {
  return {
    error: auth.error
  }
}

export default connect(mapStateToProps, { signinUser, resetAuth })(Signup);
