import React from 'react'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
  useRowSelect,
} from 'react-table'
import TableContainer from '@mui/material/TableContainer'
import {
  Checkbox,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
  Typography,
} from '@mui/material'
import TableToolbar from 'components/table/components/TableToolbar'
import CopyButton from 'components/table/components/CopyButton'
import IndeterminateCheckbox from 'components/table/components/IndeterminateCheckbox'
import Theme from 'constants/theme'
import { styled } from '@mui/system'
import { IBillingTable } from 'types'

const InnerTable = styled(Table)(({ theme }) => ({
  '& tr': {
    '& .copyRow, & .copyCell': {
      position: 'absolute',
      display: 'none',
      top: '50%',
      marginTop: '-14px',
    },
  },
  '& tr:hover': {
    '& .copyRow': {
      display: 'block',
      left: '-15px',
    },
  },
  '& td': {
    borderBottom: 'none',
    position: 'relative',
    width: '15%',
    '&:hover': {
      '& .copyCell': {
        display: 'inline-flex',
        marginLeft: theme.spacing(0.5),
      },
    },
  },
}))

function BillingTable({
  columns,
  data,
  rowLinkOnClick,
  leftHeaderContent,
  primaryAction,
}: IBillingTable) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    setPageSize,
    gotoPage,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ])
    }
  )

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value))
  }

  return (
    <TableContainer style={{ overflowX: 'initial', background: 'white' }}>
      <TableToolbar
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
        data={data}
        pageIndex={pageIndex}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        leftHeaderContent={leftHeaderContent}
        primaryAction={primaryAction}
      />
      <Table stickyHeader>
        <TableHead>
          {headerGroups.map((headerGroup, index) => (
            <TableRow key={`${index}_1`}>
              {headerGroup.headers.map((column, index) => {
                let columnWidth = index === 0 ? '4%' : '16%'
                return (
                  <TableCell style={{ width: columnWidth }} key={index}>
                    <>
                      <div className="th-content">
                        <div className="th-caption">
                          {column.render('Header')}
                        </div>
                      </div>
                    </>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, index) => {
            prepareRow(row)
            return (
              <TableRow
                hover={true}
                onClick={() => {
                  rowLinkOnClick(row.original.id)
                }}
                key={row.original.DOB + index}
              >
                <TableCell sx={{ verticalAlign: 'top' }}>
                  {row.cells[0].render('Cell')}
                </TableCell>
                <TableCell sx={{ verticalAlign: 'top' }}>
                  {row.cells[1].render('Cell')}
                </TableCell>

                <TableCell
                  colSpan={visibleColumns.length}
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                >
                  <TableContainer>
                    <InnerTable size="small">
                      <TableBody>
                        {row.original.billingItems.map((billingItem, index) => {
                          return (
                            <TableRow hover={true} key={index}>
                              <TableCell>
                                <CopyButton
                                  tooltipText="Copy Row"
                                  copyArea="row"
                                />
                                {billingItem.proceedure}
                                <CopyButton />
                              </TableCell>
                              <TableCell>
                                {billingItem.cycleLength}
                                <CopyButton />
                              </TableCell>
                              <TableCell>
                                {billingItem.timeSpent}
                                <CopyButton />
                              </TableCell>
                              <TableCell>
                                {billingItem.notes}{' '}
                                <CopyButton tooltipText="Copy all notes in this cycle" />
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  sx={{ pl: 0, pt: 0, pb: 0 }}
                                  checked={billingItem.submitted ? true : false}
                                  inputProps={{
                                    'aria-label': 'uncontrolled-checkbox',
                                  }}
                                />
                                <span
                                  style={{
                                    color: `${
                                      billingItem.submitted
                                        ? Theme.palette.grey[900]
                                        : Theme.palette.grey[600]
                                    }`,
                                  }}
                                >
                                  Submitted
                                </span>

                                <CopyButton />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </InnerTable>
                  </TableContainer>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BillingTable
