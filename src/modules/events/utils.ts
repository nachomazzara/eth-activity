import { eth, contracts } from 'decentraland-eth'
import { env } from 'decentraland-commons'

import { getParcelIdFromEvent } from 'lib/reducers/utils'

export function getContractsToConnect() {
  const contractsData = getContractsObject()

  const contractsToConnect = []
  for (const contractName in contractsData) {
    const contract = contractsData[contractName]
    contractsToConnect.push(new contracts[contractName](contract.address))
  }

  return contractsToConnect
}

function getContractsObject() {
  return Object.freeze({
    MANAToken: {
      address: env.get('REACT_APP_MANA_TOKEN_CONTRACT_ADDRESS'),
      eventNames: ['Transfer']
    },
    LegacyMarketplace: {
      address: env.get('REACT_APP_LEGACY_MARKETPLACE_CONTRACT_ADDRESS'),
      eventNames: ['AuctionCreated', 'AuctionSuccessful', 'AuctionCancelled']
    },
    Marketplace: {
      address: env.get('REACT_APP_MARKETPLACE_CONTRACT_ADDRESS'),
      eventNames: ['OrderCreated', 'OrderSuccessful', 'OrderCancelled']
    },
    LANDRegistry: {
      address: env.get('REACT_APP_LAND_REGISTRY_CONTRACT_ADDRESS'),
      eventNames: ['Update', 'Transfer', 'UpdateOperator']
    },
    EstateRegistry: {
      address: env.get('REACT_APP_ESTATE_REGISTRY_CONTRACT_ADDRESS'),
      eventNames: [
        'CreateEstate',
        'AddLand',
        'RemoveLand',
        'Transfer',
        'Update',
        'UpdateOperator'
      ]
    }
    // No mortgages yet
    // MortgageHelper: {
    //   address: env.get('REACT_APP_MORTGAGE_HELPER_CONTRACT_ADDRESS'),
    //   eventNames: ['NewMortgage']
    // },
    // MortgageManager: {
    //   address: env.get('REACT_APP_MORTGAGE_MANAGER_CONTRACT_ADDRESS'),
    //   eventNames: [
    //     'CanceledMortgage',
    //     'StartedMortgage',
    //     'PaidMortgage',
    //     'DefaultedMortgage'
    //   ]
    // },
    // RCNEngine: {
    //   address: env.get('REACT_APP_RCN_ENGINE_CONTRACT_ADDRESS'),
    //   eventNames: ['PartialPayment', 'TotalPayment']
    // },
  })
}

export function getContractAddresses(): any {
  const contractsData = getContractsObject()
  const contractNames = Object.keys(contractsData)

  return contractNames.reduce(
    (contractAddresses: { [key: string]: string }, contractName: string) => ({
      ...contractAddresses,
      [contractName]: contractsData[contractName].address
    }),
    {}
  )
}

export function getEventNames(): any {
  const contractsData = getContractsObject()
  const contractNames = Object.keys(contractsData)

  return contractNames.reduce(
    (eventNames: { [key: string]: string }, contractName: string) => {
      contractsData[contractName].eventNames.forEach(
        (eventName: string) => (eventNames[eventName] = eventName)
      )
      return eventNames
    },
    {}
  )
}

export async function getEvents() {
  const contractsData = getContractsObject()
  const events: any[] = []
  const promises = []

  for (const contractName in contractsData) {
    const eventNames = contractsData[contractName].eventNames
    for (let eventName of eventNames) {
      promises.push(
        new Promise((resolve, reject) => {
          const event = eth.getContract(contractName).getEvent(eventName)
          event['getAllByType'](
            { fromBlock: 0, toBlock: 'latest' },
            (error: any, logs: any[]) => {
              if (error) reject(error)
              events.push(...logs)
              resolve(events)
            }
          )
        })
      )
    }
  }
  await Promise.all(promises)
  events.sort(orderAlgo)
  return events
}

function orderAlgo(a: any, b: any) {
  if (
    a.blockNumber < b.blockNumber ||
    (a.blockNumber === b.blockNumber && a.transactionIndex < b.transactionIndex)
  )
    return -1
  if (
    a.blockNumber > b.blockNumber ||
    (a.blockNumber === b.blockNumber && a.transactionIndex > b.transactionIndex)
  )
    return 1
  return 0
}

export async function getParcelIdsFromEvent(events: any): Promise<any> {
  const parcelsByIds = {}
  for (let event of events) {
    const { assetId, landId, _landId } = event.args
    if (assetId || landId || _landId) {
      try {
        const parcelId = await getParcelIdFromEvent(event)
        parcelsByIds[assetId || landId || _landId] = parcelId
      } catch (e) {}
    }
  }
  return parcelsByIds
}
