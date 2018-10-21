import { action } from 'typesafe-actions'
import { BaseWallet } from '@dapps/modules/wallet/types'

export const FETCH_TRANSACTIONS_REQUEST = '[Request] Fetch transactions'
export const FETCH_TRANSACTIONS_BACKGROUND_REQUEST =
  '[Request] Fetch transactions in background'
export const FETCH_TRANSACTIONS_SUCCESS = '[Success] Fetch transactions'
export const FETCH_TRANSACTIONS_FAILURE = '[Failure] Fetch transactions'

export const fetchTransactionsRequest = (address: BaseWallet['address']) =>
  action(FETCH_TRANSACTIONS_REQUEST, { address })

export const fetchTransactionsInBrackgroundRequest = (
  address: BaseWallet['address']
) => action(FETCH_TRANSACTIONS_BACKGROUND_REQUEST, { address })

export const fetchTransactionsSuccess = (
  address: BaseWallet['address'],
  transactions: any[]
) =>
  action(FETCH_TRANSACTIONS_SUCCESS, {
    address,
    transactions
  })

export const fetchTransactionsFailure = (error: string) =>
  action(FETCH_TRANSACTIONS_FAILURE, { error })

export type FetchTransactionsRequestAction = ReturnType<
  typeof fetchTransactionsRequest
>
export type FetchTransactionsSuccessAction = ReturnType<
  typeof fetchTransactionsSuccess
>
export type FetchTransactionsFailureAction = ReturnType<
  typeof fetchTransactionsFailure
>
