import * as React from 'react'
import { Link } from 'react-router-dom'
import { t } from '@dapps/modules/translation/utils'
import { Loader, Button } from 'decentraland-ui'

import { Props, State } from './ActivityPage.types'
import { locations } from 'locations'
import { getAssetImageURL } from 'modules/events/utils'
import './ActivityPage.css'

const offsetMinutes = 60 * 1000 * 4

export default class ActivityPage extends React.PureComponent<Props, State> {
  fetchTransactionInterval: any
  isUserThere = true
  mountedTime = Date.now()

  componentWillMount() {
    this.props.onFetchTransaction()
    this.fetchTransactionInterval = setInterval(() => {
      if (this.isUserThere || this.mountedTime < Date.now() + offsetMinutes) {
        this.isUserThere = false
        this.props.onFetchTransaction(true)
      }
    }, 30000)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  }

  componentDidUpdate(prevProps: Props) {
    const { wallet } = this.props
    if (!prevProps.wallet.address && wallet.address) {
      this.setState({ address: wallet.address })
    }
  }

  componentWillUnmount() {
    clearInterval(this.fetchTransactionInterval)
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    this.isUserThere = true
  }

  render() {
    const {
      isConnecting,
      isConnected,
      isLoading,
      events,
      onConnectWallet
    } = this.props

    const isFetching = !events || isConnecting || isLoading

    return (
      <div className="ActivityPage">
        <Link className="go-back" to={locations.root()}>
          {t('global.go_back')}
        </Link>
        {isFetching && <Loader active={true} size="massive" />}
        {!isConnected && (
          <React.Fragment>
            <p className="no-events">{t('global.no_wallet')}</p>
            <Button primary={true} onClick={onConnectWallet}>
              {t('global.reconnect')}
            </Button>
          </React.Fragment>
        )}
        {!isFetching &&
          isConnected && (
            <React.Fragment>
              {events.length > 0 ? (
                events.map((event: any, index: number) => (
                  <div key={index} className="event">
                    {event.assetId && (
                      <img src={getAssetImageURL(event.assetId, event.type)} />
                    )}
                    <p>{event.toString()}</p>
                  </div>
                ))
              ) : (
                <p className="no-events">{t('activity.no_events')}</p>
              )}
            </React.Fragment>
          )}
      </div>
    )
  }
}
