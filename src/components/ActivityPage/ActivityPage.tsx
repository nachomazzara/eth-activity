import * as React from 'react'
// import { eth } from 'decentraland-eth'
// import { t } from '@dapps/modules/translation/utils'
import { Props, State } from './ActivityPage.types'
import { Loader } from 'decentraland-ui'
// import './ActivityPage.css'

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
    const { isConnecting, isConnected, wallet, isLoading, events } = this.props

    const isRopsten = isConnected && wallet.network === 'ropsten'

    return (
      <div className="ActivityPage">
        {!events || isConnecting || isLoading ? (
          <Loader active={true} size="massive" />
        ) : (
          events.map((event: any, index: number) => (
            <p
              style={{
                background: '#7188bf54',
                padding: '10px',
                borderRadius: '15px'
              }}
              key={index}
            >
              {event}
            </p>
          ))
        )}
        {isConnecting}
        {isRopsten}
      </div>
    )
  }
}
