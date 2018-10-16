import {
  CONNECT_WALLET_SUCCESS,
  ConnectWalletSuccessAction
} from '@dapps/modules/wallet/actions'
import { takeEvery, takeLatest, put, call } from 'redux-saga/effects'

import {
  FetchEventsRequestAction,
  fetchEventsSuccess,
  fetchEventsFailure,
  fetchEventsRequest,
  FETCH_EVENTS_REQUEST
} from './actions'
import { getEvents, getParcelIdsFromEvent } from './utils'

export function* eventsSaga() {
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleWalletConnectSuccess)
  yield takeLatest(FETCH_EVENTS_REQUEST, handleFetchEvents)
}

function* handleWalletConnectSuccess(action: ConnectWalletSuccessAction) {
  const { address } = action.payload.wallet
  yield put(fetchEventsRequest(address))
}

function* handleFetchEvents(action: FetchEventsRequestAction) {
  try {
    const { address } = action.payload
    const events = yield call(() => getEvents())
    const parcelIds = yield call(() => getParcelIdsFromEvent(events))
    yield put(fetchEventsSuccess(address, events, parcelIds))
  } catch (error) {
    yield put(fetchEventsFailure(error.message))
  }
}
