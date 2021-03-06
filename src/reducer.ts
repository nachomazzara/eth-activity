import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import {
  storageReducer as storage,
  storageReducerWrapper
} from '@dapps/modules/storage/reducer'
import { walletReducer as wallet } from '@dapps/modules/wallet/reducer'
import { translationReducer as translation } from '@dapps/modules/translation/reducer'

import { RootState } from 'types'
import events from 'modules/events/reducer'
import transactions from 'modules/transactions/reducer'

export const rootReducer = storageReducerWrapper(
  combineReducers<RootState>({
    router,
    storage,
    wallet,
    translation,
    events,
    transactions
  })
)
