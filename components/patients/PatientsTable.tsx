import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactChild,
} from 'react'
import { Paper } from '@mui/material'
import { LinearLoader } from 'components/loaders'
import { useRouter } from 'next/router'
import GeneralTable from 'components/table/GeneralTable'
import { parseInt, isNil } from 'lodash'
import MultiSelectChip, {
  ChipCommonFilter,
} from 'components/forms/MultiSelectChip'
import usePermissions from 'hooks/usePermissions'
import { differenceInDays } from 'date-fns'

import { useAppContext } from 'context'

import { PatientsTableColumns } from 'components/table/patients/PatientsTableColumns'
import ProviderSelect from 'components/patients/ProviderSelect'

// TODO: declare interface types
interface IPatientList {
  patientsList: any
  patientsListError?: any
}

function PatientsTable({
  patientsList = null,
  patientsListError,
}: IPatientList) {
  const router = useRouter()
  const { state, dispatch } = useAppContext()
  const { controlLevelFilters, selectedProviderFilter } = state.patientSearch
  const [providerList, setProviderList] = useState<Array<string>>([])

  const [dataParsed, setDataParsed] = useState([])
  const [controlFilterOptions, setControlFilterOptions] = useState(['all'])
  const [scroll, setScroll] = useState(false)
  const { permissionPublicUserId }: { permissionPublicUserId: boolean } =
    usePermissions()

  const setControlLevelFilters = (value: string[]) => {
    dispatch({
      type: 'SET_CONTROL_LEVEL_FILTERS',
      payload: {
        controlLevelFilters: value,
      },
    })
  }
  const setSelectedProviderFilter = (provider: string) => {
    console.log('provider: ', provider)
    dispatch({
      type: 'SET_SELECTED_PROVIDER_FILTER',
      payload: {
        selectedProviderFilter: provider,
      },
    })
  }

  const setSortState = (memoColumn: string, memoDirection: string) => {
    dispatch({
      type: 'SET_PATIENT_TABLE_SORT',
      payload: {
        columnName: memoColumn,
        direction: !memoDirection ? 'asc' : 'desc',
      },
    })
  }

  const handleChangeControlLevelFilter = (
    event: any,
    child: ReactChild,
    deleteValue: string
  ) => {
    ChipCommonFilter(
      event,
      child,
      deleteValue,
      setControlLevelFilters,
      controlLevelFilters
    )
  }

  useEffect(() => {
    dispatch({
      type: 'SET_PAGE_HEADING',
      payload: {
        pageHeading1: 'Patients',
        pageHeading2: `${
          patientsList?.length ? `(${patientsList.length})` : ''
        }`,
      },
    })
  }, [patientsList])

  useEffect(() => {
    // Build up a list of patient objects which our table can traverse
    const dataParsed = patientsList?.map((row) => {
      !isNil(row.doctorDto) &&
        setProviderList((previousProviderList) => [
          ...previousProviderList,
          `${row.doctorDto.firstName} ${row.doctorDto.lastName}`,
        ])

      const reportedDate = row.scalarReports.filter(
        (obj) => obj.name === 'lastUseInDays'
      )[0]?.reportedOn

      const diffDate: number = Math.abs(
        differenceInDays(new Date(reportedDate), new Date())
      )
      const lastUsed: string | number =
        diffDate > 7
          ? diffDate
          : diffDate === 0 && !isNil(reportedDate)
          ? 'Today'
          : isNil(reportedDate)
          ? '--'
          : diffDate

      return {
        pui: row.pui,
        provider: !isNil(row.doctorDto)
          ? `${row.doctorDto.firstName} ${row.doctorDto.lastName}`
          : '',
        name: `${row.firstName} ${row.lastName}`,
        dob: row.dob,
        asthmaControl: row.scalarReports.filter(
          (obj) => obj.name === 'asthmaControl'
        )[0]?.value,
        lastUsed,
        fev1Baseline: row.scalarReports.filter(
          (obj) => obj.name === 'fevBaseLine'
        )[0]?.value,
      }
    })
    setDataParsed(dataParsed)
  }, [patientsList])

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 50)
    })
  }, [])

  useEffect(() => {
    if (dataParsed) {
      setControlFilterOptions([
        'all',
        ...(dataParsed.find((patient) => patient.asthmaControl === 'good')
          ? ['good']
          : []),
        ...(dataParsed.find((patient) => patient.asthmaControl === 'poor')
          ? ['poor']
          : []),
        ...(dataParsed.find((patient) => patient.asthmaControl === 'veryPoor')
          ? ['veryPoor']
          : []),
      ])
    }
  }, [dataParsed])

  const handleSelectProvider = (provider) => setSelectedProviderFilter(provider)

  const isToday = (val) => val === 'Today' || val === 'today'
  const isInactive = (val) => val === 'Inactive' || val === 'inactive'
  const isDash = (val) => isNil(val) || val === '--'
  const isAsthmaControl = (val) => {
    const _val = val?.toString().toLowerCase()
    let result: Number | boolean = false
    switch (_val) {
      case 'verypoor':
        result = 1
        break
      case 'poor':
        result = 2
        break
      case 'good':
        result = 3
        break
      default:
        result = false
    }
    return result
  }

  const CustomSortBy = useCallback(
    (rowA, rowB, colId, direction) => {
      const convertValue = (val) => {
        if (isToday(val)) return 0 //Today != 1
        if (isInactive(val)) return direction === false ? -2 : 29999
        if (isDash(val)) return direction === false ? -3 : 30000

        const acResult = isAsthmaControl(val) //so we don't call it twice
        if (acResult) return acResult

        return parseInt(val)
      }

      const v1 = convertValue(rowA.values[colId])
      const v2 = convertValue(rowB.values[colId])
      return v1 >= v2 ? 1 : -1 // Direction var doesn't matter.
    },
    [patientsList, isToday, isInactive, isDash]
  )

  const columns = useMemo(() => PatientsTableColumns(CustomSortBy), [])

  const rowLinkOnClick = (patient) => {
    router.push(`/patients/${patient.pui}`)
  }

  // TODO put better error here
  if (patientsListError) return <div>Failed to load patients list</div>

  if (!patientsList) return <LinearLoader />

  return (
    <Paper elevation={0} square>
      {patientsList && dataParsed && (
        <GeneralTable
          retainSortState={true}
          sortStateRecorder={setSortState}
          columns={columns}
          data={dataParsed}
          checkRows={false}
          rowLinkOnClick={rowLinkOnClick}
          filters={[
            {
              column: 'asthmaControl',
              options: controlLevelFilters,
            },
            {
              column: 'provider',
              options: selectedProviderFilter,
            },
          ]}
          initialState={{
            sortBy: [
              {
                id: state.patientTableSort.columnName,
                desc: state.patientTableSort.direction === 'desc',
              },
            ],
            hiddenColumns: false && !permissionPublicUserId ? [] : ['pui'], //For now, intentionally always hide
          }}
          leftContent={
            <div style={{ display: 'flex' }}>
              <MultiSelectChip
                labelText="Asthma Control"
                options={controlFilterOptions}
                selectedValues={controlLevelFilters}
                handleChange={handleChangeControlLevelFilter}
              />
              <ProviderSelect
                providers={Array.from(new Set(providerList))}
                providerFilter={selectedProviderFilter}
                handleChange={handleSelectProvider}
              />
            </div>
          }
        />
      )}
    </Paper>
  )
}

export default PatientsTable
