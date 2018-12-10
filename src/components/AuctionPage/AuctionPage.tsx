import * as React from 'react'
import { env } from 'decentraland-commons'

const MANA_ADDRESS = '0x0f5d2fb29fb7d3cfee444a200298f468908cc942'
const TOKENS = {
  [MANA_ADDRESS]: {
    symbol: 'MANA',
    decimals: 18
  },
  '0xB8c77482e45F1F44dE1745F52C74426C631bDD52': { symbol: 'BNB', decimals: 18 },
  '0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27': { symbol: 'ZIL', decimals: 12 },
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': {
    symbol: 'MAKER',
    decimals: 18,
    transfer: 'Transfer to maker charity',
    target: '0x69076e44a9c70a67d5b79d95795aba299083c275'
  },
  '0xbf2179859fc6d5bee9bf9158632dc51678a4100e': {
    symbol: 'ELF',
    decimals: 18,
    transfer: 'Transfer to ELF burner contract',
    target: '0x680ac5ee6db009cb7f10d745ff8c45723463edcd'
  },
  '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359': {
    symbol: 'DAI',
    decimals: 18,
    transfer: 'Transfer to charity',
    target: '0xe3856fbf298f539b6585224ece523488bfb9f82c'
  },
  '0xdd974d5c2e2928dea5f71b9825b8b646686bd200': { symbol: 'KNC', decimals: 18 },
  '0x744d70fdbe2ba4cf95131626614a1763df805b9e': {
    symbol: 'SNT',
    decimals: 18,
    transfer: 'Transfer to controller contract',
    target: '0x52ae2b53c847327f95a5084a7c38c0adb12fd302'
  },
  '0xf970b8e36e23f7fc3fd752eea86f8be8d83375a6': {
    symbol: 'RCN',
    decimals: 18,
    transfer: 'Transfer to suicide contract',
    target: '0xdf861993edbe95bafbfa7760838f8ebbd5afda9f'
  }
}
export default class AuctionPage extends React.Component {
  constructor(props: any) {
    super(props)

    this.state = {
      tokensTransferred: {},
      tokensBurned: {},
      tokensUsed: {},
      contract: props.location.search.split('=')[1]
    }
  }

  componentWillMount() {
    this.fetchAuctionStats()
  }

  async fetchAuctionStats() {
    const contractAddress = (this.state as any).contract

    const res = await fetch(
      `https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${contractAddress}&apikey=${env.get(
        'REACT_APP_ETHERSCAN_API_KEY'
      )}`
    )

    const events = await res.json()

    const burnedEvents = events.result.filter(
      (event: any) =>
        event.topics[0] ===
        '0xc0fc06a38b27935af1d0b60487608e98182d771362ccb26d0cf0442347250c1a' // TokenBurned
    )

    const transferredEvents = events.result.filter(
      (event: any) =>
        event.topics[0] ===
        '0xdc5e8cc6b36001921ea942b2d0334e09fcc347e33b47a83d9a6c5c2a521d329c' // TokenTransferred
    )

    const conversionEvents = events.result.filter(
      (event: any) =>
        event.topics[0] ===
        '0xb3be3ff63cd46548edd20d23704bcd173a4c25551e32057ded64670db29324b9' // BidConversion
    )

    const tokensUsed = conversionEvents.reduce(
      (addresses: any, event: any) => {
        const address = event.topics[1]
        const token = this.getToken(address)

        if (!addresses[token]) {
          addresses[token] = 0
        }
        addresses[token] +=
          parseInt(event.data.substr(2 + 64 * 2, 64), 16) /
          10 ** TOKENS[token].decimals

        addresses[MANA_ADDRESS] +=
          parseInt(event.data.substr(2 + 64, 64), 16) /
          10 ** TOKENS[MANA_ADDRESS].decimals

        return addresses
      },
      { [MANA_ADDRESS]: 0 }
    )

    const tokensBurned = burnedEvents.reduce((addresses: any, event: any) => {
      const address = event.topics[1]
      const token = this.getToken(address)
      if (!addresses[token]) {
        addresses[token] = 0
      }

      addresses[token] +=
        parseInt(event.data.substr(66, event.data.length), 16) /
        10 ** TOKENS[token].decimals
      return addresses
    }, {})

    const tokensTransferred = transferredEvents.reduce(
      (addresses: any, event: any) => {
        const address = event.topics[1]
        const token = this.getToken(address)
        if (!addresses[token]) {
          addresses[token] = 0
        }

        addresses[token] +=
          parseInt(event.data.substr(66, event.data.length), 16) /
          10 ** TOKENS[token].decimals
        return addresses
      },
      {}
    )

    this.setState({ tokensUsed, tokensBurned, tokensTransferred })
  }

  getToken = (address: string) =>
    Object.keys(TOKENS).filter(
      (token: any) => address.indexOf(token.substr(2).toLowerCase()) != -1
    )[0]

  render() {
    const { tokensUsed, tokensTransferred, tokensBurned } = this.state as any
    return (
      <React.Fragment>
        <h2>{'Amount of tokens used'}</h2>
        {tokensUsed &&
          Object.keys(tokensUsed).map((token: any) => (
            <p key={token}>{`${TOKENS[token].symbol} : ${
              token === MANA_ADDRESS
                ? isNaN(
                    parseFloat(tokensBurned[token]) -
                      parseFloat(tokensUsed[token])
                  )
                  ? 0
                  : parseFloat(tokensBurned[token]) -
                    parseFloat(tokensUsed[token])
                : tokensUsed[token] // total mana burned - used for conversion
            }`}</p>
          ))}
        <h2>{'Amount of tokens burned'}</h2>
        {tokensBurned &&
          Object.keys(tokensBurned).map((token: any) => (
            <p key={token}>{`${TOKENS[token].symbol} : ${
              tokensBurned[token]
            }`}</p>
          ))}
        <h2>{'Amount of tokens transferred'}</h2>
        {tokensTransferred &&
          Object.keys(tokensTransferred).map((token: any) => (
            <p key={token}>
              {`${TOKENS[token].symbol} (${TOKENS[token].transfer} `}
              <a
                style={{ textDecoration: 'underline', color: 'grey' }}
                href={`https://etherscan.io/address/${TOKENS[token].target}`}
                target="_blank"
              >
                {TOKENS[token].target}
              </a>
              {'): '}
              {tokensTransferred[token]}
            </p>
          ))}
      </React.Fragment>
    )
  }
}
