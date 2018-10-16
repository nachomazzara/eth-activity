import { BaseWallet } from '@dapps/modules/wallet/types'
import { push } from 'react-router-redux'
import { connectWalletRequest } from '@dapps/modules/wallet/actions'

export type Props = {
  isConnecting: boolean
  isConnected: boolean
  wallet: Partial<BaseWallet>
  navigateToTransactions: typeof push
  onConnectWallet: typeof connectWalletRequest
}

export type State = {
  address: BaseWallet['address']
}

export type MapStateProps = {
  isConnecting: boolean
  isConnected: boolean
  wallet: Partial<BaseWallet>
}

export type MapDispatchProps = {
  navigateToTransactions: typeof push
  onConnectWallet: typeof connectWalletRequest
}
