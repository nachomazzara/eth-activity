import { action } from 'typesafe-actions'
import { BaseWallet } from '@dapps/modules/wallet/types'

export const FETCH_EVENTS_REQUEST = '[Request] Fetch events'
export const FETCH_EVENTS_SUCCESS = '[Success] Fetch events'
export const FETCH_EVENTS_FAILURE = '[Failure] Fetch events'

export const fetchEventsRequest = (address: BaseWallet['address']) =>
  action(FETCH_EVENTS_REQUEST, { address })

export const fetchEventsSuccess = (
  address: BaseWallet['address'],
  events: any[],
  parcelIds: any
) =>
  action(FETCH_EVENTS_SUCCESS, {
    address,
    events,
    parcelIds
  })

export const fetchEventsFailure = (error: string) =>
  action(FETCH_EVENTS_FAILURE, { error })

export type FetchEventsRequestAction = ReturnType<typeof fetchEventsRequest>
export type FetchEventsSuccessAction = ReturnType<typeof fetchEventsSuccess>
export type FetchEventsFailureAction = ReturnType<typeof fetchEventsFailure>
