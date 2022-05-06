import React, { useState, useEffect } from 'react'
import { Typography, Divider, Pagination, Box, Link } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { styled } from '@mui/system'
import Moment from 'react-moment'
import fetch from 'isomorphic-unfetch'
import Theme from '../constants/theme'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useForm, FormProvider } from 'react-hook-form'
import ControlledTextField from './forms/ControlledTextField'
import { GeneralObject } from 'types'
import env from '@beam-australia/react-env'
import { useAppContext } from 'context'
import useSWRWithToken from 'hooks/useSWRWithToken'
import BasicErrorDialog from '../components/BasicErrorDialog'
import { useSession } from 'next-auth/client'

type NoteType = 'manualNote' | 'alarmNote' | 'taskNote' | 'redFlag' | string

interface INote {
  title: string
  noteType: NoteType
  noteText: string
  isPrivateNote?: boolean
  shownAfter?: string
}

const LogList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  margin: `${theme.spacing(2)} 0 0 0`,
  padding: 0,
}))

const LogListItem = styled('li')(({ theme }) => ({
  padding: `${theme.spacing(1)} 0 0 ${theme.spacing(1.5)}`,
  position: 'relative',
}))

const LogListItemHeader = styled('header')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}))

const NoteCard = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: 8,
  '& header': {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    '& svg': {
      marginBottom: -7,
      marginRight: 5,
    },
  },
  '& main': { padding: theme.spacing(2) },
  '& footer': {
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    padding: theme.spacing(2),
  },
}))

