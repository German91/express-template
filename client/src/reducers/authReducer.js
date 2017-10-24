import { AUTH_SUCCESS, AUTH_FAILURE, RESET_AUTH, AUTH_MESSAGE, UNAUTH_USER, UPDATE_PROFILE } from './../actions/types';

const initialState = {
  error: '',
  message: '',
  data: '',
  authenticated: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return Object.assign({}, state, { authenticated: true, data: action.payload });
    case AUTH_FAILURE:
      return Object.assign({}, state, { error: action.payload });
    case RESET_AUTH:
      return Object.assign({}, state, { error: '', message: '' });
    case AUTH_MESSAGE:
      return Object.assign({}, state, { message: action.payload });
    case UNAUTH_USER:
      return Object.assign({}, state, { authenticated: false, data: '' });
    case UPDATE_PROFILE:
      return Object.assign({}, state, { message: action.payload.message, data: action.payload.user });
    default:
      return state;
  }
}
