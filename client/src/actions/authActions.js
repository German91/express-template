import axios from 'axios';
import { AUTH_SUCCESS, AUTH_FAILURE, AUTH_MESSAGE, RESET_AUTH, UNAUTH_USER, UPDATE_PROFILE } from './types';

export const loginUser = (payload, history) => dispatch => {
  axios.post('/api/v1/auth/login', payload).then((response) => {
    localStorage.setItem('token', response.headers['authorization']);
    dispatch({ type: AUTH_SUCCESS, payload: response.data.user });

    history.push('/dashboard');
  }).catch((e) => {
    dispatch({ type: AUTH_FAILURE, payload: e.response.data });
  });
};

export const signinUser = (payload, history) => dispatch => {
  axios.post('/api/v1/auth/signup', payload).then((response) => {
    localStorage.setItem('token', response.headers['authorization']);
    dispatch({ type: AUTH_SUCCESS, payload: response.data.user });

    history.push('/dashboard');
  }).catch((e) => {
    dispatch({ type: AUTH_FAILURE, payload: e.response.data });
  });
};

export const forgotPassword = (payload) => dispatch => {
  axios.post('/api/v1/auth/forgot-password', payload).then((response) => {
    dispatch({ type: AUTH_MESSAGE, payload: response.data.message });
  }).catch((e) => {
    dispatch({ type: AUTH_FAILURE, payload: e.response.data.message });
  });
};

export const resetPassword = (password, token) => dispatch => {
  axios.defaults.headers.common['x-token'] = token;
  axios.post('/api/v1/auth/reset-password', { password }).then((response) => {
    dispatch({ type: AUTH_MESSAGE, payload: response.data.message });
  }).catch((e) => {
    dispatch({ type: AUTH_FAILURE, payload: e.response.data.message });
  });
};

export const fetchProfile = () => dispatch => {
  axios.get('/api/v1/auth/profile').then((response) => {
    dispatch({ type: AUTH_SUCCESS, payload: response.data.user });
  });
};

export const updateProfile = (payload) => dispatch => {
  axios.patch('/api/v1/auth/profile', payload).then((response) => {
    dispatch({ type: UPDATE_PROFILE, payload: response.data });
  }).catch((e) => {
    dispatch({ type: AUTH_FAILURE, payload: e.response.data });
  });
};

export const logoutUser = () => dispatch => {
  axios.get('/api/v1/auth/logout').then((response) => {
    localStorage.removeItem('token');
    dispatch({ type: UNAUTH_USER });
  });
};

export const resetAuth = () => dispatch => {
  dispatch({ type: RESET_AUTH });
};
