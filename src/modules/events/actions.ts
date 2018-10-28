import { action } from 'typesafe-actions'
import { BaseWallet } from '@dapps/modules/wallet/types'

export const FETCH_EVENTS_REQUEST = '[Request] Fetch events'
export const FETCH_EVENTS_SUCCESS = '[Success] Fetch events'
export const FETCH_EVENT_SUCCESS = '[Success] Fetch event'
export const FETCH_EVENTS_FAILURE = '[Failure] Fetch events'

export const fetchEventsRequest = (address: BaseWallet['address']) =>
  action(FETCH_EVENTS_REQUEST, { address })

export const fetchEventsSuccess = (events: any[], parcelIds: any, loans: any) =>
  action(FETCH_EVENTS_SUCCESS, {
    events,
    parcelIds,
    loans
  })

export const fetchEventSuccess = (event: any, parcelIds: any) =>
  action(FETCH_EVENT_SUCCESS, {
    event,
    parcelIds
  })

export const fetchEventsFailure = (error: string) =>
  action(FETCH_EVENTS_FAILURE, { error })

export type FetchEventsRequestAction = ReturnType<typeof fetchEventsRequest>
export type FetchEventsSuccessAction = ReturnType<typeof fetchEventsSuccess>
export type FetchEventsFailureAction = ReturnType<typeof fetchEventsFailure>
export type FetchEventSuccessAction = ReturnType<typeof fetchEventSuccess>
