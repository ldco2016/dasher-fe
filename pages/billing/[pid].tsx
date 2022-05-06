import React, { useEffect, useContext, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import BillingDetailsTable from 'components/table/billing/BillingDetailsTable'
import { useTheme } from '@mui/material/styles'
import { Button, Grid, Typography, Checkbox } from '@mui/material'
import fetch from 'libs/fetch'
import Moment from 'react-moment'
import GetAppIcon from '@mui/icons-material/GetApp'
import CopyButton from 'components/table/components/CopyButton'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { IBill } from 'types'
import { LinearLoader } from 'components/loaders'
import { useAppContext } from 'context'

function Bill() {
  const router = useRouter()
  const { pid } = router.query
  const { state, dispatch } = useAppContext()
  const theme = useTheme()

  // TODO: when/if this component is added back into the UI
  // use the new token fetching hook:
  // const { data, error } = useSWRWithToken(`/api/endpoint`)
  const { data, error } = useSWR<IBill>(`/api/billing/${pid}`, fetch)

  useEffect(() => {
    dispatch({
      type: 'SET_PAGE_HEADING',
      payload: {
        pageHeading1: `Billing`,
        pageHeading2: `${data?.firstName} ${data?.lastName}`,
      },
    })
  }, [data])

  const columns = useMemo(
    () => [
      {
        // Build our expander column
        id: 'expander', // Make sure it has an ID
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </span>
        ),
        Cell: ({ row }) =>
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  // We can even use the row.depth property
                  // and paddingLeft to indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`,
                },
              })}
            >
              {row.isExpanded ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </span>
          ) : null,
      },
      {
        Header: 'Proceedure',
        cells: 3,
        accessor: 'proceedure',
        Cell: ({ row }) => {
          return (
            <>
              {row.original.proceedure?.length && (
                <Typography variant="h3" sx={{ minWidth: 85 }}>
                  {row.original.proceedure}
                  <CopyButton tooltipText="Copy Row" copyArea="row" />
                </Typography>
              )}
            </>
          )
        },
      },
      {
        Header: 'Cycle Length',
        accessor: 'cycleLength',
        Cell: ({ row }) => {
          return (
            <>
              {row.original.cycleLength?.length && (
                <>
                  <Typography variant="body2" display="inline">
                    {row.original.cycleLength}
                  </Typography>
                  <CopyButton
                    tooltipText={`Copy: ${row.original.cycleLength}`}
                  />
                </>
              )}
            </>
          )
        },
      },
      {
        Header: (
          <>
            Time spent<small>min/sec</small>
          </>
        ),
        accessor: 'timeSpent',
        Cell: ({ row }) => {
          return (
            <>
              {row.original.timeSpent}
              <CopyButton tooltipText={`Copy: ${row.original.timeSpent}`} />
            </>
          )
        },
      },
      {
        Header: 'Notes',
        accessor: 'notes',
        Cell: ({ row }) => {
          return typeof row.original.notes === 'string' ? (
            <>
              {row.original.notes}
              <CopyButton tooltipText={'Copy notes'} />
            </>
          ) : (
            <div style={{ maxWidth: '600px' }}>
              {row.original.notes.name} |{' '}
              <Typography variant="body2" display="inline">
                {row.original.notes.date}
              </Typography>{' '}
              <Typography variant="body1" display="inline">
                {row.original.notes.notes}
              </Typography>
              <CopyButton tooltipText={'Copy notes'} />
            </div>
          )
        },
      },
      {
        Header: 'Status',
        accessor: 'submitted',
        Cell: ({ row }) => {
          return (
            <>
              {/* Only show the submitted checkbox on the top row */}
              {row.depth === 0 && (
                <div
                  style={{
                    minWidth: '110px',
                  }}
                >
                  <Checkbox
                    sx={{ pl: 0, pt: 0, pb: 0 }}
                    checked={row.original.submitted ? true : false}
                    inputProps={{
                      'aria-label': 'uncontrolled-checkbox',
                    }}
                  />
                  <span
                    style={{
                      color: `${
                        row.original.submitted
                          ? theme.palette.grey[900]
                          : theme.palette.grey[600]
                      }`,
                    }}
                  >
                    Submitted
                  </span>
                </div>
              )}
            </>
          )
        },
      },
    ],
    []
  )

  if (error) return <div>failed to load billing data</div>
  if (!data) return <LinearLoader />

  return (
    <>
      <Grid container spacing={2} sx={{ padding: theme.spacing(4) }}>
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h2" display="inline" sx={{ mr: 1 }}>
                {data.firstName} {data.lastName}{' '}
              </Typography>
              {/* <Chip
                icon={data.provider ? <CheckCircleIcon /> : <CancelIcon />}
                variant="pill"
                label={data.provider ? 'Insurance Coverage' : 'No Insurance'}
              />

              {data.provider && (
                <Chip
                  icon={<CheckCircleIcon />}
                  variant="pill"
                  label={`${data.insurerCopayAmount} Copayment Required`}
                />
              )} */}
            </Grid>
            {/* <Grid item xs={6} md={3}>
              <Typography variant="body2">Insurance Provider</Typography>
              <Typography variant="body1">{data.provider}</Typography>
            </Grid> */}
            {/* <Grid item xs={6} md={3}>
              <Typography variant="body2">Insurance ID</Typography>
              <Typography variant="body1">{data.insuranceId}</Typography>
            </Grid> */}
            <Grid item xs={6} md={3}>
              <Typography variant="body2">DOB</Typography>
              <Typography variant="body1">
                <Moment format="MM/DD/YYYY" date={data.DOB}></Moment>
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">Physician</Typography>
              <Typography variant="body1">{data.physician}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => alert('download report')}
            startIcon={<GetAppIcon />}
          >
            Download Report
          </Button>
        </Grid>
      </Grid>
      <BillingDetailsTable
        columns={columns}
        data={data.billingItems}
        toolbar={false}
      />
    </>
  )
}

Bill.layout = 'fullScreen'
Bill.auth = 'true'

export default Bill
