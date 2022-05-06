import React, { useEffect, useState } from 'react'
import { LinearProgress, Button } from '@mui/material'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useAppContext } from 'context'
import Snackbar from 'components/Snackbar'
import BillingGuide from 'components/billing/BillingGuide'
import Fetch from 'libs/fetch'
import BillingTable from 'components/billing/BillingTable'
import { BillingItem } from 'types/'

function Billing() {
  const [snackbarVisible, setSnackbarVisible] = useState(true)
  const router = useRouter()

  if (!router.query.billing) {
    router.push('/')
    // Return empty string prevents unwanted flash of billing view
    return ''
  }

  const { dispatch } = useAppContext()
  const [billingGuideOpen, setBillingGuideOpen] = useState(false)

  const {
    data: billingList,
    error: billingTableError,
    mutate,
  } = useSWR<BillingItem[]>('/api/billing', Fetch)

  useEffect(() => {
    dispatch({
      type: 'SET_PAGE_HEADING',
      payload: {
        pageHeading2: `Billing`,
        component: (
          <Button
            variant="outlined"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => setBillingGuideOpen(!billingGuideOpen)}
          >
            Billing Guide
          </Button>
        ),
      },
    })
  }, [billingList])

  const handleCloseDialog = (): void => {
    setBillingGuideOpen(false)
  }

  if (!billingList) return <LinearProgress color="secondary" />

  return (
    <>
      <BillingGuide open={billingGuideOpen} onClose={handleCloseDialog} />

      <BillingTable
        billingList={billingList}
        billingTableError={billingTableError}
      />

      <Snackbar
        severity="info"
        title="Action Required"
        open={snackbarVisible}
        description="A patient has just become billable. To view new record(s), please reload
        the billing table."
        action={{
          url: 'Reload Table',
          method: () => {
            setSnackbarVisible(false)
            mutate()
          },
        }}
      />
    </>
  )
}

Billing.layout = 'fullScreen'
Billing.auth = 'true'

export default Billing
