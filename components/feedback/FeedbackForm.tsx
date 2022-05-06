import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  FormControlLabel,
  FormControl,
  FormHelperText,
  RadioGroup,
  Radio,
  Alert,
} from '@mui/material'
import ControlledTextField from 'components/forms/ControlledTextField'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import env from '@beam-australia/react-env'
import axios from 'axios'
import { useAppContext } from 'context'
import { useSession } from 'next-auth/client'
import packageJson from 'package.json'

import AlunaDialog from 'components/Dialog'
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar'

interface IFeedbackFormComponent {
  isOpen: boolean
  handelCloseFeedbackModal: () => void
}
interface IFeedbackFormPostData {
  feedbackType:
    | 'Bug'
    | 'Compliment'
    | 'Content'
    | 'Error'
    | 'Other'
    | 'Products'
    | 'Question'
    | 'Suggestion'
  product: string
  version: string
  buildId: string
  fullname?: string
  pui?: string
  contactPhone?: string
  contactEmail?: string
  description?: string
}

const FeedbackForm = ({
  isOpen,
  handelCloseFeedbackModal,
}: IFeedbackFormComponent) => {
  const methods = useForm({ mode: 'onChange' })
  const [snackOpen, setSnackOpen] = useState<boolean>(false)

  const [session] = useSession()
  const {
    user: {
      firstName: aramadaUserFirstName,
      lastName: aramadaUserLastName,
      pui: aramadaUserPui,
      email: aramadaUserEmail,
    },
  } = session

  const { state } = useAppContext()
  const {
    token: { accessToken },
  } = state

  const onSubmit = async (data) => {
    const { comment, subject } = data

    const formData: IFeedbackFormPostData = {
      // type, product, version, and buildId are required
      feedbackType: subject,
      product: 'armada',
      version: `${packageJson.version}`,
      buildId: `${env('CURRENT_COMMIT_SHA1')}`,
      fullname: `${aramadaUserFirstName} ${aramadaUserLastName}`,
      pui: aramadaUserPui,
      // Doctor/Nurse/Billing admin phone is not available in the app currently
      // contactPhone: '111-5555',
      contactEmail: aramadaUserEmail,
      description: comment,
      // processData,
      // stars,
      // startedOn,
      // solvedOn,
      // closedOn,
      // archivedOn,
    }

    return await axios
      .post(`${env('PUBLIC_ALUNA_API')}/feedback`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.debug('Feedback Response: ', response)
        methods.reset()
        handleOpenSnackbar()
        handelCloseFeedbackModal()
      })
      .catch((error) => {
        console.debug('Feedback error:', error)
      })
  }

  const handleOpenSnackbar = () => {
    setSnackOpen(true)
    return
  }
  const handleCloseSnackbar = () => {
    setSnackOpen(false)
    return
  }
  return (
    <>
      <Snackbar
        open={snackOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Thank you! We appreciate your feedback.
        </Alert>
      </Snackbar>

      <AlunaDialog
        title="Your feedback"
        isOpen={isOpen}
        handleClose={handelCloseFeedbackModal}
      >
        <FormProvider {...methods}>
          <form
            noValidate
            method="post"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <Typography>Please select a subject </Typography>
            <FormControl required error={true} fullWidth>
              <Controller
                control={methods.control}
                name="subject"
                rules={{ required: 'Please select a subject' }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <RadioGroup
                    sx={{ flexDirection: 'row', mb: 0 }}
                    onChange={onChange}
                  >
                    <FormControlLabel
                      value="Bug"
                      control={<Radio />}
                      label="Bug"
                    />
                    <FormControlLabel
                      value="Suggestion"
                      control={<Radio />}
                      label="Suggestion"
                    />
                    <FormControlLabel
                      value="Other"
                      control={<Radio />}
                      label="Other"
                    />
                    {error && (
                      <FormHelperText sx={{ mb: 1, mt: -0.5 }}>
                        {error.message}
                      </FormHelperText>
                    )}
                  </RadioGroup>
                )}
              />
            </FormControl>

            <ControlledTextField
              data-cy="feedback-comment"
              name="comment"
              label="Add a comment"
              multiline={true}
              rows={6}
              sx={{
                mb: 1,
              }}
              rules={{ required: 'Please add your comment' }}
            />

            <Button
              size="small"
              type="submit"
              variant="contained"
              sx={{ float: 'right' }}
            >
              Submit
            </Button>
          </form>
        </FormProvider>
      </AlunaDialog>
    </>
  )
}

export default FeedbackForm
