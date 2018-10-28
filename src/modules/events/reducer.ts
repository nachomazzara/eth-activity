import { combineReducers } from 'redux'

import {
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
  FETCH_EVENTS_FAILURE,
  FetchEventsRequestAction,
  FetchEventsSuccessAction,
  FetchEventsFailureAction,
  FetchEventSuccessAction
} from './actions'

export type EventReducerAction =
  | FetchEventsSuccessAction
  | FetchEventsFailureAction
  | FetchEventsRequestAction
  | FetchEventSuccessAction

export function data(
  state = { events: {}, eventKeys: [], parcelIds: {}, loans: {} },
  action: EventReducerAction
) {
  switch (action.type) {
    case FETCH_EVENTS_SUCCESS: {
      const { events, parcelIds, loans } = action.payload
      return {
        ...state,
        events: events.reduce(
          (newEvents, event) => ({
            ...newEvents,
            [`${event.event}-${event.transactionHash}-${event.logIndex}`]: event
          }),
          state.events
        ),
        eventKeys: Array.from(
          new Set([
            ...state.eventKeys,
            ...events.map(
              (event: any) =>
                `${event.event}-${event.transactionHash}-${event.logIndex}`
            )
          ])
        ),
        parcelIds: {
          ...state.parcelIds,
          ...parcelIds
        },
        loans: {
          ...state.loans,
          ...loans
        }
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
