import { getContractAddresses, getEventNames } from 'modules/events/utils'
import { eth } from 'decentraland-eth'

let contractAddresses: any
let eventNames: any

export function mortgageReducer(event: any, parcelId: string): string {
  const { address } = event

  contractAddresses = getContractAddresses()
  eventNames = getEventNames()

  switch (address) {
    case contractAddresses.MortgageHelper: {
      return reduceMortgageHelper(event, parcelId)
      break
    }
    case contractAddresses.MortgageManager: {
      return reduceMortgageManager(event)
      break
    }
    case contractAddresses.RCNEngine: {
      return reduceRCNEngine(event)
      break
    }
    default:
      return ''
  }
}

function reduceMortgageHelper(event: any, parcelId: string): string {
  const name = event.event

  if (!parcelId) {
    return ''
  }

  switch (name) {
    case eventNames.NewMortgage: {
      const { loanId, mortgageId } = event.args
      return `[${name}] Created Mortgage ${mortgageId} for ${parcelId} with loanId ${loanId}`
    }
    default:
      return ''
  }
}

function reduceMortgageManager(event: any) {
  const name = event.event
  const { _id } = event.args

  switch (name) {
    case eventNames.CancelledMortgage: {
      return `[${name}] Cancelled Mortgage ${_id}`
    }
    case eventNames.StartedMortgage: {
      return `[${name}] Started Mortgage ${_id}`
    }
    case eventNames.PaidMortgage: {
      return `[${name}] Claimed Mortgage ${_id}`
    }
    case eventNames.DefaultedMortgage: {
      return `[${name}] Defaulted Mortgage ${_id}`
    }
    default:
      return ''
  }
}

function reduceRCNEngine(event: any) {
  const name = event.event
  const { _index, _amount } = event.args

  // TODO: index mortgageIds by loanId
  // const mortgageManagerContract = eth.getContract('MortgageManager')
  // const mortgageId = await mortgageManagerContract.loanToLiability(
  //   eth.getContract('RCNEngine').address,
  //   _index
  // )
  // if (!mortgageId) {
  //   return ''
  // }

  switch (name) {
    case eventNames.PartialPayment: {
      // return `[${name}] Partial Payment for mortgage ${mortgageId} - loan ${_index} of ${eth.utils.fromWei(
      //   _amount
      // )}`
      return `[${name}] Partial Payment for loan ${_index} of ${eth.utils.fromWei(
        _amount
      )}`
    }
    case eventNames.TotalPayment: {
      return `[${name}] Total Payment for loan ${_index}`
    }
    default:
      return ''
  }
}
