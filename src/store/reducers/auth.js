import { AUTHENTICATE, UPDATE_SUBSCRIPTION, UPDATE_USER } from '../actions/auth';

const initialState = {
  isAuthenticated: false,
  subscriptionStatus: null,
  user: {}
}

export default(state = initialState, action) => {
  switch(action.type){
    case AUTHENTICATE:
      return {
        isAuthenticated: action.isAuthenticated,
        subscriptionStatus: action.subscriptionStatus,
        user: action.user
      }
    case UPDATE_SUBSCRIPTION:
      return {
        isAuthenticated: state.isAuthenticated,
        subscriptionStatus: action.subscriptionStatus,
        user: state.user
      }
    case UPDATE_USER:
      return {
        isAuthenticated: state.isAuthenticated,
        subscriptionStatus: state.subscriptionStatus,
        user: action.user
      }
    default:
      return state
  }
}