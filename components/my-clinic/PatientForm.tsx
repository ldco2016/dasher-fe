import React, { useState } from 'react'
import Moment from 'react-moment'
import {
  Typography,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

import { LoadingButton } from '@mui/lab'
import PhoneNumberField from '../forms/PhoneNumberField'
import DateField from '../forms/DateField'
import { styled, useTheme } from '@mui/system'

import { useForm, FormProvider } from 'react-hook-form'
import ControlledTextField from '../forms/ControlledTextField'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddressFields from '../forms/AddressFields'
import moment from 'moment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
const Form = styled('form')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: 1,
  flexGrow: 1,
}))

const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  transform: 'translate(14px, 8px) scale(1)',
  '&[data-shrink="true"]': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
}))

const TableStyled = styled(Table)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  '& .MuiTableCell-root:first-of-type': {
    paddingLeft: '16px!important',
  },
}))

type VerifyPatientFormValues = {
  firstName: string
  lastName: string
  dob: string
  email: string
  phone: string
  emr: string
  icdCodes: Array<string>
  nextAppointment: string

  street: string
  unitNumber: string
  city: string
  state: string
  zip: string

  payer: string
  payerPhone: string
  memberID: string
  label: string
  groupID: string
}

const PatientForm = ({ patient, hideDrawer }) => {
  const {
    firstName,
    lastName,
    dob,
    email,
    phone,
    emr,
    icdCodes,
    nextAppointment,
    street,
    unitNumber,
    city,
    state,
    zip,
    payer,
    payerPhone,
    memberID,
    label,
    groupID,
  } = patient
  const methodsVerifiedPatietForm = useForm<VerifyPatientFormValues>({
    mode: 'onChange',
  })
  const methodsIncompleteOrPending = useForm<VerifyPatientFormValues>({
    mode: 'onChange',
    defaultValues: {
      firstName,
      lastName,
      dob: moment(dob).format('MM/DD/YYYY'),
      email,
      phone,
      emr,
      icdCodes,
      nextAppointment,

      street,
      unitNumber,
      city,
      state,
      zip,

      payer,
      payerPhone,
      memberID,
      label,
      groupID,
    },
  })
  const theme = useTheme()

  const [doctor, setDoctor] = useState('')
  const [online, setOnline] = useState(false)
  const [inOffice, setInOffice] = useState(false)
  const [patientConsentCollected, setPatientConsentCollected] = useState(false)
  const [acceptPatientsModalOpen, setAcceptPatientsModalOpen] = useState(false)

  const onSubmitVerified = (data) => {
    console.log('onSubmitVerified data: ', data)
  }

  const onSubmitIncompleteOrPending = (data) => {
    console.log('onSubmitIncompleteOrPending data: ', data)
  }

  const handelToggleAcceptPatientsModal = () => {
    setAcceptPatientsModalOpen(!acceptPatientsModalOpen)
  }

  return (
    <Box>
      <Typography id="modal-modal-title" variant="h1">
        {patient.firstName} {patient.lastName}
      </Typography>
      {patient.status === 'Verified' ? (
        <FormProvider {...methodsVerifiedPatietForm}>
          <Form
            noValidate
            method="post"
            onSubmit={methodsVerifiedPatietForm.handleSubmit(onSubmitVerified)}
          >
            <Accordion elevation={0} square>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ paddingLeft: 0 }}
              >
                <Typography variant="h2">Personal Details</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                <TableStyled size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>DOB</TableCell>
                      <TableCell>
                        <Moment format="MM/DD/YYYY" date={`${dob}`}></Moment>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Phone</TableCell>
                      <TableCell>{phone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>{email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Home Address</TableCell>
                      <TableCell>
                        {street}, {city}, {state} {zip}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>EMR Number</TableCell>
                      <TableCell>{emr}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ICD-10 Code(s)</TableCell>
                      <TableCell>
                        {icdCodes.map((value, index) => (
                          <Chip
                            label={value}
                            key={`${value}-${index}`}
                            variant="pill"
                            size="small"
                          />
                        ))}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Upcoming Visit</TableCell>
                      <TableCell>
                        <Moment
                          format="MM/DD/YYYY"
                          date={`${nextAppointment}`}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableStyled>
              </AccordionDetails>
            </Accordion>
            <Divider />
            <Accordion elevation={0} square defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ paddingLeft: 0 }}
              >
                <Typography variant="h2">Patient Responsibility</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                <Chip
                  label="$20 Copay"
                  variant="pill"
                  icon={<CheckCircleIcon />}
                />
                <Chip
                  label="Insurance Coverage"
                  variant="pill"
                  icon={<CheckCircleIcon />}
                />

                <TableStyled size="small" sx={{ mt: 2 }}>
                  <TableBody>
                    <TableRow>
                      <TableCell>Payer</TableCell>
                      <TableCell>{payer}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Member ID</TableCell>
                      <TableCell>{memberID}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Group ID</TableCell>
                      <TableCell>{groupID}</TableCell>
                    </TableRow>
                  </TableBody>
                </TableStyled>
              </AccordionDetails>
            </Accordion>
            <Divider sx={{ mt: 2, mb: 4 }} />
            <Typography variant="h2" sx={{ mb: 2 }}>
              Formally Accept New Patient
            </Typography>
            <Typography variant="h3">1. Assign a doctor</Typography>
            <FormControl sx={{ mt: 2, mb: 2, minWidth: '180px' }}>
              <CustomInputLabel htmlFor="role-select-label">
                Choose a Doctor
              </CustomInputLabel>
              <Select
                label="Choose a Doctor"
                size="small"
                value={doctor}
                onChange={(e) => {
                  setDoctor(e.target.value)
                  setInOffice(true)
                }}
              >
                <MenuItem value="Dr. Wolfe">DR. Wolfe</MenuItem>
                <MenuItem value="Dr. Petersen">DR. Petersen</MenuItem>
              </Select>
            </FormControl>
            <br />
            <br />
            <Typography variant="h3" sx={{ mb: 1 }}>
              2. Choose and activation option:
            </Typography>

            <Box sx={{ opacity: doctor || online ? '1.0' : '0.5' }}>
              <RadioGroup
                aria-label="activation-option"
                defaultValue="In-Office"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="In-Office"
                  control={
                    <Radio
                      onClick={() => {
                        setOnline(false)
                        setInOffice(true)
                      }}
                      disabled={!doctor && !online}
                    />
                  }
                  label="In-Office"
                />
                <Typography sx={{ fontSize: 'small', ml: 4, mt: -1 }}>
                  Schedule appointment, give device to patient in person, and
                  collect consent
                </Typography>
                <FormControlLabel
                  value="Online"
                  control={
                    <Radio
                      onClick={() => {
                        setOnline(true)
                        setInOffice(false)
                      }}
                      disabled={!doctor && !online}
                    />
                  }
                  label="Online"
                />
                <Typography sx={{ fontSize: 'small', ml: 4, mt: -1 }}>
                  Ship device + Aluna Registered RT will onboard patient.
                  <br />
                  <Checkbox
                    size="small"
                    name="consentCollected"
                    sx={{ padding: 0 }}
                    onClick={() => {
                      setPatientConsentCollected(!patientConsentCollected)
                    }}
                  />{' '}
                  Patient consent has been collected
                </Typography>
              </RadioGroup>
            </Box>

            <br />
            {/* TODO: clean this up/ move to styled component */}
            <Box
              sx={{
                display: 'flex',
                position: 'sticky',
                left: 0,
                right: 0,
                bottom: 0,
                background: 'white',
                pt: 2,

                pb: theme.spacing(2),

                borderTop: '1px solid #ccc',
                zIndex: 100,
              }}
            >
              <Button
                onClick={hideDrawer}
                variant="outlined"
                size="large"
                sx={{ mr: 1, flexGrow: 1 }}
              >
                Archive
              </Button>

              <LoadingButton
                type="submit"
                sx={{ flexGrow: 1 }}
                variant="contained"
                color="primary"
                size="large"
                disabled={
                  (!inOffice && !online) || (online && !patientConsentCollected)
                }
                onClick={handelToggleAcceptPatientsModal}
              >
                Accept
              </LoadingButton>

              <Dialog
                open={acceptPatientsModalOpen}
                onClose={handelToggleAcceptPatientsModal}
                // scroll={true}
                maxWidth="xs"
              >
                <DialogTitle
                  sx={{
                    pt: 6,
                    pr: theme.spacing(5),
                    pl: theme.spacing(5),
                    pb: theme.spacing(5),
                  }}
                >
                  <Typography variant="h1" component="div">
                    Patient Consent Must Be Obtained
                  </Typography>
                </DialogTitle>

                <DialogContent sx={{ pt: 1, pr: 4, pb: 3, pl: 5 }}>
                  <Typography sx={{ mb: 2 }}>
                    A patient must consent to the collection and transmission of
                    their health data via RPM tools.
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                    Patient consent may be given verbally or in writing and{' '}
                    <b>must be documented</b>.
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                    <b>
                      Until consent is collected, the patient will not be
                      activated.
                    </b>
                  </Typography>
                </DialogContent>
                <DialogActions sx={{ pt: 0, pr: 4, pb: 4, pl: 4 }}>
                  <Button
                    fullWidth
                    size="large"
                    onClick={() => {
                      hideDrawer()
                      handelToggleAcceptPatientsModal()
                    }}
                    variant="contained"
                  >
                    I Understand
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Form>
        </FormProvider>
      ) : (
        <FormProvider {...methodsIncompleteOrPending}>
          <Form
            noValidate
            method="post"
            onSubmit={methodsIncompleteOrPending.handleSubmit(
              onSubmitIncompleteOrPending
            )}
          >
            <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
              Personal Details
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <ControlledTextField
                name="firstName"
                sx={{ mr: 1 }}
                rules={{ required: 'first name required' }}
              />
              <ControlledTextField
                name="lastName"
                label="Last Name"
                rules={{ required: 'first name required' }}
              />
            </Box>

            <DateField name="dob" label="DOB" hightlightIfEmpty={true} />

            <Box sx={{ display: 'flex' }}>
              <ControlledTextField
                name="email"
                label="Email"
                sx={{ mr: 1 }}
                hightlightIfEmpty={true}
                rules={{
                  required: 'Email required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Entered value does not match email format',
                  },
                }}
              />

              <PhoneNumberField
                name="phone"
                label="Phone Number"
                hightlightIfEmpty={true}
              />
            </Box>

            <ControlledTextField
              name="emr"
              label="EMR Number"
              hightlightIfEmpty={true}
            />

            <Box sx={{ display: 'flex' }}>
              <ControlledTextField
                name="icdCodes"
                label="ICD-10 Code(s)"
                sx={{ mr: 1 }}
                hightlightIfEmpty={true}
              />

              <DateField
                name="nextAppointment"
                label="Next Appointment Date"
                hightlightIfEmpty={true}
              />
            </Box>

            <Divider sx={{ mt: 1 }} />
            <AddressFields
              type="home"
              showNotes={false}
              billingCheck={false}
              hightlightIfEmpty={true}
            />
            <Divider sx={{ mt: 1 }} />
            <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
              Insurance
            </Typography>

            <ControlledTextField
              name="payer"
              label="Payer"
              rules={{ required: 'insurer required' }}
              hightlightIfEmpty={true}
            />

            <PhoneNumberField name="payerPhone" label="Payer Phone Number" />

            <Box sx={{ display: 'flex' }}>
              <ControlledTextField
                name="memberID"
                label="Member ID"
                sx={{ mr: 1 }}
                rules={{ required: 'member ID required' }}
                hightlightIfEmpty={true}
              />

              <ControlledTextField
                name="label"
                label="Label"
                rules={{ required: 'member label required ie: "primary"' }}
                hightlightIfEmpty={true}
              />
            </Box>

            <ControlledTextField
              name="groupID"
              label="Group ID"
              sx={{ mb: 2 }}
              rules={{ required: 'group ID required' }}
              hightlightIfEmpty={true}
            />

            <Box
              sx={{
                display: 'flex',
                position: 'sticky',
                left: 0,
                right: 0,
                bottom: 0,
                background: 'white',
                pt: 2,

                pb: theme.spacing(2),

                borderTop: '1px solid #ccc',
                zIndex: 100,
              }}
            >
              <Button
                onClick={hideDrawer}
                variant="outlined"
                size="large"
                sx={{ mr: 1, flexGrow: 1 }}
              >
                Cancel
              </Button>

              <LoadingButton
                type="submit"
                sx={{ flexGrow: 1 }}
                variant="contained"
                color="primary"
                size="large"
              >
                Resubmit
              </LoadingButton>
            </Box>
          </Form>
        </FormProvider>
      )}
      {/* <pre style={{ fontSize: '10px' }}>{JSON.stringify(patient, null, 4)}</pre> */}
    </Box>
  )
}

export default PatientForm
