import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import useSWR from 'swr'
import { useAppContext } from 'context'
import fetch from 'libs/fetch'
import GeneralTable from 'components/table/GeneralTable'
import { Typography, Chip, Box, Button, Tooltip } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import InfoIcon from '@mui/icons-material/Info'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import Moment from 'react-moment'
import MultiSelectChip, {
  ChipCommonFilter,
} from 'components/forms/MultiSelectChip'
import Theme from 'constants/theme'
import Drawer from 'components/Drawer'
import PatientForm from 'components/my-clinic/PatientForm'

const AcceptPatients = () => {
  // TODO: when/if this component is added back into the UI
  // use the new token fetching hook:
  // const { data, error } = useSWRWithToken(`/api/endpoint`)
  const { data: myClinicPatients = [], mutate } = useSWR<any>(
    `/api/my-clinic/`,
    fetch
  )

  const [patientDrawerOpen, setPatientDrawerOpen] = useState(false)
  const [activePatient, setActivePatient] = useState(false)
  const [statusFilters, setStatusFilters] = useState<string[]>(['all'])
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    dispatch({
      type: 'SET_PAGE_HEADING',
      payload: {
        pageHeading1: 'My Clinic',
        pageHeading2: 'Accept Patients',
      },
    })
  }, [])

  const handleTogglePatientDrawer = () => {
    setPatientDrawerOpen(!patientDrawerOpen)
  }

  const handleChangeStatusFilter = (
    event: any,
    child: ReactElement,
    deleteValue: string
  ) => {
    ChipCommonFilter(event, child, deleteValue, setStatusFilters, statusFilters)
  }

  const handleTogglePatient = (patient) => {
    setActivePatient(patient)
    setPatientDrawerOpen(!patientDrawerOpen)
  }

  const rowLinkOnClick = (patient) => {
    handleTogglePatient(patient)
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: (row) => `${row.firstName} ${row.lastName}`,
        Cell: (data) =>
          `${data.row.original.firstName} ${data.row.original.lastName}`,
      },
      {
        Header: 'EMR Number',
        accessor: 'emr',
      },
      {
        Header: 'Status',
        accessor: 'status',
        filter: (rows, id, filterValue) => {
          return rows.filter((row) => {
            return (
              filterValue.includes(row.original.status) ||
              filterValue.includes('all')
            )
          })
        },
        Cell: (data) => {
          switch (data.row.original.status) {
            case 'Verified':
              return (
                <Chip
                  label={`${data.row.original.status}`}
                  icon={<CheckIcon />}
                  variant="pillSuccess"
                />
              )
            case 'Incomplete':
              return (
                <Tooltip title={data.row.original.tip} placement="top" arrow>
                  <Chip
                    label={`${data.row.original.status}`}
                    icon={<ErrorOutlineOutlinedIcon />}
                    variant="pillWarning"
                  />
                </Tooltip>
              )

            default:
              return data.row.original.status
          }
        },
      },
      {
        Header: (
          <>
            <span>
              Copay Tier{' '}
              <Tooltip
                title={
                  <Box
                    sx={{
                      p: 1,
                      maxWidth: '230px',
                      color: 'inherit',
                      textAlign: 'center',
                      fontSize: 'small',
                    }}
                  >
                    <Typography
                      sx={{ color: 'inherit', fontSize: 'inherit', mb: 1 }}
                    >
                      A patient's tier is determined by the amount of money they
                      would need to pay monthly for Aluna. Tier 0 = no payment
                    </Typography>

                    <Typography sx={{ color: 'inherit', fontSize: 'inherit' }}>
                      Tier 1 = $1-$30 <br />
                      Tier 2 = $31-$60 <br />
                      Tier 3 = $61+ Tier <br />4 = Not Covered
                    </Typography>
                  </Box>
                }
                placement="top"
                arrow
              >
                <InfoIcon
                  sx={{
                    verticalAlign: 'middle',
                    display: 'inline-block',
                    width: '18px',
                    color: Theme.palette.brightBlue.main,
                  }}
                />
              </Tooltip>
            </span>
          </>
        ),
        accessor: 'copayTier',
      },
      {
        Header: 'Submitted',
        accessor: 'submitted',
        Cell: (data) => (
          <Moment
            format="MM/DD/YYYY"
            date={`${data.row.original.submitted}`}
          ></Moment>
        ),
      },
      {
        Header: 'Next Appointment',
        accessor: 'nextAppointment',
        Cell: (data) => (
          <Moment
            format="MM/DD/YYYY"
            date={`${data.row.original.nextAppointment}`}
          ></Moment>
        ),
      },
      {
        Header: 'Action',
        Cell: (data) => {
          return data.row.original.status === 'Verified' ? (
            <Button variant="contained" size="small">
              Review
            </Button>
          ) : (
            <Button variant="outlined" size="small">
              Edit
            </Button>
          )
        },
      },
    ],
    []
  )

  return (
    <>
      <Box sx={{ m: 6, mb: 0 }}>
        <Typography variant="h1">Accept Verified Patients</Typography>
        <Typography variant="body1" component="div" sx={{ mt: 3 }}>
          You have <Chip label="2 verified" variant="success" /> patients.
          Assign them to a doctor and choose a method of activation.
        </Typography>
      </Box>

      <Drawer
        open={patientDrawerOpen}
        handleToggleDrawer={handleTogglePatientDrawer}
        anchor="right"
      >
        {patientDrawerOpen && (
          <PatientForm
            patient={activePatient}
            hideDrawer={handleTogglePatientDrawer}
          />
        )}
      </Drawer>

      <GeneralTable
        columns={columns}
        data={myClinicPatients}
        checkRows={false}
        rowLinkOnClick={rowLinkOnClick}
        filterPlaceholderText="Search by name, EMR Number, status, copay tier, payer, submitted, and next appointment date"
        // TODO: make this generic and more flexible

        filters={[
          {
            column: 'status',
            options: statusFilters,
          },
        ]}
        leftHeaderContent={
          <>
            <MultiSelectChip
              labelText="Status"
              options={['Verified', 'Incomplete', 'Pending', 'all']}
              selectedValues={statusFilters}
              handleChange={handleChangeStatusFilter}
            />
          </>
        }
      />
    </>
  )
}

AcceptPatients.layout = 'fullScreen'
AcceptPatients.auth = true
export default AcceptPatients
