import React from 'react'
import { IClinic } from 'types'

function Clinic({ name, poi, users }: IClinic) {
  return <>Clinic Detail</>
}

Clinic.layout = 'fullScreen'
Clinic.auth = 'true'

export default Clinic
