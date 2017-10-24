import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';

const ResetPasswordForm = ({ handleSubmit, handleChange, errors }) => (
  <Form onSubmit={handleSubmit}>
    <FormGroup color={errors.password ? 'danger' : ''}>
      <Label for="password">New Password</Label>
      <Input type="password" id="password" placeholder="New Password" onChange={handleChange} />
      {errors.password ? <FormFeedback>{errors.password.message}</FormFeedback> : ''}
    </FormGroup>

    <FormGroup color={errors.repassword ? 'danger' : ''}>
      <Label for="repassword">Confirm Password</Label>
      <Input type="password" id="repassword" placeholder="Confirm Password" onChange={handleChange} />
      {errors.repassword ? <FormFeedback>{errors.repassword.message}</FormFeedback> : ''}
    </FormGroup>

    <Button type="submit" color="success" disabled={errors.password || errors.repassword ? true : false}>Reset password</Button>
  </Form>
);

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default ResetPasswordForm;
