import { CONNECT_WALLET_SUCCESS } from '@dapps/modules/wallet/actions'
import { getAddress } from '@dapps/modules/wallet/selectors'
import { takeEvery, put, call, select } from 'redux-saga/effects'
import { eventChannel, delay } from 'redux-saga'
import { eth } from 'decentraland-eth'

import { fetchEventsSuccess } from './actions'
import { getParcelIdsFromEvent, getContractsObject } from './utils'
import { getParcelIds } from './selectors'
import { fetchTransactionsRequest } from 'modules/transactions/actions'

let latestBlockNumber: number = 0

export function* eventsSaga() {
  yield takeEvery(CONNECT_WALLET_SUCCESS, listenEventsSaga)
}

const listenEventsSaga = function*() {
  const eventLogsChannel = yield call(createEventChannel)
  yield takeEvery(eventLogsChannel, handleEvents)
}

function* handleEvents(events: any) {
  const parcelsIds = yield select(getParcelIds)
  const newParcelsIds = yield call(() =>
    getParcelIdsFromEvent(events, parcelsIds)
  )
  yield put(fetchEventsSuccess(events, newParcelsIds))
  if (events.length > 0 && latestBlockNumber <= events[0].blockNumber) {
    const address = yield select(getAddress)
    yield delay(60000)
    yield put(fetchTransactionsRequest(address))
  }
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
        let blockToMove = Math.ceil((latestBlockNumber - 1) / times)
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

        event['watchByType']({ toBlock: 'latest' }, (error: any, log: any) => {
          try {
            if (!error) handler([log])
          } catch (e) {
            console.log(e.message)
          }
        })
      }
    }
    return () => {
      for (const contractName in contractsData) {
        const eventNames = contractsData[contractName].eventNames
        for (let eventName of eventNames) {
          const event = eth.getContract(contractName).getEvent(eventName)
          event['stopWatchByType'](
            { fromBlock: 0, toBlock: 'latest' },
            (error: any, log: any) => {
              if (!error) handler(log)
            }
          )
        }
      }
    }
  })
}
