import { AUTHENTICATE, UPDATE_SUBSCRIPTION, UPDATE_USER, LOGOUT } from '../actions/auth';

const initialState = {
  token: localStorage.getItem("userTokenLG") || null,
  isAuthenticated: !!localStorage.getItem("userTokenLG"), // true si hay token guardado
  subscriptionStatus: null,
  user: JSON.parse(localStorage.getItem("userData")) || null, // opcional
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      // Guardamos token y user en localStorage
      if (action.token) {
        localStorage.setItem("userTokenLG", action.token);
      }
      if (action.user) {
        localStorage.setItem("userData", JSON.stringify(action.user));
      }
      return {
        ...state,
        token: action.token || state.token,
        isAuthenticated: action.isAuthenticated,
        subscriptionStatus: action.subscriptionStatus,
        user: action.user || state.user,
      };

    case UPDATE_SUBSCRIPTION:
      return {
        ...state,
        subscriptionStatus: action.subscriptionStatus,
      };

    case UPDATE_USER:
      if (action.user) {
        localStorage.setItem("userData", JSON.stringify(action.user));
      }
      return {
        ...state,
        user: action.user,
      };

    case LOGOUT:
      localStorage.removeItem("userTokenLG");
      localStorage.removeItem("userData");
      return {
        token: null,
        isAuthenticated: false,
        subscriptionStatus: null,
        user: null,
      };

    default:
      return state;
  }
};
