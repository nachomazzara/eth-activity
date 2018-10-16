import { RootState } from 'types'

export const getState = (state: RootState) => state.events
export const getData = (state: RootState) => getState(state).data
export const getEvents = (state: RootState) => getData(state).events
export const getParcelIds = (state: RootState) => getData(state).parcelIds

export const eventByTxHash = (state: RootState) =>
  getEvents(state).reduce((byTxHash: any, e: any) => {
    if (!byTxHash[e.transactionHash]) {
      byTxHash[e.transactionHash] = []
    }
    byTxHash[e.transactionHash].push(e)
    return byTxHash
  }, {})

export const isLoading: (state: RootState) => boolean = state =>
  getState(state).loading
