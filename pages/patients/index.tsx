import React, { useEffect } from 'react'
import PatientsTable from 'components/patients/PatientsTable'
import useSWRWithToken from 'hooks/useSWRWithToken'
import Feedback from 'components/feedback'

function Patients(props) {
  const { data: patientsList, error: patientsListError } =
    useSWRWithToken('/patients')
  const { page, rowsPerPage, onRowsPerPage, onPageChange } = props

  useEffect(() => {
    console.log(localStorage.patientsList)
    if (localStorage.patientsList) {
      const options = JSON.parse(localStorage.patientsList)
      if (options.page) onPageChange(options.page)
      if (options.rowsPerPage) onRowsPerPage(options.onRowsPerPage)
    }
  }, [])

  useEffect(() => {
    function setLocalKey(key, value) {
      localStorage.setItem(key, JSON.stringify(value))
    }

    const { patientsList } = localStorage

    console.log({ patientsList })

    // If this key exists, we need to compare it against state
    if (patientsList) {
      const options = JSON.parse(localStorage.patientsList)
      if (options.rowsPerPage !== rowsPerPage || options.page !== page) {
        setLocalKey(`patientsList`, {
          rowsPerPage: options.rowsPerPage,
          page: options.page,
        })
      }
      // otherwise we are setting them for the first time
    } else {
      setLocalKey('patientsList', { rowsPerPage, page })
    }
  }, [page, rowsPerPage, onRowsPerPage, onPageChange])

  return (
    <>
      <Feedback />
      <PatientsTable
        patientsList={patientsList}
        patientsListError={patientsListError}
      />
    </>
  )
}

Patients.layout = 'fullScreen'
Patients.auth = true
export default Patients
