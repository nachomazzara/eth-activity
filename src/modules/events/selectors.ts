import { RootState } from 'types'

export const getState = (state: RootState) => state.events
export const getData = (state: RootState) => getState(state).data
export const getEventKeys = (state: RootState) => getData(state).eventKeys
export const getParcelIds = (state: RootState) => getData(state).parcelIds
export const getLoans = (state: RootState) => getData(state).loans

export const getEvents = (state: RootState) => {
  const events = getData(state).events
  return getEventKeys(state).map((key: string) => events[key])
}

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

export const getMortgages = (state: RootState) => {
  const loans = getLoans(state)
  return Object.keys(loans).reduce((mortgages, key) => {
    const loan = loans[key]

    if (!loan) return mortgages

    return {
      ...mortgages,
      [loan.mortgage_id]: {
        parcel_id: loan.parcel_id
      }
    }
  }, {})
}
