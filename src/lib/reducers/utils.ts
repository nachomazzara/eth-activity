import { eth } from 'decentraland-eth'

import { getEventNames } from 'modules/events/utils'

export const ASSET_TYPES = Object.freeze({
  LAND: 'LAND',
  Estate: 'Estate'
})

export function getAssetTypeFromEvent(event: any) {
  const LANDRegistry = eth.getContract('LANDRegistry')
  const EstateRegistry = eth.getContract('EstateRegistry')
  const nftAddress = event.args.nftAddress || event.address
  const eventNames = getEventNames()

  switch (nftAddress) {
    case EstateRegistry.address:
      switch (event.event) {
        case eventNames.AddLand:
        case eventNames.RemoveLand:
          return ASSET_TYPES.LAND
        default:
          return ASSET_TYPES.Estate
      }
    case LANDRegistry.address: // Supports the old marketplace, default should be undefined when deprecated
    default:
      return ASSET_TYPES.LAND
  }
}

export function getAssetIdFromEvent(event: any) {
  const nftAddress = event.args.nftAddress
  const LANDRegistry = eth.getContract('LANDRegistry')
  const EstateRegistry = eth.getContract('EstateRegistry')

  switch (nftAddress) {
    case EstateRegistry.address:
      return event.args.assetId || event.args._assetId
    case LANDRegistry.address: // Supports the old marketplace, default should be undefined when deprecated
    default:
      return null
  }
}

export async function getParcelIdFromEvent(event: any) {
  const { assetId, landId, _landId } = event.args
  const LANDRegistry = eth.getContract('LANDRegistry')
  return LANDRegistry.decodeTokenId(assetId || landId || _landId)
}
