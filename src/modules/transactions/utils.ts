import { env } from 'decentraland-commons'

export async function getTransactions(address: string): Promise<{}> {
  const txs = await fetch(
    `${env.get(
      'REACT_APP_ETHERSCAN_API'
    )}?module=account&action=txlist&address=${address}&startblock=0&endblock=latest&page=1&offset=0&sort=asc&apikey=${env.get('REACT_APP_ETHERSCAN_API_KEY')}`
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
