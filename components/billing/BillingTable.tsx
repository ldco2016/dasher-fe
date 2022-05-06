import React, { useState, useMemo } from 'react'
import { Button, useMediaQuery } from '@mui/material'
import GeneralTable from 'components/table/GeneralTable'
import GeneralSelect from 'components/forms/GeneralSelect'
import GetAppIcon from '@mui/icons-material/GetApp'
import billingTableColumns from 'components/billing/billingTableColumns'
import { useTheme } from '@mui/material/styles'
import { IBillingTable } from 'types/'

type ClaimedFilter = 'Claimed' | 'Unclaimed' | 'All'

const BillingTable = ({ billingList, billingTableError }: IBillingTable) => {
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'))
  const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'))

  const [claimedFilter, setClaimedFilter] = useState<ClaimedFilter>('All')

  const handleSetClaimedFilter = (event) => {
    console.log('val: ', event.target.value)
    setClaimedFilter(event.target.value)
  }

  const columns = useMemo(
    () => billingTableColumns(isLargeScreen),
    [isLargeScreen]
  )

  if (billingTableError) return <div>Failed to load billing table.</div>

  return (
    <GeneralTable
      columns={columns}
      data={billingList}
      enablePagination={false}
      leftContent={
        <GeneralSelect
          label="Filter"
          value={claimedFilter}
          options={['Claimed', 'Unclaimed', 'All']}
          handleChange={handleSetClaimedFilter}
        />
      }
      rightContent={
        <Button
          variant="contained"
          color="primary"
          onClick={() => alert('download report')}
          startIcon={<GetAppIcon />}
        >
          Download {isMediumScreen && 'Details'}
        </Button>
      }
      filterPlaceholderText="Search"
      initialState={{
        hiddenColumns: isLargeScreen ? [] : ['dob', 'units'],
      }}
      rightContentBehavior={'enableOnSelect'}
    />
  )
}
export default BillingTable
