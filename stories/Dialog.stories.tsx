import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AlunaDialog from 'components/Dialog'
import { Button } from '@mui/material'

export default {
  title: 'Aluna Dialog',
  component: AlunaDialog,
} as ComponentMeta<typeof AlunaDialog>

const TemplateAlunaDialog: ComponentStory<typeof AlunaDialog> = (args) => {
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false)

  const toggleFeedbackModal = () => {
    setFeedbackOpen(!feedbackOpen)
  }

  const handelCloseFeedbackModal = () => {
    setFeedbackOpen(false)
  }

  return (
    <>
      <Button onClick={toggleFeedbackModal} variant="contained" size="small">
        Feedback
      </Button>
      <AlunaDialog
        {...args}
        isOpen={feedbackOpen}
        handleClose={handelCloseFeedbackModal}
      >
        <>test dialog content</>
      </AlunaDialog>
    </>
  )
}

export const PlainAlunaDialog: ComponentStory<typeof AlunaDialog> =
  TemplateAlunaDialog.bind({})

PlainAlunaDialog.args = {
  title: 'Your feedback',
}
