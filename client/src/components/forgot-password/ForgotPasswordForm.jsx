import React from 'react';
import PropTypes from 'prop-types';
import { Form, Label, Input, FormFeedback, FormGroup, Button } from 'reactstrap';

const ForgotPasswordForm = ({ handleSubmit, handleChange, errors }) => (
  <Form onSubmit={handleSubmit}>
    <FormGroup color={errors.email ? 'danger' : ''}>
      <Label for="email">Email Address:</Label>
      <Input type="email" id="email" placeholder="Email Address" onChange={handleChange} />
      {errors.email ? <FormFeedback>{errors.email.message}</FormFeedback> : ''}
    </FormGroup>

    <Button type="submit" color="success" disabled={errors.email ? true : false}>Recover Password</Button>
  </Form>
);

ForgotPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default ForgotPasswordForm;
