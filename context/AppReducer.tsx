import combineReducers from 'react-combine-reducers'
import { ReactElement } from 'react'
enum ActionName {
  SET_PAGE_HEADING = 'SET_PAGE_HEADING',
  SET_TIMER_RUNNING = 'SET_TIMER_RUNNING',
  SET_PATIENT_DATA = 'SET_PATIENT_DATA',
  SET_CHART_PERIOD = 'SET_CHART_PERIOD',
  SET_TOKEN = 'SET_TOKEN',
}

enum ChartPeriod {
  WEEK = 'week',
  THREE_MONTH = '1m',
  ONE_MONTH = 'week',
}

type Action = {
  type: string
  payload: any
}

// Types for global App State
type PageHeadingState = {
  pageHeading1: string
  pageHeading2?: string
  component?: ReactElement
}

// TODO: fill this in or reference existing type
// types like this need to be centralized
type Patient = object

type PatientDataState = [
  {
    [key: string]: Patient
  }
]

type PatientSearch = {
  controlLevelFilters: string[]
  selectedProviderFilter: string[]
}

type TimerState = {
  running: boolean
  visitId?: string | null
  stopTimer?: () => void
}

type AppState = {
  pageHeading: PageHeadingState
  timer: TimerState

  // TODO: flesh out what the shape of this data is and type it
  // once the swagger definition is complete (state: PatientDataState)
  patientData: PatientDataState
  chartPeriod: ChartPeriod
  patientSearch: PatientSearch
  patientTableSort: PatientTableSort
  token: object
}

// A reducer type to aggregate (n) reducers
type AppStateReducer = (state: AppState, action: Action) => AppState

// Initial State for the app
const initialPageHeading = {
  pageHeading1: '',
  pageHeading2: '',
}

const initialTimer = {
  running: false,
}

const initialChartPeriod = ChartPeriod.WEEK

const initialPatientData: PatientDataState = [{}]

const initialPatientSearch: PatientSearch = {
  controlLevelFilters: ['all'],
  selectedProviderFilter: ['All Providers'],
}

type PatientTableSort = { columnName: string; direction: 'asc' | 'desc' }

const initialPatientTableSort: PatientTableSort = {
  columnName: 'asthmaControl',
  direction: 'desc',
}

// Perhaps can make this more explicit with STOP_PATIENT_CARE_TIMER
// and STOP_PATIENT_CARE_TIMER action cases
// I have kept the CRUD to a minimum for this first POC
const timerReducer = (state: TimerState, action: Action) => {
  switch (action.type) {
    case ActionName.SET_TIMER_RUNNING:
      return { ...state, ...action.payload }
    // case ActionName.STOP_PATIENT_CARE_TIMER:
    //   return { running: false }
    default:
      return state
  }
}

const pageHeadingReducer = (state: PageHeadingState, action: Action) => {
  switch (action.type) {
    case ActionName.SET_PAGE_HEADING: {
      return {
        ...state,
        ...action.payload,
      }
    }
    default:
      return state
  }
}

// TODO: flesh out what the shape of this data is and type it
// once the swagger definition is complete (state: PatientDataState)
const patientDataReducer = (state: PatientDataState, action) => {
  switch (action.type) {
    case ActionName.SET_PATIENT_DATA: {
      return action.payload
    }
    default:
      return state
  }
}

const chartPeriodReducer = (state: ChartPeriod, action: Action) => {
  switch (action.type) {
    case ActionName.SET_CHART_PERIOD: {
      return action.payload
    }
    default:
      return state
  }
}

const patientSearchReducer = (state: PatientSearch, action: Action) => {
  switch (action.type) {
    case 'SET_SELECTED_PROVIDER_FILTER': {
      return { ...state, ...action.payload }
    }
    case 'SET_CONTROL_LEVEL_FILTERS': {
      return { ...state, ...action.payload }
    }
    default:
      return state
  }
}

const patientTableSortReducer = (state: PatientTableSort, action: Action) => {
  switch (action.type) {
    case 'SET_PATIENT_TABLE_SORT': {
      return { ...state, ...action.payload }
    }
    case 'CLEAR_PATIENT_TABLE_SORT': {
      const update = { columnName: '', direction: 'asc' }
      return { ...state, ...update }
    }
    default:
      return state
  }
}

const tokenReducer = (state: object, action: Action) => {
  switch (action.type) {
    case 'SET_TOKEN': {
      return action.payload
    }
    default:
      return state
  }
}

// This is exposed for use in AppContext.tsx so bootstrap our store/state
export const [AppReducer, initialState] = combineReducers<AppStateReducer>({
  pageHeading: [pageHeadingReducer, initialPageHeading],
  timer: [timerReducer, initialTimer],
  patientData: [patientDataReducer, initialPatientData],
  chartPeriod: [chartPeriodReducer, initialChartPeriod],
  patientSearch: [patientSearchReducer, initialPatientSearch],
  patientTableSort: [patientTableSortReducer, initialPatientTableSort],
  token: [tokenReducer, {}],
})
