import { CONNECT_WALLET_SUCCESS } from '@dapps/modules/wallet/actions'
import { takeEvery, put, call, select } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { eth } from 'decentraland-eth'

import { fetchEventsSuccess } from './actions'
import {
  getParcelIdsFromEvents,
  getContractsObject,
  getLoansFromEvents
} from './utils'
import { getParcelIds } from './selectors'

let latestBlockNumber: number = 0

export function* eventsSaga() {
  yield true
  if (1 == latestBlockNumber) {
    yield takeEvery(CONNECT_WALLET_SUCCESS, listenEventsSaga)
  }
}

const listenEventsSaga = function*() {
  const eventLogsChannel = yield call(createEventChannel)
  yield takeEvery(eventLogsChannel, handleEvents)
}

function* handleEvents(events: any) {
  const parcelIds = yield select(getParcelIds)
  const newParcelIds = yield call(() =>
    getParcelIdsFromEvents(events, parcelIds)
  )
  const loans = getLoansFromEvents(events)
  yield put(fetchEventsSuccess(events, newParcelIds, loans))
}

function* createEventChannel() {
  latestBlockNumber = yield call(
    () =>
      new Promise(resolve =>
        eth.wallet.web3.eth.getBlockNumber((_: any, b: number) => resolve(b))
      )
  )
  return eventChannel(emit => {
    const handler = (data: any) => {
      emit(data)
    }

    const contractsData = getContractsObject()
    for (const contractName in contractsData) {
      const eventNames = contractsData[contractName].eventNames
      for (let eventName of eventNames) {
        const event = eth.getContract(contractName).getEvent(eventName)
        const times = 10
        let fromBlock = 0
        let blockToMove = Math.ceil(latestBlockNumber / times)
        let toBlock = blockToMove
        for (let i = 0; i < times; i++) {
          event['getAllByType'](
            { fromBlock: fromBlock, toBlock: toBlock },
            (error: any, logs: any) => {
              try {
                if (!error) handler(logs)
              } catch (e) {
                console.log(e.message)
              }
            }
          )
          fromBlock = toBlock
          toBlock += blockToMove
        }

        setTimeout(
          () =>
            setInterval(
              () =>
                event['getAllByType'](
                  { fromBlock: latestBlockNumber, toBlock: 'latest' },
                  (error: any, logs: any) => {
                    const logsCount = logs.length
                    if (logsCount > 0) {
                      const blockNumber = logs[logsCount - 1].blockNumber
                      latestBlockNumber =
                        blockNumber > latestBlockNumber
                          ? blockNumber
                          : latestBlockNumber
                    }
                    try {
                      if (!error) handler(logs)
                    } catch (e) {
                      console.log(e.message)
                    }
                  }
                ),
              60000
            ),
          60000
        )
      }
    }
    return () => true
  })
}
