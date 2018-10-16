import { combineReducers } from 'redux'

import {
  FETCH_TRANSACTIONS_REQUEST,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_TRANSACTIONS_FAILURE,
  FetchTransactionsRequestAction,
  FetchTransactionsSuccessAction,
  FetchTransactionsFailureAction
} from './actions'

export type EventReducerAction =
  | FetchTransactionsSuccessAction
  | FetchTransactionsFailureAction
  | FetchTransactionsRequestAction

export function data(state: any = {}, action: EventReducerAction) {
  switch (action.type) {
    case FETCH_TRANSACTIONS_SUCCESS: {
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.payload.address]: action.payload.transactions
        }
      }
    }
    default:
      return state
  }
}

export function loading(state = false, action: EventReducerAction) {
  switch (action.type) {
    case FETCH_TRANSACTIONS_REQUEST: {
      return true
    }
    case FETCH_TRANSACTIONS_FAILURE:
    case FETCH_TRANSACTIONS_SUCCESS: {
      return false
    }
    default:
      return state
  }
}

export function error(state = null, action: EventReducerAction) {
  switch (action.type) {
    case FETCH_TRANSACTIONS_FAILURE: {
      return action.payload.error
    }
    default:
      return state
  }
}

export default combineReducers({
  data,
  loading,
  error
})
