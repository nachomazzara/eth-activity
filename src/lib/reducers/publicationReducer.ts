import { getAssetTypeFromEvent, getAssetIdFromEvent } from './utils'
import { getContractAddresses, getEventNames } from 'modules/events/utils'

let contractAddresses, eventNames: any

export function publicationReducer(event: any, parcelId: any): string {
  const { address } = event
  const name = event.event
  contractAddresses = getContractAddresses()
  eventNames = getEventNames()

  switch (address) {
    case contractAddresses.LegacyMarketplace: {
      switch (name) {
        case eventNames.AuctionCreated:
        case eventNames.AuctionCancelled:
        case eventNames.AuctionSuccessful: {
          return reduceMarketplace(event, parcelId)
        }
      }
      return ''
    }
    case contractAddresses.Marketplace: {
      switch (name) {
        case eventNames.OrderCreated:
        case eventNames.OrderCancelled:
        case eventNames.OrderSuccessful: {
          return reduceMarketplace(event, parcelId)
        }
      }
      return ''
    }
    default:
      return ''
  }
}

function reduceMarketplace(event: any, parcelId: any): string {
  const name = event.event
  const assetType = getAssetTypeFromEvent(event)
  const assetId = assetType === 'LAND' ? parcelId : getAssetIdFromEvent(event)

  switch (name) {
    case eventNames.AuctionCreated:
    case eventNames.OrderCreated: {
      const contract_id = event.args.id
      return `[${name}] Creating publication ${contract_id} for ${assetType} ${assetId}`
    }
    case eventNames.AuctionSuccessful:
    case eventNames.OrderSuccessful: {
      const buyer = event.args.winner || event.args.buyer // winner is from the LegacyMarketplace
      const contract_id = event.args.id

      return `[${name}] Publication ${contract_id} for ${assetType} ${assetId} sold to ${buyer}`
    }
    case eventNames.AuctionCancelled:
    case eventNames.OrderCancelled: {
      const contract_id = event.args.id
      return `[${name}] Publication ${contract_id} cancelled for ${assetType} ${assetId}`
    }
    default:
      return ''
  }
}
