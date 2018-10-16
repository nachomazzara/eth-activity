import { all } from 'redux-saga/effects'
import { createTranslationSaga } from '@dapps/modules/translation/sagas'

import * as translations from 'translations'

import { walletSaga } from 'modules/wallet/sagas'
import { eventsSaga } from 'modules/events/sagas'
import { transactionsSaga } from 'modules/transactions/sagas'

export const translationSaga = createTranslationSaga({
  translations
})

export function* rootSaga() {
  yield all([walletSaga(), translationSaga(), eventsSaga(), transactionsSaga()])
}
