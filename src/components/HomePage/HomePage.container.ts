import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { RootDispatch } from '@dapps/types'
import { RootState } from 'types'
import {
  getData,
  isConnecting,
  isConnected
} from '@dapps/modules/wallet/selectors'
import { connectWalletRequest } from '@dapps/modules/wallet/actions'

import { MapStateProps, MapDispatchProps } from './HomePage.types'
import HomePage from './HomePage'
import { locations } from 'locations'

const mapState = (state: RootState): MapStateProps => {
  const isWalletConnected = isConnected(state)
  const wallet = getData(state)

  return {
    isConnecting: isConnecting(state),
    isConnected: isWalletConnected,
    wallet
  }
}

const mapDispatch = (dispatch: RootDispatch): MapDispatchProps => ({
  navigateToTransactions: address =>
    dispatch(push(locations.activity(address))),
  onConnectWallet: () => dispatch(connectWalletRequest())
})

export default connect(
  mapState,
  mapDispatch
)(HomePage)
