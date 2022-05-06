import React from 'react'
import FileUploadDocumentIcon from '../icons/FileUploadDocumentIcon'
import { LinearProgress, Typography } from '@mui/material'
import { IUploadProcessingStatus, IPendingUpload } from 'types/upload'

const PendingUploadSection = (props: {
  UploadStatus: IUploadProcessingStatus
  PendingUpload: IPendingUpload
}) => {
  const { UploadStatus, PendingUpload } = props
  const sx = { mb: 2, fontWeight: 'normal' }
  if (UploadStatus.InProcess === true) {
    return (
      <>
        <FileUploadDocumentIcon />
        <Typography variant="h1" sx={sx}>
          {UploadStatus.fileNameInProcess}
        </Typography>
        <Typography variant="h3" sx={sx}>
          Uploading
        </Typography>
        <LinearProgress value={50} />
      </>
    )
  }

  return (
    <>
      <FileUploadDocumentIcon />
      <Typography variant="h1" sx={sx}>
        {PendingUpload.fileName}
      </Typography>
      <Typography variant="h3" sx={sx}>
        Complete. Please submit
      </Typography>
    </>
  )
}

export default PendingUploadSection
