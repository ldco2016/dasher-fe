import React, { useEffect, useState, useMemo } from 'react'
import { Paper, Button } from '@mui/material'
import { LinearLoader } from 'components/loaders'
import GeneralTable from 'components/table/GeneralTable'

import AddIcon from '@mui/icons-material/Add'

import CreateClinic from 'components/clinics/CreateClinic'
import AddStaff from 'components/clinics/AddStaff'
import { lighten } from '@mui/system'
import { useTheme } from '@mui/material/styles'

import Drawer from 'components/Drawer'
import useClinics from 'hooks/useClinics'
import { mutate } from 'swr'
import env from '@beam-australia/react-env'

import { useAppContext } from 'context'

function Clinics() {
  const [clinicDrawerOpen, setClinicDrawerOpen] = useState(false)
  const [staffOpen, setStaffOpen] = useState(false)
  const [activeClinic, setActiveClinic] = useState(null)
  const { clinics, isLoading, isError } = useClinics()
  const theme = useTheme()
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    dispatch({
      type: 'SET_PAGE_HEADING',
      payload: {
        pageHeading1: `Clinics`,
        pageHeading2: `${clinics?.length ? `(${clinics.length})` : ''}`,
      },
    })
  }, [clinics])

  const handleToggleStaff = (clinic) => {
    setActiveClinic(clinic)
    setStaffOpen(!staffOpen)
  }

  const rowLinkOnClick = (clinic) => {
    handleToggleStaff(clinic)
  }

  const handleToggleClinicDrawer = () => {
    setClinicDrawerOpen(!clinicDrawerOpen)
  }

  const optimisticallyUpdateClinics = (newClinic) => {
    mutate(
      `${env('PUBLIC_ALUNA_API')}/organizations`,
      [...clinics, newClinic],
      true
    )
  }

  const hideClinicDrawer = () => {
    // hide the clinic creation modal
    setClinicDrawerOpen(false)
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Clinic Name',
        accessor: 'name',
      },
      {
        Header: 'Phone #',
        accessor: 'phone',
      },
      {
        Header: (
          <>
            Staff <small>Active/Pending</small>
          </>
        ),
        accessor: 'healthWorkers',
        Cell: (data) => {
          const { healthWorkers } = data.row.original
          const active = healthWorkers.reduce(
            (n, worker) => n + (worker.invitationCompletedOn !== undefined),
            0
          )
          return `${active}/${healthWorkers.length - active}`
        },
      },
      {
        Header: 'Actions',
        minWidth: 170,
        Cell: (data) => {
          return (
            <>
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleStaff(data.row.original)
                }}
              >
                Add Staff
              </Button>
            </>
          )
        },
      },
    ],
    []
  )

  if (isError) return <div>failed to load</div>
  if (isLoading) return <LinearLoader />

  return (
    <Paper elevation={0} square>
      <Drawer
        open={clinicDrawerOpen}
        handleToggleDrawer={handleToggleClinicDrawer}
        anchor="right"
      >
        {clinicDrawerOpen && (
          <CreateClinic
            hideDrawer={hideClinicDrawer}
            optimisticallyUpdateClinics={optimisticallyUpdateClinics}
          />
        )}
      </Drawer>

      <Drawer
        open={staffOpen}
        handleToggleDrawer={handleToggleStaff}
        anchor="right"
      >
        {staffOpen && <AddStaff clinic={activeClinic} />}
      </Drawer>

      <GeneralTable
        checkRows={false}
        columns={columns}
        data={clinics}
        rowLinkOnClick={rowLinkOnClick}
        getRowProps={(row) => {
          return {
            style: {
              background:
                row.original.highlight &&
                lighten(theme.palette.warning.light, 0.5),
            },
          }
        }}
        primaryAction={
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleToggleClinicDrawer}
            startIcon={<AddIcon />}
            data-cy="add-clinic"
          >
            Add Clinic
          </Button>
        }
      />
    </Paper>
  )
}

Clinics.layout = 'fullScreen'
Clinics.auth = 'true'
export default Clinics
