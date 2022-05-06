import React from 'react'
import { InfoTooltip } from 'components'
import { format } from 'date-fns'
import { BASELINE_COPY } from '../../../constants'
import { Chip } from '@mui/material'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'

export const PatientsTableColumns = (customSortBy) => {
  return [
    {
      Header: 'Name',
      accessor: (val) =>
        (val?.name || '')
          .split(/\s+/gi)
          .map((word) => word.trim())
          .filter((word) => word.length !== 0)
          .reverse()
          .join(', '),
    },

    {
      Header: <>Patient ID</>,
      accessor: 'pui',
    },
    {
      Header: <>Provider</>,
      accessor: 'provider',
      sortInverted: true,
      filter: (rows, _, filterValue) =>
        rows.filter(
          (row) =>
            `${filterValue}` === row.original.provider ||
            filterValue.includes('All Providers')
        ),
    },
    {
      Header: (
        <>
          DOB <small>MM/DD/YYYY</small>
        </>
      ),
      accessor: 'dob',
      Cell: ({ cell: { value } }) => format(new Date(value), 'MM/dd/yyyy'),
    },

    {
      Header: (
        <>
          Asthma Control <small>Last 7 days</small>
        </>
      ),

      accessor: 'asthmaControl',
      sortInverted: true,
      sortType: customSortBy,

      filter: (rows, id, filterValue) =>
        rows.filter(
          (row) =>
            filterValue.includes(row.original.asthmaControl) ||
            filterValue.includes('all')
        ),

      Cell: ({ cell: { value } }) => {
        const variant: any =
          (value === 'poor' && 'warning') ||
          (value === 'good' && 'default') ||
          (value === 'veryPoor' && 'error')

        return value ? (
          <Chip
            icon={variant === 'error' ? <WarningAmberOutlinedIcon /> : null}
            label={value.replace(/([A-Z])/g, ' $1').trim()}
            variant={variant}
          />
        ) : (
          '--'
        )
      },
    },
    {
      Header: (
        <span>
          FEV1 Baseline <InfoTooltip content={BASELINE_COPY} />
        </span>
      ),
      accessor: 'fev1Baseline',
      Cell: ({ cell: { value } }) => {
        return <>{value || '--'}</>
      },
      sortInverted: true,
      sortType: customSortBy,
    },
    {
      Header: (
        <>
          Aluna used <small>Days ago</small>
        </>
      ),
      accessor: 'lastUsed',
      sortInverted: true,
      sortType: customSortBy,
      Cell: ({ cell: { value } }) => {
        return value
      },
    },
  ]
}
