import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';

const ProfileForm = ({ handleSubmit, handleChange, errors, profile }) => (
  <Form onSubmit={handleSubmit}>
    <FormGroup color={errors.email ? 'danger' : ''}>
      <Label for="email">Email Address</Label>
      <Input type="email" id="email" placeholder="Email Address" onChange={handleChange} defaultValue={profile.email} />
      {errors.email ? <FormFeedback>{errors.email.message}</FormFeedback> : ''}
    </FormGroup>

    <FormGroup color={errors.username ? 'danger' : ''}>
      <Label for="username">Username</Label>
      <Input type="text" id="username" placeholder="Username" onChange={handleChange} defaultValue={profile.username} />
      {errors.username ? <FormFeedback>{errors.username.message}</FormFeedback> : ''}
    </FormGroup>

    <Button type="submit" color="success" disabled={errors.username || errors.email ? true : false}>Update</Button>
  </Form>
);

ProfileForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
  profile: PropTypes.object.isRequired
};

export default ProfileForm;
