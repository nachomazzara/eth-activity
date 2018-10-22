import { contracts } from 'decentraland-eth'
import { getContractAddresses, getEventNames } from 'modules/events/utils'

let contractAddresses: any
let eventNames: any

export function parcelReducer(event: any, parcelId: any): string {
  const { address } = event

  contractAddresses = getContractAddresses()
  eventNames = getEventNames()

  switch (address) {
    case contractAddresses.LANDRegistry: {
      return reduceLANDRegistry(event, parcelId)
    }
    case contractAddresses.EstateRegistry: {
      return reduceEstateRegistry(event, parcelId)
    }
    default:
      return ''
  }
}

function reduceLANDRegistry(event: any, parcelId: any): string {
  const name = event.event
  if (!parcelId) {
    return ''
  }
  switch (name) {
    case eventNames.Update: {
      const { data } = event.args

      try {
        const attributes = {
          data: contracts.LANDRegistry.decodeLandData(data)
        }
        const attrsStr = JSON.stringify(attributes)

        return `[${name}] Updating "${parcelId}" with ${attrsStr}`
      } catch (error) {
        return `[${name}] Skipping badly formed data for "${parcelId}"`
      }
    }
    case eventNames.UpdateOperator: {
      const { operator } = event.args
      return `[${name}] Updating "${parcelId}": new update operator is ${operator}`
    }
    case eventNames.Transfer: {
      const { to } = event.args

      return `[${name}] Transferring parcel "${parcelId}" ownership to "${to}"`
    }
    default:
      return ''
  }
}

function reduceEstateRegistry(event: any, parcelId: any): string {
  const name = event.event

  switch (name) {
    case eventNames.AddLand: {
      if (!parcelId) return ''
      const { _estateId } = event.args

      if (_estateId) {
        return `[${name}] Adding "${parcelId}" as part of the estate with token id "${_estateId}"`
      }
      break
    }
    case eventNames.RemoveLand: {
      if (!parcelId) return ''
      const { _estateId } = event.args
      if (_estateId) {
        return `[${name}] Removing "${parcelId}" as part of the estate with token id "${_estateId}"`
      }
      break
    }
    default:
      break
  }
  return ''
}
