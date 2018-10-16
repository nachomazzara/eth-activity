import * as React from 'react'
// import { eth } from 'decentraland-eth'
// import { t } from '@dapps/modules/translation/utils'
import { Props, State } from './ActivityPage.types'
import { Loader } from 'decentraland-ui'
// import './ActivityPage.css'

export default class ActivityPage extends React.PureComponent<Props, State> {
  componentWillMount() {
    this.props.onFetchTransaction()
  }

  componentDidUpdate(prevProps: Props) {
    const { wallet } = this.props
    if (!prevProps.wallet.address && wallet.address) {
      this.setState({ address: wallet.address })
    }
  }

  render() {
    const { isConnecting, isConnected, wallet, isLoading, events } = this.props

    const isRopsten = isConnected && wallet.network === 'ropsten'

    return (
      <div className="ActivityPage">
        {!events || isConnecting || isLoading ? (
          <Loader active size="massive" />
        ) : (
          events.map((event: any, index: number) => <p key={index}>{event}</p>)
        )}
        {isConnecting}
        {isRopsten}
      </div>
    )
  }
}
