import { contracts } from 'decentraland-eth'
import { getContractAddresses, getEventNames } from 'modules/events/utils'

let contractAddresses: any
let eventNames: any

export function estateReducer(event: any, parcelId: any): string {
  const { address } = event

  contractAddresses = getContractAddresses()
  eventNames = getEventNames()

  switch (address) {
    case contractAddresses.EstateRegistry: {
      return reduceEstateRegistry(event, parcelId)
    }
    default:
      return ''
  }
}

function reduceEstateRegistry(event: any, parcelId: any): string {
  const name = event.event

  switch (name) {
    case eventNames.CreateEstate: {
      const { _owner, _estateId, _data } = event.args

      let data
      try {
        data = contracts.LANDRegistry.decodeLandData(_data)
      } catch (e) {
        data = ''
      }

      const attrsStr = JSON.stringify(data)

      return `[${name}] Creating Estate with token id "${_estateId}" and owner "${_owner}" with "${attrsStr}`

      // await Estate.insert({
      //   id: _estateId,
      //   token_id: _estateId,
      //   owner: _owner.toLowerCase(),
      //   data: { ...data, parcels: [] },
      //   last_transferred_at,
      //   tx_hash
      // })
    }
    case eventNames.AddLand: {
      if (!parcelId) return ''

      const { _estateId } = event.args

      // const [x, y] = Parcel.splitId(parcelId)
      // const parcel = { x: Number(x), y: Number(y) }

      return `[${name}] Updating Estate id: "${_estateId}" add land ${parcelId}`
    }
    case eventNames.RemoveLand: {
      if (!parcelId) return ''

      const { _estateId } = event.args

      return `[${name}] Updating Estate id: "${_estateId}" remove land ${parcelId}`
    }
    case eventNames.Transfer: {
      const { _to } = event.args
      const estateId = event.args._tokenId

      return `[${name}] Transferring Estate with token id "${estateId}" ownership to "${_to}"`
    }
    case eventNames.UpdateOperator: {
      const { _operator, _estateId } = event.args

      return `[${name}] Updating Estate id: "${_estateId}" operator: ${_operator}`
    }
    case eventNames.Update: {
      const { _assetId, _data } = event.args

      return `[${name}] Updating Estate id: "${_assetId}" data: ${_data}`
    }
    default:
      return ''
  }
}
