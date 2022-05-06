import { Switch, Box } from '@mui/material'
import { format, differenceInDays } from 'date-fns'
import { InfoTooltip } from 'components'

const billingTableColumns = (isLargeScreen) => {
  return [
    {
      Header: `Name ${!isLargeScreen ? '/ DOB' : ''}`,
      acessor: 'name',
      disableSortBy: false,
      Cell: (data) => (
        <>
          <b>{data.row.original.lastName}</b>
          ,&nbsp;{data.row.original.firstName} <br />
          {!isLargeScreen &&
            format(new Date(data.row.original.dob), 'MM/dd/yyyy')}
        </>
      ),
    },
    {
      Header: (
        <>
          DOB<small>mm/dd/yy</small>
        </>
      ),
      accessor: 'dob',
      Cell: ({ cell: { value } }) => format(new Date(value), 'MM/dd/yyyy'),
    },
    {
      Header: (
        <>
          Readings<small>days</small>
        </>
      ),
      accessor: 'readings',
      Cell: ({ cell: { value } }) => (value ? value : '-'),
    },
    {
      Header: (
        <>
          DOS<small>mm/dd/yy</small>
        </>
      ),
      accessor: 'dos',
      Cell: ({ cell: { value } }) => format(new Date(value), 'MM/dd/yyyy'),
    },

    {
      Header: (
        <>
          <Box sx={{ minWidth: '70px' }}>Time spent</Box>
          <small>min:sec</small>
        </>
      ),
      accessor: 'timeSpent',
      Cell: ({ cell: { value } }) => (value ? value : '-'),
    },
    {
      Header: 'Codes',
      accessor: 'codes',
      disableSortBy: true,
      Cell: (data) => {
        let counter99458 = 0
        let uiArray = data.row.original.codes
          .map((code) => {
            if (code === 99458) ++counter99458
            return code
          })
          .filter((value, index, self) => self.indexOf(value) === index)

        if (uiArray.indexOf(99458) !== -1)
          uiArray[uiArray.indexOf(99458)] = `99458 (x${counter99458})`

        return uiArray.join(', ')
      },
    },
    {
      Header: 'Units',
      accessor: 'units',
      disableSortBy: true,
    },
    {
      Header: (
        <>
          <Box sx={{ minWidth: '88px' }}>
            Record Age{' '}
            <InfoTooltip content="Number of days that have elapsed since the record populated on the table" />
          </Box>

          <small>days</small>
        </>
      ),
      accessor: 'createdOn',
      Cell: ({ cell: { value } }) => {
        const originalDate = new Date(value).getTime()
        const now = new Date().getTime()
        return differenceInDays(now, originalDate)
      },
    },
    {
      Header: 'Claimed',
      accessor: 'claimed',
      disableSortBy: true,
      Cell: (data) => <Switch checked={data.row.original.claimed} />,
    },
  ]
}

export default billingTableColumns
