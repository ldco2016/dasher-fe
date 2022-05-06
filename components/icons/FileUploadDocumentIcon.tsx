// @ts-ignore
import DocumentIcon from 'public/images/document-table.svg'
import { useTheme } from '@mui/material/styles'
import React from 'react'

const FileUploadDocumentIcon = () => {
  const theme = useTheme()
  return (
    <DocumentIcon
      width="115"
      fill="white"
      style={{
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      }}
    />
  )
}

export default FileUploadDocumentIcon
