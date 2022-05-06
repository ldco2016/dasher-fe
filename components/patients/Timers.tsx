import { useStopwatch, useTimer } from 'react-timer-hook'
import AlunaLogger from 'libs/AlunaLogger'

export const CountUpTimer = () => {
  const { seconds, minutes, hours } = useStopwatch({ autoStart: true })

  return (
    <>
      {hours > 0 && `${hours}:`}
      {minutes > 0 ? `${minutes}: ` : '00:'}
      {seconds > 9 ? seconds : `0${seconds}`}
    </>
  )
}

export const CountDownTimer = ({ expiryTimestamp, handleExpire }) => {
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      const logger = AlunaLogger('CountDownTimer:onExpire', true)
      logger.info('onExpire called')
      handleExpire()
    },
  })

  return (
    <>
      {hours > 0 && `${hours}:`}
      {minutes > 0 && `${minutes}: `}
      {seconds}
    </>
  )
}
