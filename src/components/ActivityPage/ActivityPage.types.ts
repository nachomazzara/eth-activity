import { match } from 'react-router'
import { BaseWallet } from '@dapps/modules/wallet/types'
import { connectWalletRequest } from '@dapps/modules/wallet/actions'

export type URLParams = {
  address: string
}

export type Props = {
  isConnecting: boolean
  isConnected: boolean
  wallet: Partial<BaseWallet>
  events: any
  isLoading: boolean
  onConnectWallet: typeof connectWalletRequest
  match: match<URLParams>
  onFetchTransaction: Function
}

export type State = {
  address: BaseWallet['address']
}

export type MapStateProps = {
  isConnecting: boolean
  isConnected: boolean
  wallet: Partial<BaseWallet>
  events: any
  isLoading: boolean
}

export type MapDispatchProps = {
  onConnectWallet: typeof connectWalletRequest
  onFetchTransaction: Function
}
