import { combineReducers } from 'redux'

import {
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
  FETCH_EVENTS_FAILURE,
  FetchEventsRequestAction,
  FetchEventsSuccessAction,
  FetchEventsFailureAction
} from './actions'

export type EventReducerAction =
  | FetchEventsSuccessAction
  | FetchEventsFailureAction
  | FetchEventsRequestAction

export function data(
  state = { events: [], parcelsIds: {} },
  action: EventReducerAction
) {
  switch (action.type) {
    case FETCH_EVENTS_SUCCESS: {
      const { events, parcelIds } = action.payload
      return {
        ...state,
        events,
        parcelIds
      }
    }
    default:
      return state
  }
}

export function loading(state = false, action: EventReducerAction) {
  switch (action.type) {
    case FETCH_EVENTS_REQUEST: {
      return true
    }
    case FETCH_EVENTS_FAILURE:
    case FETCH_EVENTS_SUCCESS: {
      return false
    }
    default:
      return state
  }
}

export function error(state = null, action: EventReducerAction) {
  switch (action.type) {
    case FETCH_EVENTS_FAILURE: {
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
