import React, { ReactEventHandler, useState, useEffect } from 'react'
import { Button } from '@mui/material'
import FeedbackForm from 'components/feedback/FeedbackForm'
import { styled } from '@mui/system'
import { isFirefox, isSafari } from 'react-device-detect'

const FeedbackButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  transform: 'rotate(-90deg)',
  top: '75%',
  right: isSafari ? '-29px' : '-23px',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  zIndex: 9999,
}))

const Feedback = () => {
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false)

  const toggleFeedbackModal = (e: ReactEventHandler) => {
    setFeedbackOpen(!feedbackOpen)
  }

  const handelCloseFeedbackModal = () => {
    setFeedbackOpen(false)
  }

  return (
    <>
      <FeedbackButton
        onClick={toggleFeedbackModal}
        variant="contained"
        size="small"
      >
        Feedback
      </FeedbackButton>

      <FeedbackForm
        isOpen={feedbackOpen}
        handelCloseFeedbackModal={handelCloseFeedbackModal}
      />
    </>
  )
}

export default Feedback
