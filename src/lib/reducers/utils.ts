import { env } from 'decentraland-commons'
import { eth } from 'decentraland-eth'

export function getAssetTypeFromEvent(event: any) {
  const nftAddress = event.args.nftAddress

  switch (nftAddress) {
    case env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS'):
      return 'Estate'
    case env.get('LAND_REGISTRY_CONTRACT_ADDRESS'): // Supports the old marketplace, default should be undefined when deprecated
    default:
      return 'LAND'
  }
}

export function getAssetIdFromEvent(event: any) {
  const nftAddress = event.args.nftAddress

  switch (nftAddress) {
    case env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS'):
      return event.args.assetId
    case env.get('LAND_REGISTRY_CONTRACT_ADDRESS'): // Supports the old marketplace, default should be undefined when deprecated
    default:
      return null
  }
}

export async function getParcelIdFromEvent(event: any) {
  const { assetId, landId, _landId } = event.args
  const LANDRegistry = eth.getContract('LANDRegistry')
  return LANDRegistry.decodeTokenId(assetId || landId || _landId)
}
