export interface IPendingUpload {
  fileName: string
  fileType: string
  fileContents: string | ArrayBuffer
  fileSize: number
}
export interface IPendingUploadError extends IPendingUpload {
  errorCode: number
  errorMessage: string
}
export interface IUploadProcessingStatus {
  InProcess: boolean
  percentage: number
  IsComplete: boolean
  fileNameInProcess: string
  errors: IPendingUploadError[] //really, this was for parsing issues or problems with the file.
}

export interface IUploadError {
  name: string
  missing: string[]
  invalid: string[]
}

export interface IDialogStates {
  fileParseErrorDialog: boolean
  errorDialog: boolean
  submitConfirmationDialog: boolean
}
