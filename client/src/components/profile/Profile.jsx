import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';

import ProfileForm from './ProfileForm';
import { resetAuth, updateProfile } from './../../actions/authActions';
import { validateEmpty } from './../../utils/validation';

class Profile extends Component {
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
    const username = document.getElementById('username').value.trim();

    const errors = validateEmpty([
      { name: 'email', value: email },
      { name: 'username', value: username },
    ]);

    this.setState({ errors });

    if (!errors.email && !errors.username) {
      this.props.updateProfile({ email, username });
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
    const error = this.props.message;

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
    if (!this.props.profile) {
      return <Spinner name="pacman" />;
    }

    return (
      <Container>
        <Row className="justify-content-center">
          <Col sm={6}>
            <h1>Profile</h1>
            <hr/>
            {this.renderAlert()}

            <ProfileForm
              profile={this.props.profile}
              errors={this.state.errors}
              handleSubmit={this.handleSubmit}
              handleChange={this.handleChange} />
          </Col>
        </Row>
      </Container>
    );
  }
}

Profile.propTypes = {
  profile: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  resetAuth: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  message: PropTypes.string,
  error: PropTypes.string
};

function mapStateToProps({ auth }) {
  return {
    profile: auth.data,
    message: auth.message,
    error: auth.error,
  }
}

export default connect(mapStateToProps, { resetAuth, updateProfile })(Profile);
