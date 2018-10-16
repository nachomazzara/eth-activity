import { connect } from 'react-redux'
import { RootDispatch } from '@dapps/types'
import { RootState } from 'types'
import {
  getData,
  isConnecting,
  isConnected
} from '@dapps/modules/wallet/selectors'
import { connectWalletRequest } from '@dapps/modules/wallet/actions'

import { MapStateProps, MapDispatchProps, Props } from './ActivityPage.types'
import { isLoading as isFetchingEvents } from 'modules/events/selectors'
import {
  isLoading as isFetchingTransactions,
  getTransactionByAddress
} from 'modules/transactions/selectors'
import { fetchTransactionsRequest } from 'modules/transactions/actions'
import ActivityPage from './ActivityPage'

const mapState = (state: RootState): MapStateProps => {
  const isWalletConnected = isConnected(state)
  const wallet = getData(state)
  let events
  if (wallet.address) {
    events = getTransactionByAddress(wallet.address)(state)
  }

  return {
    isConnecting: isConnecting(state),
    isConnected: isWalletConnected,
    isLoading: isFetchingEvents(state) || isFetchingTransactions(state),
    wallet,
    events
  }
}

const mapDispatch = (
  dispatch: RootDispatch,
  ownProps: Props
): MapDispatchProps => {
  const address = ownProps.match.params.address
  return {
    onConnectWallet: () => dispatch(connectWalletRequest()),
    onFetchTransaction: () => dispatch(fetchTransactionsRequest(address))
  }
}

export default connect(
  mapState,
  mapDispatch
)(ActivityPage)