import { createSelector } from 'reselect'

import { RootState } from 'types'
import {
  getEvents,
  getParcelIds,
  getLoans,
  getMortgages
} from 'modules/events/selectors'
import {
  orderAlgo,
  getIdFromEventArgs,
  isMortgageEvent,
  getEstateIdFromEvent
} from 'modules/events/utils'
import { getAssetTypeFromEvent, ASSET_TYPES } from 'lib/reducers/utils'
import reducers from 'lib/reducers'

export const getState = (state: RootState) => state.transactions
export const getData = (state: RootState) => getState(state).data
export const getTransactions = (state: RootState) => getData(state).transactions

export const isLoading: (state: RootState) => boolean = state =>
  getState(state).loading

export const getTransactionByAddress = (address: string) =>
  createSelector(
    getTransactions,
    getEvents,
    getParcelIds,
    getLoans,
    getMortgages,
    (txs, events, parcelIds, loans, mortgages) => {
      const strEvents: any[] = []
      if (!txs || !txs[address]) {
        return strEvents
      }
      const transactions = txs[address]

      const accountEvents = events.filter(
        (e: any) => transactions[e.transactionHash]
      )

      accountEvents.sort(orderAlgo)

      for (let event of accountEvents) {
        let assetIdArg = getIdFromEventArgs(event)

        if (isMortgageEvent(event)) {
          const mortgageAsset =
            loans[event.args._index || event.args.loanId] ||
            mortgages[event.args._id]
          assetIdArg = mortgageAsset ? mortgageAsset.parcel_id : assetIdArg
        }

        const parcelId = parcelIds ? parcelIds[assetIdArg] : ''
        let coordinate = ''

        if (parcelId) {
          coordinate = `(${parcelId[0]},${parcelId[1]})`
        }
        const type = getAssetTypeFromEvent(event)
        for (let r of reducers) {
          strEvents.push({
            toString: () => (r as any)(event, coordinate),
            assetId:
              type === ASSET_TYPES.LAND
                ? coordinate
                : getEstateIdFromEvent(event) || assetIdArg,
            type
          })
        }
      }
      return strEvents.filter((event: string) => event.toString().length > 0)
    }
  )
