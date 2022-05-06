import { ReactElement, ReactChild } from 'react'
import { BaseTextFieldProps } from '@mui/material'

export type GeneralObject = { [key: string]: any }

// General UI Components
// --------------------------------------------------
export interface IDashCard {
  heading: string
  metric: number
  subhead?: string
  icon?: ReactElement
  statSubhead?: string
  statMetric?: number
  statMetricUp?: boolean
  arrow?: boolean
  variant?: 'severeWarn' | 'warn' | 'info' | 'default'
  href?: string
}

export interface IDrawer {
  children: ReactChild
  handleToggleDrawer: (...args: any[]) => any
  open: boolean
  anchor?: 'left' | 'right'
  sx?: any
  toolbar?: boolean
  attachedToMainNav?: boolean
}

export interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

// Text formatting
// --------------------------------------------------
export interface IPassFailText {
  condition: boolean
  children: string
}

// Data Viz
// --------------------------------------------------
export interface IGraphTooltip {
  active?: string
  payload?: any
  label?: string
}

export interface IVariabilityText {
  variability: 'Low' | 'High' | 'Moderate'
}

export interface ISparkline {
  data: any
}

// Patients
// --------------------------------------------------
// TODO: complete this type once we know more about the schema
export interface IPatient {
  firstName: string
  lastName: string
  id: string
  sex: string
  age: string
  DOB: string
  height: string
  ethnicity: string
  rescueMed: string
  controllerMed: string
  controllerMedFreequency: string
  personalCell: string
  email: string
  // asthmaControl: string
  rescueUsed: number
  variabilityLevel: string
  fev1BaselineChange: string
  adherence: string
  lastUsed: string
  physician: string
}

export interface INewPatient {
  hideDrawer?: (...args: any[]) => any
}

// Clinics, Clinic Users, & Customers
// --------------------------------------------------
export interface IClinicUser {
  firstName: string
  lastName: string
  pui: string
  roleDescription: string
  viewHealthWorkerDto?: GeneralObject
  _type?: string
  groupId?: string
  email?: string
  middlename?: string
  completedOn?: string
  createdOn?: string
  invitationTags?: [GeneralObject]
}

export interface IClinic {
  name: string
  poi: string
  users: [IClinicUser]
  ein?: string
  fax?: string
  phone?: string
}

export interface IUserCard {
  user: IClinicUser
  editInvite: (user) => void
}

export interface IAddStaff {
  clinic: IClinic
  handleChange?: (...args: any[]) => any
}

export interface IClinicSelect {
  clinic: string
  handleChange: (...args: any[]) => any
}

export interface INewClinic {
  hideDrawer?: (...args: any[]) => any
  optimisticallyUpdateClinics?: (...args: any[]) => any
}

export interface ICustomerInformation {
  name: string
}

// Billing
// --------------------------------------------------
export interface IBill {
  id: string
  firstName: string
  lastName: string
  DOB: string
  physician: string
  provider: string
  insuranceId: string
  insurerCopayAmount: string
  billingItems: any
}

export interface BillingItem {
  id: number
  claimed: boolean
  codes: [number]
  createdOn: string
  dob: string
  dos: string
  firstName: string
  lastName: string
  readings: number
  timeSpent: string
}

export interface IBillingTable {
  billingList: BillingItem[]
  billingTableError?: any
}

// Forms
// --------------------------------------------------

export interface IControlledTextField {
  name: string
  label?: string
  placeholder?: string
  rules?: { [key: string]: any }
  type?: BaseTextFieldProps['type'] | string
  sx?: { [key: string]: any }
  fullWidth?: boolean
  required?: boolean
  rows?: number
  multiline?: boolean
  size?: BaseTextFieldProps['size']
  disabled?: BaseTextFieldProps['disabled']
  variant?: BaseTextFieldProps['variant']
  color?: BaseTextFieldProps['color']
  focused?: BaseTextFieldProps['focused']
  hightlightIfEmpty?: boolean
}

export interface IDateField {
  name: string
  label?: string
  rules?: { [key: string]: any }
  sx?: { [key: string]: any }
  fullWidth?: boolean
  required?: boolean
  disabled?: BaseTextFieldProps['disabled']
  size?: BaseTextFieldProps['size']
  color?: BaseTextFieldProps['color']
  focused?: BaseTextFieldProps['focused']
  hightlightIfEmpty?: boolean
}

