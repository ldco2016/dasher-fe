import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAppContext } from 'context'
import GeneralTable from 'components/table/GeneralTable'
import { Select, MenuItem, Button } from '@mui/material'
import { useTheme, styled } from '@mui/system'
import MultiSelectChip, {
  ChipCommonFilter,
} from 'components/forms/MultiSelectChip'
import moment from 'moment'
import Moment from 'react-moment'

const StyledSelect = styled(Select)`
  background-color: ${(props) => {
    // @ts-ignore
    return props.background
  }};
  color: white;
  height: 2rem;
  border: none;
  svg {
    color: white;
  }
`

const ProspectivePatients = () => {
  const theme = useTheme()

  const ProspectivePatientTestData = [
    {
      clinic: 'franks static test clinic',
      npi: 'test-npi',
      taxId: 'test-tax-id',
      fileName: 'test-file-name.csv',
      uploadDatetime: moment().utc().local().toString(),
      status: 'new',
    },
    {
      clinic: 'franks static test-2 clinic',
      npi: 'test-npi-2',
      taxId: 'test-tax-id-2',
      fileName: 'test-file-name-2.xls',
      uploadDatetime: moment().utc().local().toString(),
      status: 'inProgress',
    },
    {
      clinic: '03 franks static test clinic',
      npi: 'test-npi-03',
      taxId: 'test-tax-id-03',
      fileName: 'test-file-name-03.xls',
      uploadDatetime: moment().utc().local().toString(),
      status: 'Complete',
    },
  ]
  const { state, dispatch } = useAppContext()
  const [statusFilters, setStatusFilters] = useState<string[]>(['all'])

  useEffect(() => {
    dispatch({
      type: 'SET_PAGE_HEADING',
      payload: {
        pageHeading1: 'My Clinic',
        pageHeading2: 'New Patients',
      },
    })
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: 'Clinic',
        accessor: 'clinic',
      },
      {
        Header: 'NPI',
        accessor: 'npi',
      },
      {
        Header: 'Tax ID',
        accessor: 'taxId',
      },
      {
        Header: 'File',
        accessor: 'fileName',
      },
      {
        Header: 'Action',
        accessor: '',
        Cell: (data) => {
          return (
            <Button
              variant="outlined"
              onClick={() => alert('download not ready! (Still in dev)')}
            >
              Download
            </Button>
          )
        },
      },
      {
        Header: 'Upload Time',
        accessor: 'uploadDatetime',
        Cell: (data) => <Moment format={'MM/DD/YYYY'}>{data.value}</Moment>,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: (data) => {
          const dataStatus = data.value
          const bgColor =
            dataStatus === 'Complete'
              ? theme.palette.success.main
              : dataStatus === 'inProgress'
              ? theme.palette.primary.main
              : theme.palette.vibrantOrange.main

          return (
            <StyledSelect
              value={dataStatus}
              onChange={() => {}}
              // @ts-ignore
              background={bgColor}
            >
              <MenuItem value={'new'}>New</MenuItem>
              <MenuItem value={'inProgress'}>In Progress</MenuItem>
              <MenuItem value={'Complete'}>Completed</MenuItem>
            </StyledSelect>
          )
        },
        filter: (rows, id, filterValue) => {
          return rows.filter(
            (row) =>
              filterValue.includes(row.original.status) ||
              filterValue.includes('all')
          )
        },
      },
    ],
    []
  )
  const handleChangeStatusFilter = (
    event: any,
    child: ReactElement,
    deleteValue: string
  ) => {
    ChipCommonFilter(event, child, deleteValue, setStatusFilters, statusFilters)
  }

  return (
    <>
      <GeneralTable
        columns={columns}
        data={ProspectivePatientTestData}
        checkRows={false}
        rowLinkOnClick={() => false}
        enableGlobalFilter={false}
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
              options={['new', 'inProgress', 'Complete', 'all']}
              selectedValues={statusFilters}
              handleChange={handleChangeStatusFilter}
            />
          </>
        }
      />
    </>
  )
}

ProspectivePatients.layout = 'fullScreen'
ProspectivePatients.auth = true
export default ProspectivePatients
