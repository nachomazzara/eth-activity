import { createSelector } from 'reselect'
import { RootState } from 'types'
import { getEvents, getParcelIds } from 'modules/events/selectors'
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
    (txs, events, parcelIds) => {
      const strEvents: string[] = []
      if (!txs || !txs[address]) {
        return strEvents
      }
      const transactions = txs[address]

      const accountEvents = events.filter(
        (e: any) => transactions[e.transactionHash]
      )

      for (let event of accountEvents) {
        for (let r of reducers) {
          const { assetId, landId, _landId } = event.args
          const parcelId = parcelIds[assetId || landId || _landId]
          let coordinate = ''
          if (parcelId) {
            coordinate = `(${parcelId[0]},${parcelId[1]})`
          }
          strEvents.push((r as any)(event, coordinate))
        }
      }

      return strEvents.filter((str: string) => str.length > 0)
    }
  )
