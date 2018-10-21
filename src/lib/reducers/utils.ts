import { eth } from 'decentraland-eth'

export function getAssetTypeFromEvent(event: any) {
  const nftAddress = event.args.nftAddress
  const LANDRegistry = eth.getContract('LANDRegistry')
  const EstateRegistry = eth.getContract('EstateRegistry')

  switch (nftAddress) {
    case EstateRegistry.address:
      return 'Estate'
    case LANDRegistry.address: // Supports the old marketplace, default should be undefined when deprecated
    default:
      return 'LAND'
  }
}

export function getAssetIdFromEvent(event: any) {
  const nftAddress = event.args.nftAddress
  const LANDRegistry = eth.getContract('LANDRegistry')
  const EstateRegistry = eth.getContract('EstateRegistry')

  switch (nftAddress) {
    case EstateRegistry.address:
      return event.args.assetId
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