export interface IPhoneNumberField {
  name: string
  label?: string
  rules?: { [key: string]: any }
  sx?: { [key: string]: any }
  fullWidth?: boolean
  required?: boolean
  disabled?: BaseTextFieldProps['disabled']
  size?: BaseTextFieldProps['size']
  color?: BaseTextFieldProps['color']
  focused?: BaseTextFieldProps['focused']
  hightlightIfEmpty?: boolean
}

export interface IGeneralSelect {
  label: any
  value?: any
  options?: Array<any>
  minWidth?: number
  handleChange: (...args: any[]) => any
}

export interface IProviderSelect {
  providers: Array<string>
  providerFilter: string
  handleChange: (...args: any[]) => any
}

export interface IControlLevelSelect {
  controlLevel: any
  handleChange: (...args: any[]) => any
}

// These enums enable this component to show either, mailing, billing,
// or a checkbox to fill in each
export interface IAddressFields {
  type?: 'mailing' | 'billing' | 'home' | 'mailing+billing'
  billingCheck: boolean
  showNotes: boolean
  hightlightIfEmpty?: boolean
}

export interface IMultiSelectChip {
  labelText: string
  options: Array<string>
  selectedValues: Array<string>
  handleChange: (...args: any[]) => any
}

type ToolbarContentBehavior = 'showOnSelect' | 'enableOnSelect' | 'default'

export interface IGenericTable<D> {
  columns: Array<any>
  data: Array<D>
  leftContent?: ReactElement
  rightContent?: ReactElement
  skipPageReset?: boolean
  children?: any
  setData?: (...args: any[]) => any
  updateData?: (...args: any[]) => any
  rowLinkOnClick?: (...args: any[]) => any
  filters?: Array<GeneralObject>
  checkRows?: boolean
  getRowProps?: any
  filterPlaceholderText?: string
  initialState?: GeneralObject
  enableGlobalFilter?: boolean
  enablePagination?: boolean
  retainSortState?: boolean
  sortStateRecorder?: (memoColumn: string, memoDirection: string) => void
  leftContentBehavior?: ToolbarContentBehavior
  rightContentBehavior?: ToolbarContentBehavior
}

export interface ITableToolbar {
  addUserHandler?: (...args: any[]) => any
  deleteUserHandler?: (...args: any[]) => any
  preGlobalFilteredRows: any
  setGlobalFilter: (...args: any[]) => any
  numSelected: number
  globalFilter: any
  handleChangePage: (...args: any[]) => any
  handleChangeRowsPerPage: (...args: any[]) => any
  data: any
  pageIndex: any
  pageSize?: any
  enableLeftOnRowSelect?: boolean
  showLeftOnRowSelect?: boolean
  leftContent?: ReactElement
  enableRightOnRowSelect?: boolean
  showRightOnRowSelect?: boolean
  rightContent?: ReactElement
  enableGlobalFilter?: boolean
  enablePagination?: boolean
  filterPlaceholderText?: string
  displayedData?: any[]
  leftContentBehavior?: ToolbarContentBehavior
  rightContentBehavior?: ToolbarContentBehavior
}

// export interface IBillingTable {
//   columns: Array<any>
//   data: Array<any>
//   rowLinkOnClick?: (...args: any[]) => any
//   leftHeaderContent: any
//   primaryAction: any
// }

export interface IBillingDetailsTable {
  columns: Array<any>
  data: Array<any>
  rowLinkOnClick?: (...args: any[]) => any
  leftHeaderContent?: any
  primaryAction?: any
  toolbar?: boolean
}

export interface IEditableCell {
  value: number
  row: { [key: string]: number }
  column: { [key: string]: number }
  updateData: (...args: any[]) => any
}

// Todo: type this properly
export interface IGlobalFilter {
  preGlobalFilteredRows: any
  globalFilter: any
  setGlobalFilter: any
  placeholder?: string
}

// Graph Controls
// --------------------------------------------------

export type ChartPeriod = 'week' | '1m' | '3m'

export interface ICustomXAxisMedicationMarker {
  x?: number
  y?: number
  color?: string
  payload?: GeneralObject
  chartPeriod?: ChartPeriod
  type?: 'rescue' | 'controller'
}

// SWR Requests
// --------------------------------------------------
export interface IProjection {
  axes: [
    {
      axisData: [any]
      axisId: string
      axisName: string
      axisSteps: [object]
      axisType: string
      dataType: string
    }
  ]
  createdOn: string
  groups: [object]
  id: string
  name: string
  pui: string
  reportCode: string
  reportTags: []
  reportVersion: number
  series: [{ seriesId: string; seriesData: [] }]
}
