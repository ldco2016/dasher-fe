import AlunaLogger, { ILogRecord } from 'libs/AlunaLogger'
import { useRouter } from 'next/router'

function LogMessage(props: { entry: ILogRecord }) {
  const { entry } = props
  return (
    <>
      <pre>
        {entry.context} {entry.timestamp} {entry.message} // Details:{' '}
        {JSON.stringify(entry.details, null, 2)}
      </pre>
    </>
  )
}

function Logs() {
  const router = useRouter()
  const logger = AlunaLogger('Logs')
  const { logHistory, debugLogHistory, errorLogHistory } = logger.logEntries()

  return (
    <>
      <div>
        <button
          onClick={() => {
            logger.clear()
            router.reload()
          }}
        >
          Clear Log
        </button>
      </div>
      <div>
        <h3>Stats</h3>
        <ul>
          <li>
            <strong>Error</strong>: {errorLogHistory.length}
          </li>
          <li>
            <strong>Info</strong>: {logHistory.length}
          </li>
          <li>
            <strong>Debug</strong>: {debugLogHistory.length}
          </li>
        </ul>
      </div>

      <div>
        <h3>Info Log</h3>
        {logHistory.map((entry) => (
          <LogMessage entry={entry} />
        ))}
      </div>
      <div>
        <h3>Error Log</h3>
        {errorLogHistory.map((entry) => (
          <LogMessage entry={entry} />
        ))}
      </div>
      <div>
        <h3>Debug Log</h3>
        {debugLogHistory.map((entry) => (
          <LogMessage entry={entry} />
        ))}
      </div>
    </>
  )
}

Logs.layout = 'default'
Logs.auth = true
export default Logs
