import React from 'react'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
  useRowSelect,
  useExpanded,
} from 'react-table'
import {
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
} from '@mui/material'
import TableToolbar from 'components/table/components/TableToolbar'
import clsx from 'clsx'
import { styled } from '@mui/system'
import { IBillingDetailsTable } from 'types'

const BillingDetailsTable = styled(TableContainer)(({ theme }) => ({
  '& table': {
    display: 'table!important',
    whiteSpace: 'initial',
  },
  '& tr': {
    // border: '1px solid red!important',
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
    // borderBottom: 'none',
    position: 'relative',
    '&:hover': {
      '& .copyCell': {
        right: 0,
        display: 'inline-flex',
        marginLeft: theme.spacing(0.5),
      },
    },
  },
}))

const TableRowStyle = styled(TableRow)(({ theme }) => ({
  '&.subRow': {
    borderBottom: 'none',
  },
}))

function BillingTable({
  columns,
  data,
  rowLinkOnClick,
  leftHeaderContent,
  primaryAction,
  toolbar = true,
}: IBillingDetailsTable) {
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
    state: { pageIndex, pageSize, selectedRowIds, globalFilter, expanded },
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks) => {}
  )

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value))
  }

  return (
    <BillingDetailsTable
      style={{
        overflowX: 'initial',
        background: 'white',
      }}
    >
      {toolbar && (
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
      )}
      <Table size="small" stickyHeader>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => {
                return (
                  <TableCell {...column.getHeaderProps()}>
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
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <TableRowStyle
                hover={true}
                {...row.getRowProps()}
                className={clsx(
                  row.getRowProps().key.indexOf('.') !== -1 && 'subRow'
                )}
              >
                {row.cells.map((cell) => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  )
                })}
              </TableRowStyle>
            )
          })}
        </TableBody>
      </Table>
    </BillingDetailsTable>
  )
}

export default BillingTable
