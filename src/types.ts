import { Reducer, Store } from 'redux'
import { RouterState } from 'react-router-redux'

import { TranslationState } from '@dapps/modules/translation/reducer'
import { WalletState } from '@dapps/modules/wallet/reducer'
import { StorageState } from '@dapps/modules/storage/reducer'

export type RootState = {
  router: RouterState
  storage: StorageState
  translation: TranslationState
  wallet: WalletState
  events: any
  transactions: any
}

export type RootStore = Store<RootState>
export type RootReducer = Reducer<RootState>
