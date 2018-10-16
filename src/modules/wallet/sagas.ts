import { env } from 'decentraland-commons'
import { eth } from 'decentraland-eth'
import { createWalletSaga } from '@dapps/modules/wallet/sagas'
import { all } from 'redux-saga/effects'

import { getContractsToConnect } from 'modules/events/utils'

export function* walletSaga() {
  yield all([baseWalletSaga()])
}

export const baseWalletSaga = createWalletSaga({
  provider: env.get('REACT_APP_PROVIDER_URL'), // this param is required to have Ledger support
  contracts: getContractsToConnect(), // add all the contracts you will use here, but MANAToken is required!
  eth // you have to pass the `eth` instance because it's a singleton
})
