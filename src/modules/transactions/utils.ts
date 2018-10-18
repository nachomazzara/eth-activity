import { env } from 'decentraland-commons'

export async function getTransactions(address: string): Promise<{}> {
  let network = 'MAINNET'
  if ((window as any).web3.version.network !== '1') {
    network = 'ROPSTEN'
  }
  console.log('using network: ', network)
  const txs = await fetch(
    `${env.get(
      `REACT_APP_ETHERSCAN_API_${network}`
    )}?module=account&action=txlist&address=${address}&startblock=0&endblock=latest&page=1&offset=0&sort=asc&apikey=${env.get(
      `REACT_APP_ETHERSCAN_API_KEY_${network}`
    )}`
  )
  const { result } = await txs.json()

  return result.reduce(
    (acc: any, tx: any) => ({
      ...acc,
      [tx.hash]: tx.timeStamp
    }),
    {}
  )
}
