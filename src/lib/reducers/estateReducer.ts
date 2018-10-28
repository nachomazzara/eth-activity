import { contracts } from 'decentraland-eth'
import { getContractAddresses, getEventNames } from 'modules/events/utils'

let contractAddresses: any
let eventNames: any

export function estateReducer(event: any): string {
  const { address } = event

  contractAddresses = getContractAddresses()
  eventNames = getEventNames()

  switch (address) {
    case contractAddresses.EstateRegistry: {
      return reduceEstateRegistry(event)
    }
    default:
      return ''
  }
}

function reduceEstateRegistry(event: any): string {
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
    }
    case eventNames.Transfer: {
      const { _from, _to } = event.args
      const estateId = event.args._tokenId

      return _from != '0x0000000000000000000000000000000000000000'
        ? `[${name}] Transferring Estate with token id "${estateId}" ownership to "${_to}"`
        : ''
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