// TODO: consider defining this at the theme level if used again
const PaginationStyle = styled(Pagination)(({ theme }) => ({
  '& button': {
    borderRadius: 0,
    margin: 0,

    // Set without theme spacing in order to get this to fit in
    // a narrow drawer with large pagination list
    [theme.breakpoints.down('xl')]: {
      padding: '0 8px',

      // Important is ok for this one off use case. It will be removed
      // when/if pagination style moves up to the theme.
      minWidth: '25px!important',
    },

    '&.Mui-selected': {
      backgroundColor: 'transparent',
      color: 'black',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
    '&.MuiButtonBase-root': {
      minWidth: '35px',
    },
  },
}))

export default function PatientHistoryStepper({ patient }) {
  const { state } = useAppContext()
  const [session] = useSession()
  const { timer } = state

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      noteText: '',
      noteType: 'taskNote',
      isPrivateNote: false,
      shownAfter: `${new Date()}`,
    },
  })
  const [loading, setLoading] = useState(false)
  const iconStyle: GeneralObject = {
    position: 'absolute',
    width: '20px',
    left: '-13px',
    top: '6px',
  }

  const { data: notes = [], mutate } = useSWRWithToken(
    `/patients/${patient.pui}/notes`
  )

  const [errorMessage, setErrorMessage] = useState<string | false>(false)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [showAllNotes, setShowAllNotes] = useState(false)
  const [page, setPage] = useState(1)
  const [noOfPages, setNoOfPages] = useState(
    Math.ceil(notes.length / itemsPerPage)
  )

  const handleChange = (event, value) => {
    setPage(value)
  }

  useEffect(() => {
    setNoOfPages(Math.ceil(notes.length / itemsPerPage))
  }, [notes])

  const toggleShowAllNotes = (e): void => {
    e.preventDefault()

    if (!showAllNotes) {
      // Show all notes without pagination
      setPage(1)
      setItemsPerPage(notes.length)
      setShowAllNotes(true)
      return
    }

    setItemsPerPage(5)
    setShowAllNotes(false)
  }

  const postNotes = async ({ title, noteText }: INote) => {
    setLoading(true)

    // A note created by a doctor or respriatory therapist should check for visitId
    // And POST with it as 'armadaLegacyVisitId: visitId' if it is available.

    // Notes created as administrator or no-doctors (admins, for example)
    // are not visible in the billing report of the legacy dashboard.
    // A note created with one of these roles should never POST armadaLegacyVisitId.

    return await fetch(
      `${env('PUBLIC_ALUNA_API')}/patients/${patient.pui}/notes`,
      {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${state.token?.accessToken}`,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          pui: patient.pui,
          noteType: 'manualNote',
          title,
          noteText,
          // If a visitId is available when the timer is turned on,
          // the note must be created adding armadaLegacyVisitId
          ...(timer.visitId && { armadaLegacyVisitId: timer.visitId }),
          // We will enable Aluna internal RT Notes if there is a use case from Aluna RT's
          isPrivateNote: false,
        }),
      }
    )
      .then((result) => {
        mutate()
        methods.reset()
        return result.json()
      })
      .then((body) => {
        // Use V3 API to notify module md that a note was created
        const { createdOn, noteText } = body
        const { firstName, lastName } = session.user

        const headers = new Headers()
        headers.append('Aluna-Service', 'dasher-fe')
        headers.append('Content-Type', 'application/json')

        var notesBody = JSON.stringify([
          {
            NoteDate: createdOn,
            Notes: noteText,
            User: `${firstName} ${lastName}`,
          },
        ])

        fetch(
          `https://${env(
            'MODULE_MD_ENV'
          )}.alunacare.com/api/v3/notify/note/${patient.pui.replace(
            /^\D+/g,
            ''
          )}`,
          {
            method: 'POST',
            headers: headers,
            body: notesBody,
            redirect: 'follow',
          }
        )
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.log('error', error))
      })
      .catch((error) => setErrorMessage(error))
      .finally(() => setLoading(false))
  }

  return (
    <>
      {/* TODO: extract notes into separate component */}
      <NoteCard>
        <FormProvider {...methods}>
          <form
            noValidate
            method="post"
            onSubmit={methods.handleSubmit(postNotes)}
          >
            <header>
              <CreateOutlinedIcon />
              <Typography variant="h2" display="inline">
                Add Notes
              </Typography>
            </header>
            <main>
              <ControlledTextField
                name="noteText"
                label="Note Text"
                multiline={true}
                required={true}
                variant="standard"
                sx={{
                  mt: 0,
                  '& .MuiInputBase-root::before': {
                    borderBottom: 'none!important',
                  },
                  '& .MuiInputBase-root::after': {
                    borderBottom: 'none!important',
                  },
                }}
                rows={3}
                rules={{
                  required: 'Note text required',
                  maxLength: {
                    value: 4000,
                    message: 'A note must be under 4000 characters',
                  },
                }}
                placeholder="add note text..."
              />
            </main>
            <footer>
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Submit
              </LoadingButton>
            </footer>
          </form>
        </FormProvider>
      </NoteCard>

      <BasicErrorDialog
        errorTitle={'Error Adding Notes'}
        errorMessage={errorMessage.toString()}
        displayed={errorMessage !== false}
        closeDialog={() => setErrorMessage(false)}
      />

      <Box
        component="div"
        sx={{
          mt: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        {notes.length > itemsPerPage && (
          <>
            {!showAllNotes && notes.length > 0 && (
              <PaginationStyle
                count={noOfPages}
                page={page}
                onChange={handleChange}
                defaultPage={1}
                color="primary"
                size="large"
              />
            )}

            {!showAllNotes && notes.length > 0 && (
              <Link href="#" onClick={toggleShowAllNotes} sx={{ p: 1 }}>
                All
              </Link>
            )}
          </>
        )}
        {showAllNotes && (
          <Link href="#" onClick={toggleShowAllNotes} sx={{ p: 1 }}>
            Paginate Notes
          </Link>
        )}
      </Box>

      <LogList data-cy="patient-history-stepper-note-log-list">
        {notes
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((note) => {
            return (
              <LogListItem key={note._id}>
                <LogListItemHeader
                  sx={{
                    color:
                      note.noteType === 'redFlag'
                        ? Theme.palette.error.main
                        : Theme.palette.primary.main,
                  }}
                >
                  {note.noteType === 'redFlag' && (
                    <ReportProblemOutlinedIcon sx={iconStyle} />
                  )}
                  {note.noteType === 'alarmNote' && (
                    <AccessAlarmIcon sx={iconStyle} />
                  )}
                  <Typography variant="h2">
                    {note.noteType === 'manualNote' ? 'Note' : note.noteType}{' '}
                  </Typography>
                  <Typography
                    data-cy="patient-history-stepper-note-created-on"
                    variant="body2"
                  >
                    <Moment format="MM/DD/YYYY" date={`${note.createdOn}`} />
                  </Typography>
                </LogListItemHeader>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  Added by <b>{note.fromDisplay}</b>
                </Typography>
                <Typography variant="h2">{note.title}</Typography>
                <Typography variant="body2">{note.noteText}</Typography>
                <Divider sx={{ mt: 1 }} />
              </LogListItem>
            )
          })}
      </LogList>
    </>
  )
}
