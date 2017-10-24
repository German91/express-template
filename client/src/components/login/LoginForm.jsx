import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';

const LoginForm = ({ handleChange, handleSubmit, errors }) => (
  <Form onSubmit={handleSubmit}>
    <FormGroup color={errors.username ? 'danger' : ''}>
      <Label for="username">Username</Label>
      <Input type="text" id="username" placeholder="Email Address" onChange={handleChange} />
      {errors.username ? <FormFeedback>{errors.username.message}</FormFeedback> : ''}
    </FormGroup>

    <FormGroup color={errors.password ? 'danger' : ''}>
      <Label for="password">Password</Label>
      <Input type="password" id="password" placeholder="Password" onChange={handleChange} />
      {errors.password ? <FormFeedback>{errors.password.message}</FormFeedback> : ''}
    </FormGroup>

    <Button color="success" type="submit" disabled={errors.username || errors.password ? true : false}>Login</Button>
  </Form>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default LoginForm;
