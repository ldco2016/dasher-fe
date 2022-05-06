// @ts-nocheck
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'

function usePermissions() {
  const [permissions, setPermissions] = useState(null)
  const [session] = useSession()

  // All permission types
  const [quickStart, setQuickStart] = useState(false)
  const [briefIntro, seBriefIntro] = useState(false)
  const [cheatSheet, setCheatSheet] = useState(false)
  const [totalClinics, setTotalClinics] = useState(false)
  const [asthmaControl, setAsthmaControl] = useState(false)
  const [revenueProjection, setRevenueProjection] = useState(false)
  const [revenueStats, setRevenueStats] = useState(false)
  const [addNewPatient, setAddNewPatient] = useState(false)
  const [searchPatient, setSearchPatient] = useState(false)
  const [permissionPublicUserId, setPermissionPublicUserId] = useState(false)
  const [billablePatientsCounter, setBillablePatientsCounter] = useState(false)

  useEffect(() => {
    setPermissions(session?.user?.componentPermissions)

    setQuickStart(allow('armada.mainView.quickStartGuide.section'))
    seBriefIntro(allow('armada.mainView.aBriefIntroduction.section'))
    setCheatSheet(allow('armada.mainView.accessTheCheatSheet.section'))
    setTotalClinics(allow('armada.patients.thisWeek.InOfficeOnboards.counter'))
    setAsthmaControl(allow('armada.mainView.stats.asthmaControl.section'))
    setRevenueProjection(
      allow('armada.mainView.stats.revenewProjection.section')
    )
    setRevenueStats(allow('armada.mainView.stats.revenewStats.section'))
    setAddNewPatient(allow('armada.patients.addNewPatient.button'))
    setPermissionPublicUserId(allow('armada.users.publicUserId.label'))
    setBillablePatientsCounter(
      allow('armada.patients.lastLogin.newBillablePatients.counter')
    )
  }, [])

  const allow = (permission) =>
    session?.user?.componentPermissions?.includes(permission) || false // Be determinant.

  return {
    permissions,
    quickStart,
    briefIntro,
    cheatSheet,
    totalClinics,
    asthmaControl,
    revenueProjection,
    revenueStats,
    addNewPatient,
    searchPatient,
    permissionPublicUserId,
    billablePatientsCounter,
  }
}

export default usePermissions
