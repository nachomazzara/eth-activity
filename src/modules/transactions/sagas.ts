import {
  CONNECT_WALLET_SUCCESS,
  ConnectWalletSuccessAction
} from '@dapps/modules/wallet/actions'
import { takeEvery, takeLatest, put, call } from 'redux-saga/effects'

import {
  FetchTransactionsRequestAction,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  fetchTransactionsRequest,
  FETCH_TRANSACTIONS_REQUEST,
  FETCH_TRANSACTIONS_BACKGROUND_REQUEST
} from './actions'
import { getTransactions } from './utils'

export function* transactionsSaga() {
  yield takeEvery(CONNECT_WALLET_SUCCESS, handleWalletConnectSuccess)
  yield takeLatest(FETCH_TRANSACTIONS_REQUEST, handleFetchTransactions)
  yield takeLatest(
    FETCH_TRANSACTIONS_BACKGROUND_REQUEST,
    handleFetchTransactions
  )
}

function* handleWalletConnectSuccess(action: ConnectWalletSuccessAction) {
  const { address } = action.payload.wallet
  yield put(fetchTransactionsRequest(address))
}

function* handleFetchTransactions(action: FetchTransactionsRequestAction) {
  try {
    const { address } = action.payload
    const transactions = yield call(() => getTransactions(address))
    yield put(fetchTransactionsSuccess(address, transactions))
  } catch (error) {
    yield put(fetchTransactionsFailure(error.message))
  }
}
