import { contracts } from 'decentraland-eth'
import { env } from 'decentraland-commons'

import { getParcelIdFromEvent, ASSET_TYPES } from 'lib/reducers/utils'

export function getContractsToConnect() {
  const contractsData = getContractsObject()

  const contractsToConnect = []
  for (const contractName in contractsData) {
    const contract = contractsData[contractName]
    contractsToConnect.push(new contracts[contractName](contract.address))
  }

  return contractsToConnect
}

export function getContractsObject() {
  let network = 'MAINNET'
  if ((window as any).web3 && (window as any).web3.version.network !== '1') {
    network = 'ROPSTEN'
  }
  return Object.freeze({
    MANAToken: {
      address: env.get(`REACT_APP_MANA_TOKEN_CONTRACT_ADDRESS_${network}`),
      eventNames: ['Transfer']
    },
    LegacyMarketplace: {
      address: env.get(
        `REACT_APP_LEGACY_MARKETPLACE_CONTRACT_ADDRESS_${network}`
      ),
      eventNames: ['AuctionCreated', 'AuctionSuccessful', 'AuctionCancelled']
    },
    Marketplace: {
      address: env.get(`REACT_APP_MARKETPLACE_CONTRACT_ADDRESS_${network}`),
      eventNames: ['OrderCreated', 'OrderSuccessful', 'OrderCancelled']
    },
    LANDRegistry: {
      address: env.get(`REACT_APP_LAND_REGISTRY_CONTRACT_ADDRESS_${network}`),
      eventNames: ['Update', 'Transfer', 'UpdateOperator']
    },
    EstateRegistry: {
      address: env.get(`REACT_APP_ESTATE_REGISTRY_CONTRACT_ADDRESS_${network}`),
      eventNames: [
        'CreateEstate',
        'AddLand',
        'RemoveLand',
        'Transfer',
        'Update',
        'UpdateOperator'
      ]
    },
    MortgageHelper: {
      address: env.get(`REACT_APP_MORTGAGE_HELPER_CONTRACT_ADDRESS_${network}`),
      eventNames: ['NewMortgage']
    },
    MortgageManager: {
      address: env.get(
        `REACT_APP_MORTGAGE_MANAGER_CONTRACT_ADDRESS_${network}`
      ),
      eventNames: [
        'CanceledMortgage',
        'StartedMortgage',
        'PaidMortgage',
        'DefaultedMortgage'
      ]
    },
    RCNEngine: {
      address: env.get(`REACT_APP_RCN_ENGINE_CONTRACT_ADDRESS_${network}`),
      eventNames: ['PartialPayment', 'TotalPayment']
    }
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

export function orderAlgo(a: any, b: any) {
  if (
    a.blockNumber < b.blockNumber ||
    (a.blockNumber === b.blockNumber && a.transactionIndex < b.transactionIndex)
  )
    return 1
  if (
    a.blockNumber > b.blockNumber ||
    (a.blockNumber === b.blockNumber && a.transactionIndex > b.transactionIndex)
  )
    return -1
  return 0
}

export async function getParcelIdsFromEvents(
  events: any,
  parcelIds: any
): Promise<any> {
  const parcelsByIds = {}
  for (let event of events) {
    const parcelIdArg = getIdFromEventArgs(event)
    if (parcelIdArg && !parcelIds[parcelIdArg] && !parcelsByIds[parcelIdArg]) {
      try {
        const parcelId = await getParcelIdFromEvent(event)
        parcelsByIds[parcelIdArg] = parcelId
      } catch (e) {}
    }
  }
  return parcelsByIds
}

export function getAssetImageURL(assetId: string, type: string) {
  let network = 'MAINNET'
  if ((window as any).web3 && (window as any).web3.version.network !== '1') {
    network = 'ROPSTEN'
  }

  const URL = env.get(`REACT_APP_MARKETPLACE_API_${network}`)

  if (type === ASSET_TYPES.LAND) {
    // parcel
    const id = assetId
      .replace('(', '')
      .replace(')', '')
      .split(',')
    return `${URL}parcels/${id[0]}/${id[1]}/map.png?width=100&height=100`
  } else {
    // estate
    return `${URL}estates/${assetId}/map.png?width=100&height=100`
  }
}

export function getIdFromEventArgs(event: any) {
  return (
    event.args.assetId ||
    event.args.landId ||
    event.args._landId ||
    event.args._assetId ||
    event.args._estateId ||
    event.args._tokenId
  )
}

export function getEstateIdFromEvent(event: any) {
  return (
    event.args._estateId ||
    event.args._tokenId ||
    event.args._assetId ||
    event.args.assetId
  )
}

export function getLoansFromEvents(events: any[]) {
  return events.reduce((loans, event: any) => {
    if (event.event === getEventNames().NewMortgage) {
      const { loanId, mortgageId, landId } = event.args
      return {
        ...loans,
        [loanId]: {
          mortgage_id: mortgageId,
          parcel_id: landId
        }
      }
      return loans
    }
  }, {})
}

export function isMortgageEvent(event: any) {
  const contractAddresses = getContractAddresses()

  switch (event.address) {
    case contractAddresses.MortgageHelper:
    case contractAddresses.MortgageManager:
    case contractAddresses.RCNEngine:
      return true
    default:
      return false
  }
}
