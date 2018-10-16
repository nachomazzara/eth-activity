import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import WalletProvider from '@dapps/providers/WalletProvider'
import TranslationProvider from '@dapps/providers/TranslationProvider'

import Routes from './Routes'
import { store, history } from './store'
import 'decentraland-ui/lib/styles.css'
import 'decentraland-ui/lib/dark-theme.css'

ReactDOM.render(
  <Provider store={store}>
    <TranslationProvider locales={['en', 'es']}>
      <WalletProvider>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </WalletProvider>
    </TranslationProvider>
  </Provider>,
  document.getElementById('root')
)
