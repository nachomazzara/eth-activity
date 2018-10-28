import * as React from 'react'
import { Segment, Field, Button } from 'decentraland-ui'
import { eth } from 'decentraland-eth'
import { t } from '@dapps/modules/translation/utils'

import { Props, State } from './HomePage.types'

export default class HomePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      address: props.wallet && props.wallet.address ? props.wallet.address : ''
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { wallet } = this.props
    if (!prevProps.wallet.address && wallet.address) {
      this.setState({ address: wallet.address })
    }
  }

  submit = (event: React.FormEvent<HTMLFormElement>) => {
    const { navigateToTransactions } = this.props
    const { address } = this.state

    if (eth.utils.isValidAddress(address)) {
      navigateToTransactions(address)
    }
    event.preventDefault()
  }

  submitDisabled() {
    // nothing here
  }

  handleOnChange = (e: any) => this.setState({ address: e.target.value })

  render() {
    const { isConnecting, isConnected, onConnectWallet } = this.props

    return (
      <Segment>
        <form onSubmit={isConnected ? this.submit : this.submitDisabled}>
          <br />
          <br />
          <Field
            type={isConnected ? 'address' : 'text'}
            label={t('global.wallet')}
            onChange={this.handleOnChange}
            value={
              isConnecting
                ? t('global.connecting')
                : isConnected
                  ? this.state.address
                  : t('global.no_wallet')
            }
            loading={isConnecting}
          />

          {isConnecting ? null : isConnected ? (
            <>
              <Button primary={true} type="submit" disabled={!isConnected}>
                {t('global.see_events')}
              </Button>
            </>
          ) : (
            <Button primary={true} onClick={onConnectWallet}>
              {t('global.reconnect')}
            </Button>
          )}
        </form>
      </Segment>
    )
  }
}
