import * as ls from 'local-storage'
import moment from 'moment'

export enum eSeverity {
  info,
  debug,
  error,
}
export interface ILogRecord {
  context: string
  message: string
  details: {}
  timestamp: string
}
interface ILogRecords {
  logHistory: ILogRecord[]
  debugLogHistory: ILogRecord[]
  errorLogHistory: ILogRecord[]
}

export interface IAlunaLoggerAPI {
  log: (message: string, detailObject: {}, sev: eSeverity) => void
  info: (message: string, detailObject?: {}) => void
  debug: (message: string, detailObject?: {}) => void
  error: (message: string, detailObject?: {}) => void
  clear: () => void
  logEntries: () => ILogRecords
}

/*
TODO:
  - Governer to limit the amount of log data retained. Last 10,000 rows or so.
  - Reduce the retrieval / storage frequency and use vars/memeory more rather than [get/set]LocalStorage
*/

function AlunaLogger(
  context: string,
  outputToConsole: boolean = false
): IAlunaLoggerAPI {
  const getLocalStorage = (group) => ls.get<ILogRecord[]>(group) || []
  const log = {
    logHistory: getLocalStorage('logHistory'),
    debugLogHistory: getLocalStorage('debugLogHistory'),
    errorLogHistory: getLocalStorage('errorLogHistory'),
  } as ILogRecords

  function logEntry(message: string, detailsObject: {}, sev: eSeverity): void {
    const ts = moment().utc().toISOString()
    log.logHistory = getLocalStorage('logHistory')
    log.debugLogHistory = getLocalStorage('debugLogHistory')
    log.errorLogHistory = getLocalStorage('errorLogHistory')

    const newEntry = {
      context,
      details: detailsObject,
      message,
      timestamp: ts,
    }

    switch (sev) {
      case eSeverity.error: {
        log.errorLogHistory.push(newEntry)
        if (outputToConsole) console.error(context, ts, message, detailsObject)
        break
      }
      case eSeverity.debug: {
        log.debugLogHistory.push(newEntry)
        if (outputToConsole) console.debug(context, ts, message, detailsObject)
        break
      }
      default: {
        log.logHistory.push(newEntry)
        if (outputToConsole) console.log(context, ts, message, detailsObject)
        break
      }
    }

    const prune = (logSet: ILogRecord[]) => {
      if (logSet.length > 10000) {
        const start = logSet.length - 10000
        const end = logSet.length
        logSet = logSet.slice(start, end)
      }
      return logSet
    }

    ls.set<ILogRecord[]>('logHistory', prune(log.logHistory))
    ls.set<ILogRecord[]>('debugLogHistory', prune(log.debugLogHistory))
    ls.set<ILogRecord[]>('errorLogHistory', prune(log.errorLogHistory))
  }

  return {
    log: logEntry,
    info: function (message: string, detailsObject: {} = null): void {
      logEntry(message, detailsObject, eSeverity.info)
    },
    debug: function (message: string, detailsObject: {} = null): void {
      logEntry(message, detailsObject, eSeverity.debug)
    },
    error: function (message: string, detailsObject: {} = null): void {
      logEntry(message, detailsObject, eSeverity.error)
    },
    clear: function (): void {
      ls.set<ILogRecord[]>('logHistory', [])
      ls.set<ILogRecord[]>('debugLogHistory', [])
      ls.set<ILogRecord[]>('errorLogHistory', [])

      log.logHistory = getLocalStorage('logHistory')
      log.debugLogHistory = getLocalStorage('debugLogHistory')
      log.errorLogHistory = getLocalStorage('errorLogHistory')
    },
    logEntries: function (): ILogRecords {
      return log
    },
  }
}

const noop = () => {}
AlunaLogger.Disable = (
  context: string,
  outputToConsole: boolean = false
): IAlunaLoggerAPI => ({
  log: noop,
  info: noop,
  debug: noop,
  error: noop,

  clear: noop,
  logEntries: (): ILogRecords => ({
    logHistory: [],
    debugLogHistory: [],
    errorLogHistory: [],
  }),
})
export default AlunaLogger
