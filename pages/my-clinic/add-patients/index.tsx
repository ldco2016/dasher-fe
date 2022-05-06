import React, { useCallback, useState } from 'react'
import { Button, Link, Typography, Box, Tabs, Tab } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { useTheme, styled } from '@mui/system'

import AddPatientsForm from 'components/my-clinic/AddPatientsForm'
import {
  IUploadProcessingStatus,
  IPendingUpload,
  IDialogStates,
} from 'types/upload'
import PendingUploadSection from 'components/upload/PendingUploadSection'
import SubmissionConfirmationDialog from 'components/upload/SubmissionConfirmationDialog'
import UploadPendingSection from 'components/upload/UploadPendingSection'
import FileLoadFailedDialog from 'components/upload/FileLoadFailedDialog'
import GenericErrorDialog from 'components/upload/GenericErrorDialog'
import { TabPanelProps } from 'types'
import TabPanel from 'components/TabPanel'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const UploadArea = styled('span')(({ theme }) => ({
  background: '#F1F5F6',
  padding: theme.spacing(6),
  textAlign: 'center',
  display: 'block',
  border: `1px dashed ${theme.palette.grey[400]}`,
  marginTop: theme.spacing(6),
}))

const AddPatients = () => {
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<IUploadProcessingStatus>({
    percentage: 0,
    InProcess: false,
    IsComplete: false,
    fileNameInProcess: '',
    errors: [],
  })
  const [pendingUploads, setPendingUploads] = useState<Array<IPendingUpload>>(
    []
  )
  const [dialogDisplayStates, setDialogDisplayStates] = useState<IDialogStates>(
    {
      fileParseErrorDialog: false,
      errorDialog: false,
      submitConfirmationDialog: false,
    }
  )

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (uploadStatus.InProcess) return //Don't continue if in flight.

    setUploadStatus({
      percentage: 0,
      InProcess: true,
      IsComplete: false,
      fileNameInProcess: '',
      errors: [],
    })

    fileRejections.forEach((file) => {
      console.log('fileRejections', file)
      const currentState = { ...uploadStatus }
      currentState.IsComplete = true
      currentState.errors.push({
        fileContents: undefined,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        errorCode: 1,
        errorMessage: 'File Rejected',
      })
      setUploadStatus(currentState)
    })

    acceptedFiles.forEach((file, index) => {
      const percentageDone: number = (index + 1) / acceptedFiles.length
      setUploadStatus({
        percentage: percentageDone,
        InProcess: true,
        IsComplete: false,
        fileNameInProcess: file.name,
        errors: [],
      })

      const reader = new FileReader()
      reader.onabort = () => {
        console.log('file reading was aborted')
      }
      reader.onerror = () => {
        console.log('file reading has failed')
      }
      reader.onload = () => {
        const pendingFile: IPendingUpload = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileContents: reader.result,
        }
        const currentUploads = new Array<IPendingUpload>(...pendingUploads)
        currentUploads.push(pendingFile)
        setPendingUploads(currentUploads)

        setUploadStatus({
          percentage: 100,
          InProcess: false,
          IsComplete: true,
          fileNameInProcess: '',
          errors: [],
        })
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])

  const handleSelectedTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setActiveTab(newValue)
  }

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: [
      'text/csv',
      'application/vnd.ms-excel', //xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //xlsx
    ].join(','),
  })

  const submitFiles = () => {
    //
    // TODO: Do the API submission and handle the result.
    //At the end.
    // We probably also want a spinner.
    // Lock the form.
    //
    const mutableState: IDialogStates = { ...dialogDisplayStates }
    mutableState.submitConfirmationDialog = true
    setDialogDisplayStates(mutableState)
  }

  return (
    <Box sx={{ maxWidth: '790px', margin: '0 auto' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleSelectedTabChange}>
          <Tab label="Add Multiple Patients" {...a11yProps(0)} />
          {/* Commented out due to AR-317
          <Tab label="Add Single Patient" {...a11yProps(1)} /> */}
        </Tabs>
      </Box>
      <TabPanel value={activeTab} index={0}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          Add Multiple Patients
        </Typography>
        <Typography variant="body1">
          Our team will verify a patient’s insurance eligibility so you can
          communicate any financial responsibility upfront. Submit a list of
          patients to get started.{' '}
          <Link href="/documents/Insurance_Eligibility_Blank.csv" download>
            Download our template
          </Link>{' '}
          and fill out the required fields.
        </Typography>

        <UploadArea {...getRootProps()}>
          <input {...getInputProps()} />

          {isDragActive ? (
            <Typography variant="body1">Drop the files here ...</Typography>
          ) : uploadStatus.InProcess === false &&
            pendingUploads.length === 0 ? (
            <UploadPendingSection Theme={theme} />
          ) : (
            <PendingUploadSection
              UploadStatus={uploadStatus}
              PendingUpload={pendingUploads[0]}
            />
          )}
        </UploadArea>
        <Button
          variant="contained"
          disabled={!uploadStatus.IsComplete}
          fullWidth
          sx={{ mt: 4 }}
          onClick={submitFiles}
        >
          Submit
        </Button>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <AddPatientsForm
          handeleSubmit={() => {
            const mutableState: IDialogStates = { ...dialogDisplayStates }
            mutableState.submitConfirmationDialog = true
            setDialogDisplayStates(mutableState)
          }}
        />
      </TabPanel>

      <SubmissionConfirmationDialog
        SubmissionConfirmationModalOpen={
          dialogDisplayStates.submitConfirmationDialog
        }
        onDismiss={() => {
          const mutableState: IDialogStates = { ...dialogDisplayStates }
          mutableState.submitConfirmationDialog = false
          setDialogDisplayStates(mutableState)
        }}
      />

      <FileLoadFailedDialog
        errors={[]}
        visible={dialogDisplayStates.fileParseErrorDialog}
        onDismiss={() => {
          const mutableState: IDialogStates = { ...dialogDisplayStates }
          mutableState.fileParseErrorDialog = false
          setDialogDisplayStates(mutableState)
        }}
      />

      <GenericErrorDialog
        errorMessage={'Unexpected error'}
        visible={dialogDisplayStates.errorDialog}
        onDismiss={() => {
          const mutableState: IDialogStates = { ...dialogDisplayStates }
          mutableState.errorDialog = false
          setDialogDisplayStates(mutableState)
        }}
      />
    </Box>
  )
}

AddPatients.layout = 'defaultWhite'
AddPatients.auth = true
export default AddPatients
