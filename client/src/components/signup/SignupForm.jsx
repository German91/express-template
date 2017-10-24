import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';

const SignupForm = ({ handleChange, handleSubmit, errors }) => (
  <Form onSubmit={handleSubmit}>
    <FormGroup color={errors.username ? 'danger' : ''}>
      <Label for="username">Username</Label>
      <Input type="text" id="username" placeholder="Username" onChange={handleChange} />
      {errors.username ? <FormFeedback>{errors.username.message}</FormFeedback> : ''}
    </FormGroup>

    <FormGroup color={errors.email ? 'danger' : ''}>
      <Label for="email">Email Address</Label>
      <Input type="email" id="email" placeholder="Email Address" onChange={handleChange} />
      {errors.email ? <FormFeedback>{errors.email.message}</FormFeedback> : ''}
    </FormGroup>

    <FormGroup color={errors.password ? 'danger' : ''}>
      <Label for="password">Password</Label>
      <Input type="password" id="password" placeholder="Password" onChange={handleChange} />
      {errors.password ? <FormFeedback>{errors.password.message}</FormFeedback> : ''}
    </FormGroup>

    <FormGroup color={errors.repassword ? 'danger' : ''}>
      <Label for="repassword">Confirm Password</Label>
      <Input type="password" id="repassword" placeholder="Confirm Password" onChange={handleChange} />
      {errors.repassword ? <FormFeedback>{errors.repassword.message}</FormFeedback> : ''}
    </FormGroup>

    <Button
      color="success"
      type="submit"
      disabled={
        errors.username ||
        errors.password ||
        errors.email ||
        errors.repassword ? true : false}>Sign Up</Button>
  </Form>
);

SignupForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default SignupForm;
